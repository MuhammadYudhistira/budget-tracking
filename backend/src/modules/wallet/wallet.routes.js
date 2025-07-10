const express = require("express");
const authJWT = require("../../middlewares/auth.middleware");
const asyncErrorHandler = require("../../errors/asyncErrorHandler");
const walletController = require("./wallet.controller");
const {
    idParamValidator,
} = require("../monthlySummary/monthlySummary.validator");
const router = express.Router();

router.use(authJWT);

router.get(
    "/",
    asyncErrorHandler(walletController.getAllByUser.bind(walletController))
);

router.get(
    "/:id",
    idParamValidator,
    asyncErrorHandler(walletController.getById.bind(walletController))
);

router.post(
    "/",
    asyncErrorHandler(walletController.create.bind(walletController))
);

router.put(
    "/:id",
    idParamValidator,
    asyncErrorHandler(walletController.update.bind(walletController))
);

router.delete(
    "/:id",
    idParamValidator,
    asyncErrorHandler(walletController.delete.bind(walletController))
);

module.exports = router;
