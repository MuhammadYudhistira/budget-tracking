const express = require('express');
const router = express.Router();

const userRoutes = require('./modules/user/user.routes');
const authRoutes = require('./modules/auth/auth.routes');
const transactionRoutes = require('./modules/transaction/transaction.route');
const monthlySummaryRoutes = require('./modules/monthlySummary/montlySummary.routes');
const NotFound = require('./errors/NotFoundError');

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/transaction', transactionRoutes);
router.use('/monthly-summary', monthlySummaryRoutes);

router.use((req, res) => {
  throw new NotFound('Route not Found');
});

module.exports = router;
