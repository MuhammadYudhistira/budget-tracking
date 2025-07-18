const express = require('express');
const router = express.Router();

const UserController = require('./user.controller');
const asyncErrorHandler = require('../../errors/asyncErrorHandler');
const validateRequest = require('../../middlewares/validation.middleware');
const {
  idParamValidator,
  createUserValidator,
  updateUserValidator,
} = require('./user.validator');
const authJWT = require('../../middlewares/auth.middleware');

router.use(authJWT);

router.get('/', asyncErrorHandler(UserController.getAll.bind(UserController)));
router.get(
  '/:id',
  idParamValidator,
  validateRequest,
  asyncErrorHandler(UserController.getById.bind(UserController))
);
router.post(
  '/',
  createUserValidator,
  validateRequest,
  asyncErrorHandler(UserController.create.bind(UserController))
);
router.put(
  '/:id',
  idParamValidator,
  validateRequest,
  updateUserValidator,
  asyncErrorHandler(UserController.update.bind(UserController))
);
router.delete(
  '/:id',
  idParamValidator,
  validateRequest,
  asyncErrorHandler(UserController.delete.bind(UserController))
);

module.exports = router;
