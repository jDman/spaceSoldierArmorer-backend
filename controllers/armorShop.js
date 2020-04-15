const mongoose = require('mongoose');
const Armor = require('../models/armor');
const Order = require('../models/order');
const User = require('../models/user');

exports.getAllArmor = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = req.query.perPage || 10;

  try {
    const totalItems = await Armor.find().countDocuments();
    const armors = await Armor.find()
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    return res
      .status(200)
      .json({ message: 'Fetched armor successfully.', armors, totalItems });
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

exports.getCart = async (req, res, next) => {
  const { userId } = req;

  try {
    const user = await User.findById(userId);

    return res
      .status(201)
      .json({ message: 'Added successfully to cart.', items: user.cart.items });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
      return err;
    }
  }
};

exports.updateCart = async (req, res, next) => {
  const { armorId, quantity } = req.body;
  const { userId } = req;

  try {
    const armor = await Armor.findById(armorId);
    const user = await User.findById(userId);

    await user.addToCart({ armor, quantity });

    return res
      .status(201)
      .json({ message: 'Added successfully to cart.', cart: user.cart.items });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
      return err;
    }
  }
};

exports.getAllOrders = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = req.query.page || 10;

  try {
    const totalItems = await Order.find().countDocuments();
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    return res
      .status(200)
      .json({ message: 'Fetched Orders successfully.', orders, totalItems });
  } catch (err) {
    console.log('HERERERER', err);
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
      return err;
    }
  }
};

exports.addOrder = async (req, res, next) => {
  const { items } = req.body;
  const { userId } = req;

  const totalCostItems = items.reduce((prevItem, currItem) => {
    if (currItem) {
      let previousTotal = 0;
      if (prevItem && prevItem.total) {
        previousTotal = prevItem.total;
      }

      return {
        total: currItem.totalCost + previousTotal,
      };
    }

    return prevItem;
  }, {});

  try {
    const orderItems = items.map((item) => {
      try {
        const armor = item.armor;

        const quantity = item.config.value;

        return {
          armor: armor,
          quantity,
        };
      } catch (err) {
        next(err);
        return err;
      }
    });

    const order = new Order({
      userId,
      items: orderItems,
      totalCost: totalCostItems.total,
    });

    await order.save();

    const user = await User.findById(userId);

    await user.clearCart();

    return res.status(201).json({ message: 'Order successfully created!' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
      return err;
    }
  }
};

exports.deleteCartItem = async (req, res, next) => {
  const { itemId } = req.query;
  const { userId } = req;

  try {
    const user = await User.findById(userId);

    await user.deleteCartItem(itemId);

    return res.status(204).json({ message: 'Item removed from cart.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
      return err;
    }
  }
};
