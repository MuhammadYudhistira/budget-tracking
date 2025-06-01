const express = require('express');
const router = express.Router();

const {
  createMonthlySummaryValidator,
  idParamValidator,
  updateMonthlySummaryValidator,
} = require('./monthlySummary.validator');
const validateRequest = require('../../middlewares/validation.middleware');
const asyncErrorHandler = require('../../errors/asyncErrorHandler');
const authJWT = require('../../middlewares/auth.middleware');
const montlySummaryController = require('./montlySummary.controller');

router.use(authJWT);

router.get(
  '/',
  asyncErrorHandler(
    montlySummaryController.getAll.bind(montlySummaryController)
  )
);
router.get(
  '/:id',
  idParamValidator,
  validateRequest,
  asyncErrorHandler(
    montlySummaryController.getById.bind(montlySummaryController)
  )
);
router.post(
  '/',
  createMonthlySummaryValidator,
  validateRequest,
  asyncErrorHandler(
    montlySummaryController.create.bind(montlySummaryController)
  )
);
router.put(
  '/:id',
  idParamValidator,
  updateMonthlySummaryValidator,
  validateRequest,
  asyncErrorHandler(
    montlySummaryController.update.bind(montlySummaryController)
  )
);
router.delete(
  '/:id',
  idParamValidator,
  validateRequest,
  asyncErrorHandler(
    montlySummaryController.delete.bind(montlySummaryController)
  )
);

module.exports = router;
