const walletService = require("./wallet.service");

class WalletController {
    async getAllByUser(req, res, next) {
        try {
            const wallets = await walletService.getAllByUser(req.user.id);
            if (wallets.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No wallets found for this user",
                });
            }
            res.status(200).json({
                success: true,
                message: "Wallets retrieved successfully",
                data: wallets,
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const wallet = await walletService.getById(req.params.id);
            if (wallet.user_id !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: "You do not have permission to access this wallet",
                });
            }
            res.status(200).json({
                success: true,
                message: "Wallet retrieved successfully",
                data: wallet,
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const data = {
                ...req.body,
                user_id: req.user.id,
            };
            const wallet = await walletService.create(data);
            res.status(201).json({
                success: true,
                message: "Wallet created successfully",
                data: wallet,
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const wallet = await walletService.update(req.params.id, req.body);
            if (wallet.user_id !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: "You do not have permission to update this wallet",
                });
            }
            res.status(200).json({
                success: true,
                message: "Wallet updated successfully",
                data: wallet,
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const wallet = await walletService.getById(req.params.id);
            if (wallet.user_id !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: "You do not have permission to delete this wallet",
                });
            }
            await walletService.delete(req.params.id);
            res.status(200).json({
                success: true,
                message: "Wallet deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new WalletController();
