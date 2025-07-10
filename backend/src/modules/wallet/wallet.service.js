const { Wallet } = require("../../../models");
const NotFound = require("../../errors/NotFoundError");

class walletService {
    async getAllByUser(userId) {
        return await Wallet.findAll({
            where: { user_id: userId },
            order: [["createdAt", "DESC"]],
            attributes: ["id", "name", "balance", "createdAt"],
        });
    }

    async getById(id) {
        const wallet = await Wallet.findByPk(id);
        if (!wallet) throw new NotFound("Wallet not found");
        return wallet;
    }

    async create(data) {
        return await Wallet.create(data);
    }

    async update(id, data) {
        const wallet = await Wallet.findByPk(id);
        if (!wallet) throw new NotFound("Wallet not found");

        try {
            await wallet.update(data, { validates: true });
        } catch (error) {
            console.error("error", error);
            throw new ServerError("Failed to update wallet");
        }
        return wallet;
    }

    async delete(id) {
        const wallet = await Wallet.findByPk(id);
        if (!wallet) throw new NotFound("Wallet not found");
        await wallet.destroy();
        return true;
    }
}

module.exports = new walletService();
