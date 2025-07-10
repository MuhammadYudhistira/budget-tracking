module.exports = (sequelize, DataTypes) => {
    const Wallet = sequelize.define(
        "Wallet",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            balance: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0.0,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "users", key: "id" },
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
            tableName: "wallets",
            timestamps: true,
            underscored: true,
        }
    );

    Wallet.associate = (models) => {
        Wallet.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "user",
        });

        Wallet.hasMany(models.Transaction, {
            foreignKey: "wallet_id",
            as: "transactions",
        });
    };

    return Wallet;
};
