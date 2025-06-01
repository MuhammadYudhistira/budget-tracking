const express = require('express');
const router = express.Router();
const {
  createTransactionValidator,
  idParamValidator,
  updateTransactionValidator,
} = require('./transaction.validator');
const authJWT = require('../../middlewares/auth.middleware');
const transactionController = require('./transaction.controller');
const asyncErrorHandler = require('../../errors/asyncErrorHandler');
const validateRequest = require('../../middlewares/validation.middleware');

router.use(authJWT);

router.get(
  '/',
  asyncErrorHandler(transactionController.getAll.bind(transactionController))
);
router.get(
  '/monthly-summary',
  asyncErrorHandler(
    transactionController.getMonthlySummary.bind(transactionController)
  )
);
router.get(
  '/monthly-chart',
  asyncErrorHandler(
    transactionController.getMonthlyChart.bind(transactionController)
  )
);
router.get(
  '/today',
  asyncErrorHandler(
    transactionController.getTodayTransactions.bind(transactionController)
  )
);
router.get(
  '/today-expense-stats',
  asyncErrorHandler(
    transactionController.getTodayExpense.bind(transactionController)
  )
);

router.get(
  '/:id',
  idParamValidator,
  validateRequest,
  asyncErrorHandler(transactionController.getById.bind(transactionController))
);
router.post(
  '/',
  createTransactionValidator,
  validateRequest,
  asyncErrorHandler(transactionController.create.bind(transactionController))
);
router.put(
  '/:id',
  idParamValidator,
  updateTransactionValidator,
  validateRequest,
  asyncErrorHandler(transactionController.update.bind(transactionController))
);
router.delete(
  '/:id',
  idParamValidator,
  asyncErrorHandler(transactionController.delete.bind(transactionController))
);

module.exports = router;
