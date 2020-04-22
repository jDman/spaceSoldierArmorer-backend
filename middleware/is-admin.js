const User = require('../models/user');

module.exports = async (req, res, next) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

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
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);

    return err;
  }

  next();
};
