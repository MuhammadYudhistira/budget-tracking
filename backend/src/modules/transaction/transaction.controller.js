const ForbiddenError = require('../../errors/ForbiddenError');
const TransactionService = require('./transaction.service');
class TransactionController {
  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await TransactionService.getAllByUser(
        req.userId,
        page,
        limit,
        search
      );

      res.status(200).json({
        success: true,
        message: 'Transactions retrieved successfully',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const transaction = await TransactionService.getById(req.params.id);
      if (transaction.user_id !== req.userId)
        throw new ForbiddenError(
          'You do not have permission to access this transaction'
        );

      res.status(200).json({
        success: true,
        message: 'Transaction retrieved successfully',
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const data = {
        ...req.body,
        user_id: req.userId,
      };
      const transaction = await TransactionService.create(data);
      res.status(201).json({
        success: true,
        message: 'Transaction added successfully',
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const transaction = await TransactionService.getById(req.params.id);
      if (transaction.user_id !== req.userId)
        throw new ForbiddenError(
          'You do not have permission to access this transaction'
        );

      const data = { ...req.body };
      delete data.user_id;

      const updatedTransaction = await TransactionService.update(
        req.params.id,
        data
      );

      return res.status(200).json({
        success: true,
        message: 'Transaction updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await TransactionService.delete(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Transaction deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getMonthlySummary(req, res, next) {
    try {
      const data = await TransactionService.getMonthlySummary(req.userId);
      return res.status(200).json({
        success: true,
        message: 'Monthly Summary retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMonthlyChart(req, res, next) {
    try {
      const data = await TransactionService.getMonthlyChart(req.userId);
      return res.status(200).json({
        success: true,
        message: 'Monthly Chart retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTodayTransactions(req, res, next) {
    try {
      const data = await TransactionService.getTodayTransactions(req.userId);
      return res.status(200).json({
        success: true,
        message: 'Today Transaction retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTodayExpense(req, res, next) {
    try {
      const data = await TransactionService.getTodayExpenseStats(req.userId);
      return res.status(200).json({
        success: true,
        message: 'Today Expense retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPieChartData(req,res,next) {
    try {
      const pieChartData = await TransactionService.getPieChartData(req.userId);
      return res.status(200).json({
        success: true,
        message: 'Pie Chart Data retrieved successfully',
        data: pieChartData,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TransactionController();
