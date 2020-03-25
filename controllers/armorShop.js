const mongoose = require('mongoose');
const Armor = require('../models/armor');
const Cart = require('../models/cart');

const ObjectId = mongoose.Types.ObjectId;

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

exports.addCart = async (req, res, next) => {
  const { items } = req.body;
  const userId = '5e70dfb438cee83fd9e004fd';

  try {
    const armorIds = items.map(item => item.armorId);
    const armorList = await Armor.find({ _id: { $in: armorIds } });

    const cartItems = items.map(item => {
      const armor = armorList.find(
        armor => armor._id.toString() === item.armorId.toString()
      );
      const quantity = items.find(i => i.armorId === item.armorId).quantity;

      return {
        armor,
        quantity
      };
    });

    const cart = await Cart.create({
      userId,
      items: cartItems
    });

    return res
      .status(201)
      .json({ message: 'Cart created successfully.', cart });
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
  const userId = '5e70dfb438cee83fd9e004fd';

  try {
    const armorIds = items.map(item => item.armorId);
    const armorList = await Armor.find({ _id: { $in: armorIds } });
    const cart = await Cart.findOne({ userId: userId });

    const updatedCartItems = items.map(item => {
      const armor = armorList.find(
        armor => armor._id.toString() === item.armorId.toString()
      );
      const quantity = items.find(i => i.armorId === item.armorId).quantity;

      return {
        armor,
        quantity
      };
    });

    const updatedCartObject = {
      userId,
      items: updatedCartItems
    };

    const newCart = await Cart.updateOne({ userId: userId }, updatedCartObject);

    return res
      .status(200)
      .json({ message: 'Cart updated successfully.', cart: newCart });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);

      return err;
    }
  }
};
