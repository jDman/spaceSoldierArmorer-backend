const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const jwtSecret = require('../database/jwt-secret');

const User = require('../models/user');

exports.signup = async (req, res, next) => {
  const { email, password, name } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      const error = new Error('User already exists!');
      error.statusCode = 403;

      next(error);
      return error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      password: hashedPassword,
      name
    });

    const savedUser = await user.save();

    return res.status(201).json({
      message: 'User created',
      userId: savedUser._id
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
      return err;
    }
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = User.findOne({ email: email });

    if (!user) {
      const error = new Error('User not found!');
      error.statusCode = 401;

      next(error);
      return error;
    }

    const userId = user._id.toString();

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error = new Error('Password incorrect!');
      error.statusCode = 401;

      next(error);
      return error;
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId
      },
      jwtSecret,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'User authenticated',
      token,
      userId
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};
