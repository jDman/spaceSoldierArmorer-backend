const User = require('../models/user');

module.exports = (req, res, next) => {
  const userId = req.userId;

  try {
    const user = User.findById(userId);

    if (!user) {
      const error = new Error('User not found!');
      error.statusCode = 404;
      throw error;
    }

    if (!user.isAdmin) {
      const error = new Error('Not authorised!');
      error.statusCode = 401;
      throw error;
    }
  } catch (error) {
    error.statusCode = 500;

    throw error;
  }

  next();
};
