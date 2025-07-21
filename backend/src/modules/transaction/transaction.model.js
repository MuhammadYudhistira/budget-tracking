module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define(
        "Transaction",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            type: {
                type: DataTypes.ENUM("income", "expense"),
                allowNull: false,
            },
            amount: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            note: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            category_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "categories", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            wallet_id: {
                type: DataTypes.INTEGER,
                allowNull: false, // Sesuaikan jika boleh null
                references: { model: "wallets", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            created_at: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updated_at: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "transactions",
            timestamps: true,
            underscored: true,
        }
    );

    Transaction.associate = (models) => {
        Transaction.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "user",
        });
        Transaction.belongsTo(models.Wallet, {
            foreignKey: "wallet_id",
            as: "wallet",
        });
        Transaction.belongsTo(models.Category, {
            foreignKey: "category_id",
            as: "category",
        });
    };

    return Transaction;
};
