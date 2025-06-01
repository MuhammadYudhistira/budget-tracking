const { User } = require('../../../models');
const bcrypt = require('bcrypt');
const BadRequestError = require('../../errors/BadRequestError');
const ServerError = require('../../errors/ServerError');

class userService {
  constructor() {
    this.SALT_ROUNDS = 10;
  }

  async getAll() {
    return await User.findAll({ attributes: { exclude: ['password'] } });
  }

  async getById(id) {
    return await User.findByPk(id, { attributes: { exclude: ['password'] } });
  }

  async create(data) {
    const existingUser = await User.findOne({ where: { email: data.email } });

    if (existingUser) {
      throw new BadRequestError('Email already exists');
    }

    const hash = await bcrypt.hash(data.password, this.SALT_ROUNDS);

    const newUser = await User.create({
      ...data,
      password: hash,
    });

    const userJson = newUser.toJSON();
    delete userJson.password;

    return userJson;
  }

  async update(id, data) {
    const user = await User.findByPk(id);
    if (!user) return null;

    if (data.email && data.email !== user.email) {
      const existingUser = await User.findOne({ where: { email: data.email } });

      if (existingUser) {
        throw new BadRequestError('Email already exists');
      }
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, this.SALT_ROUNDS);
    } else {
      delete data.password;
    }

    try {
      await user.update(data, { validates: true });
    } catch (error) {
      console.error('error', error);
      const message = error.errors?.map((err) => err.message) || [
        error.message,
      ];
      throw new ServerError('Gagal mengupdate user:' + message.join(', '));
    }

    const userJson = user.toJSON();
    delete userJson.password;
    return userJson;
  }

  async delete(id) {
    const user = await User.findByPk(id);
    if (!user) return null;

    await user.destroy();
    return true;
  }
}

module.exports = new userService();
