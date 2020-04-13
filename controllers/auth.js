const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const jwtSecret = require('../database/jwt-secret');

const User = require('../models/user');

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation Failed');

    error.statusCode = 422;
    error.data = errors.array();

    next(error);
    return error;
  }

  const { email, password, userName } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      password: hashedPassword,
      userName
    });

    const savedUser = await user.save();

    return res.status(201).json({
      message: 'User created'
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
    const user = await User.findOne({ email: email.toLowerCase() });

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
