const MonthlySummaryService = require('./montlySummary.service');

class MonthlySummaryController {
  async getAll(req, res, next) {
    try {
      const data = await MonthlySummaryService.getAll();
      res.status(200).json({
        success: true,
        message: 'Monthly summaries list retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await MonthlySummaryService.getById(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Monthly summaries data retrieved successfully',
        data,
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
      const result = await MonthlySummaryService.create(data);
      res.status(201).json({
        success: true,
        message: 'Monthly summaries created successfully',
        result,
      });
    } catch (error) {
      next(error);
    }
  }
  async update(req, res, next) {
    try {
      const result = await MonthlySummaryService.update(
        req.params.id,
        req.body
      );
      res.status(200).json({
        success: true,
        message: 'Monthly summaries updated successfully',
        result,
      });
    } catch (error) {
      next(error);
    }
  }
  async delete(req, res, next) {
    try {
      await MonthlySummaryService.delete(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Monthly summaries deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MonthlySummaryController();
