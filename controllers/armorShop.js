const mongoose = require('mongoose');
const Armor = require('../models/armor');
const User = require('../models/user');

exports.getAllArmor = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = req.query.page || 10;

  try {
    const totalItems = await Armor.find().countDocuments();
    const armor = await Armor.find()
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    return res
      .status(200)
      .json({ message: 'Fetched armor successfully.', armor, totalItems });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
      return err;
    }
  }
};

exports.getArmor = async (req, res, next) => {
  const armorId = req.params.armorId;

  try {
    const armor = await Armor.findById(armorId);

    if (!armor) {
      const error = new Error('Could not find armor.');
      error.statusCode = 404;
      next(error);
      return error;
    }

    return res
      .status(200)
      .json({ message: 'Fetched armor successfully.', armor });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
      return err;
    }
  }
};

exports.updateCart = async (req, res, next) => {
  const { items } = req.body;
  const userId = '5e7de2879c138b8e04c733b8';

  try {
    const armorIds = items.map(item => item.armorId);
    const armorList = await Armor.find({ _id: { $in: armorIds } });
    const user = await User.findById(userId);

    const newCartItems = items.map(item => {
      const armor = armorList.find(
        armor => armor._id.toString() === item.armorId.toString()
      );
      const quantity = items.find(i => i.armorId === item.armorId).quantity;

      return {
        armor,
        quantity
      };
    });

    await user.addToCart(newCartItems);

    return res
      .status(201)
      .json({ message: 'Added successfully to cart.', cart: user.cart });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
      return err;
    }
  }
};
