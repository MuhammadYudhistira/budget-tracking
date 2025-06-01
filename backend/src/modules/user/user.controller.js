const NotFound = require('../../errors/NotFoundError');
const UserService = require('./user.service');

class userController {
  async getAll(req, res, next) {
    try {
      const users = await UserService.getAll();
      if (users.length === 0) throw new NotFound('Data user tidak ada');
      res.json({
        success: true,
        message: 'User berhasil didapatkan',
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const user = await UserService.getById(req.params.id);
      if (!user) throw new NotFound('Data user tidak ada');
      res.json({
        success: true,
        message: 'User berhasil didapatkan',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const user = await UserService.create(req.body);
      res
        .status(201)
        .json({ succes: true, message: 'User berhasil dibuat', data: user });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const user = await UserService.update(req.params.id, req.body);
      if (!user) throw new NotFound('Data user tidak ditemukan');
      res.status(201).json({
        success: true,
        message: 'User berhasil diperbarui',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const user = await UserService.delete(req.params.id);
      if (!user) throw new NotFound('Data user tidak ditemukan');
      res.status(200).json({
        success: true,
        message: 'User berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new userController();
