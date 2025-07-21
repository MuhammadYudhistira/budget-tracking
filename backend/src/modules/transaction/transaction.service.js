const { Op, where } = require("sequelize");
const {
    Transaction,
    User,
    Category,
    Wallet,
    sequelize,
} = require("../../../models");
const { includes, date } = require("zod/v4");
const NotFound = require("../../errors/NotFoundError");
const BadRequestError = require("../../errors/BadRequestError");

class TransactionService {
    async getAllByUser(userId, page = 1, limit = 10, search = "") {
        const offset = (page - 1) * limit;

        const whereClause = {
            user_id: userId,
        };

        if (search) {
            whereClause[Op.or] = [
                { note: { [Op.like]: `%${search}%` } },
                { desc: { [Op.like]: `%${search}%` } },
            ];
        }

        const { count, rows } = await Transaction.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Category,
                    attributes: ["name", "description"],
                    as: "category",
                    require: false,
                },
                {
                    model: User,
                    attributes: ["id", "name", "email", "number"],
                    as: "user",
                    require: false,
                },
                {
                    model: Wallet,
                    attributes: ["id", "name", "balance"],
                    as: "wallet",
                    require: false,
                },
            ],
            order: [
                ["date", "DESC"],
                ["id", "DESC"],
            ],
            limit,
            offset,
            distinct: true,
        });

        return {
            data: rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
            },
        };
    }

    async getById(id) {
        const transaction = await Transaction.findByPk(id, {
            include: [
                {
                    model: Category,
                    attributes: ["name", "description"],
                    as: "category",
                    require: false,
                },
                {
                    model: User,
                    attributes: ["id", "name", "email", "number"],
                    as: "user",
                    require: false,
                },
                {
                    model: Wallet,
                    attributes: ["id", "name", "balance"],
                    as: "wallet",
                    require: false,
                },
            ],
        });

        if (!transaction) throw new NotFound("Transaction not found");
        return transaction;
    }

    async create(data) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        if (data.wallet_id === undefined) {
            throw new BadRequestError(
                "Pilih Wallet terlebih dahulu, Jika belum ada, silahkan buat Wallet terlebih dahulu"
            );
        }

        const transactions = await Transaction.findAll({
            where: {
                user_id: data.user_id,
                date: {
                    [Op.between]: [startOfMonth, endOfMonth],
                },
            },
        });

        let totalIncome = 0;
        let totalExpense = 0;

        for (const tx of transactions) {
            const amount = parseInt(tx.amount);
            if (tx.type === "income") totalIncome += amount;
            if (tx.type === "expense") totalExpense += amount;
        }

        const amountToAdd = parseInt(data.amount);

        const wallet = await Wallet.findByPk(data.wallet_id);
        console.log(wallet.balance, totalExpense, amountToAdd);
        if (data.type === "expense" && wallet.balance < amountToAdd) {
            throw new BadRequestError(
                "Saldo Wallet tidak mencukupi untuk transaksi ini"
            );
        }

        if (!wallet) throw new NotFound("Wallet not found");

        if (data.type === "income") {
            wallet.balance = parseInt(wallet.balance) + amountToAdd;
        } else {
            wallet.balance = parseInt(wallet.balance) - amountToAdd;
        }
        await wallet.save();

        return await Transaction.create(data);
    }

    async update(id, data) {
        const transaction = await Transaction.findByPk(id);
        if (!transaction) {
            throw new NotFound("Transaction not found");
        }

        // Konversi data baru ke tipe yang benar
        const newAmount = parseInt(data.amount);
        const newType = data.type;
        const newWalletId = data.walletId ? parseInt(data.walletId) : null;

        // Konversi data lama
        const oldAmount = parseInt(transaction.amount);
        const oldType = transaction.type;
        const oldWalletId = transaction.wallet_id;

        const isWalletChanging = newWalletId && newWalletId !== oldWalletId;

        if (isWalletChanging) {
            // --- LOGIKA JIKA DOMPET BERPINDAH ---

            // 1. Ambil kedua dompet
            const oldWallet = await Wallet.findByPk(oldWalletId);
            const newWallet = await Wallet.findByPk(newWalletId);
            if (!oldWallet || !newWallet)
                throw new NotFound("One of the wallets not found");

            // 2. Validasi saldo di dompet BARU
            if (
                newType === "expense" &&
                parseInt(newWallet.balance) < newAmount
            ) {
                throw new BadRequestError(
                    "Saldo di dompet tujuan tidak mencukupi"
                );
            }

            // 3. Kembalikan saldo di dompet LAMA
            if (oldType === "income") {
                oldWallet.balance = parseInt(oldWallet.balance) - oldAmount;
            } else {
                // expense
                oldWallet.balance = parseInt(oldWallet.balance) + oldAmount;
            }
            await oldWallet.save();

            // 4. Terapkan saldo di dompet BARU
            if (newType === "income") {
                newWallet.balance = parseInt(newWallet.balance) + newAmount;
            } else {
                // expense
                newWallet.balance = parseInt(newWallet.balance) - newAmount;
            }
            await newWallet.save();
        } else {
            // --- LOGIKA JIKA DOMPET TETAP SAMA --- (Kode yang kita buat sebelumnya)
            const wallet = await Wallet.findByPk(oldWalletId);
            if (!wallet) throw new NotFound("Wallet not found");

            const revertedBalance =
                parseInt(wallet.balance) +
                (oldType === "expense" ? oldAmount : -oldAmount);

            if (newType === "expense" && revertedBalance < newAmount) {
                throw new BadRequestError(
                    "Saldo Wallet tidak mencukupi untuk mengubah transaksi ini"
                );
            }

            wallet.balance =
                revertedBalance +
                (newType === "income" ? newAmount : -newAmount);
            await wallet.save();
        }

        // --- TERAKHIR: UPDATE DATA TRANSAKSI ---
        // Perintah ini akan memperbarui semua field (amount, note, date, categoryId, walletId, dll)
        console.log("DATA FINAL YANG AKAN DI-UPDATE:", data);
        data.category_id = data.categoryId ? parseInt(data.categoryId) : null;
        await transaction.update(data);

        return true;
    }

    async delete(id) {
        const transaction = await Transaction.findByPk(id);
        if (!transaction) throw new NotFound("Transaction not found");

        const wallet = await Wallet.findByPk(transaction.wallet_id);
        if (!wallet) throw new NotFound("Wallet not found");

        const amount = parseInt(transaction.amount);
        wallet.balance = parseInt(wallet.balance);

        if (transaction.type === "income") {
            wallet.balance -= amount;
        } else {
            wallet.balance += amount;
        }

        await wallet.save();
        await transaction.destroy();

        return true;
    }

    async getMonthlySummary(userId) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const transactions = await Transaction.findAll({
            where: {
                user_id: userId,
                date: {
                    [Op.between]: [startOfMonth, endOfMonth],
                },
            },
        });

        let totalIncome = 0;
        let totalExpense = 0;

        for (const tx of transactions) {
            const amount = parseInt(tx.amount);
            if (tx.type === "income") totalIncome += amount;
            if (tx.type === "expense") totalExpense += amount;
        }

        const balance = totalIncome - totalExpense;
        const saving = Math.floor(
            Math.max(0, totalIncome - totalExpense) * 0.3 + totalIncome * 0.05
        );

        return {
            income: totalIncome,
            expense: totalExpense,
            balance,
            saving,
        };
    }

    async getMonthlyChart(userId) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const transactions = await Transaction.findAll({
            where: {
                user_id: userId,
                date: {
                    [Op.between]: [startOfMonth, endOfMonth],
                },
            },
        });

        const daysInMonth = endOfMonth.getDate();
        const chartData = [];

        for (let day = 1; day <= daysInMonth; day++) {
            chartData.push({
                date: `${now.getFullYear()}-${String(
                    now.getMonth() + 1
                ).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
                income: 0,
                expense: 0,
            });
        }

        for (const tx of transactions) {
            const date = new Date(tx.date);
            const day = date.getDate();
            const amount = parseInt(tx.amount);

            if (chartData[day - 1]) {
                if (tx.type === "income") chartData[day - 1].income += amount;
                if (tx.type === "expense") chartData[day - 1].expense += amount;
            }
        }

        return chartData;
    }

    async getTodayTransactions(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const transactions = await Transaction.findAll({
            where: {
                user_id: userId,
                date: {
                    [Op.between]: [today, endOfDay],
                },
            },
            order: [["date", "DESC"]],
            include: [
                {
                    model: Category,
                    attributes: ["name", "description"],
                    as: "category",
                    require: false,
                },
                {
                    model: User,
                    attributes: ["id", "name", "email", "number"],
                    as: "user",
                    require: false,
                },
            ],
        });

        return transactions;
    }

    async getTodayExpenseStats(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        const transactions = await Transaction.findAll({
            where: {
                user_id: userId,
                date: {
                    [Op.between]: [today, endOfDay],
                },
            },
            order: [["date", "DESC"]],
            include: [
                {
                    model: Category,
                    attributes: ["name", "description"],
                    as: "category",
                    require: false,
                },
                {
                    model: User,
                    attributes: ["id", "name", "email", "number"],
                    as: "user",
                    require: false,
                },
            ],
        });

        return transactions;
    }

    async getTodayExpenseStats(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        const transactions = await Transaction.findAll({
            where: {
                user_id: userId,
                type: "expense",
                date: {
                    [Op.between]: [today, endOfDay],
                },
            },
            order: [["date", "DESC"]],
        });

        const totalExpense = transactions.reduce(
            (sum, tx) => sum + parseInt(tx.amount),
            0
        );

        return {
            totalExpense,
            count: transactions.length,
        };
    }

    async getPieChartData(userId) {
        try {
            const pieChartData = await Transaction.findAll({
                attributes: [
                    [sequelize.col("category.name"), "name"],
                    [
                        sequelize.fn(
                            "SUM",
                            sequelize.cast(sequelize.col("amount"), "DECIMAL")
                        ),
                        "value",
                    ],
                ],
                include: [
                    {
                        model: Category,
                        as: "category",
                        attributes: [],
                    },
                ],
                where: {
                    user_id: userId,
                    type: "expense",
                },
                group: ["category.id", "category.name"],
                order: [[sequelize.fn("SUM", sequelize.col("amount")), "DESC"]],
                raw: true,
            });

            const formattedData = pieChartData.map((item) => ({
                ...item,
                value: parseFloat(item.value),
            }));

            return formattedData;
        } catch (error) {
            console.error("Error fetching pie chart data:", error);
            throw new Error("Gagal mengambil data untuk pie chart");
        }
    }
}

module.exports = new TransactionService();
