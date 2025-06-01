const JwtService = require('../modules/auth/jwt.service');
const Unauthorized = require('../errors/UnauthorizedError');

function authJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Unauthorized('Token not provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = JwtService.verify(token);
    req.user = decoded;
    req.userId = decoded.id;
    next();
  } catch (error) {
    throw new Unauthorized('Token is invalid or expired');
  }
}

module.exports = authJWT;
