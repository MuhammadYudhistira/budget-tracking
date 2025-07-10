"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("transactions", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            type: {
                type: Sequelize.ENUM("income", "expense"),
                allowNull: false,
            },
            amount: { type: Sequelize.STRING, allowNull: false },
            date: { type: Sequelize.DATE, allowNull: false },
            note: { type: Sequelize.TEXT },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            category_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "categories", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            wallet_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "wallets", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("transactions");
        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_transactions_type";'
        );
    },
};
