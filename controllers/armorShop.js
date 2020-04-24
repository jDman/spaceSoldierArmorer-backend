const mongoose = require('mongoose');
const Armor = require('../models/armor');
const Order = require('../models/order');
const User = require('../models/user');

exports.getAllArmor = async (req, res, next) => {
  const currentPage = +req.query.page || 1;
  const perPage = +req.query.perPage || 10;

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
      throw error;
    }

    return res
      .status(200)
      .json({ message: 'Fetched armor successfully.', armor });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
    return err;
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
  const currentPage = +req.query.page || 1;
  const itemsPerPage = +req.query.perPage || 10;

  try {
    const totalItems = await Order.find().countDocuments();
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage);

    const hasNextPage = itemsPerPage * currentPage < totalItems;
    const hasPrevPage = currentPage > 1;
    const nextPage = hasNextPage ? currentPage + 1 : currentPage;
    const prevPage = hasPrevPage ? currentPage - 1 : currentPage;
    const lastPage = Math.ceil(totalItems / itemsPerPage);

    return res.status(200).json({
      message: 'Fetched Orders successfully.',
      orders,
      totalItems,
      hasNextPage,
      hasPrevPage,
      nextPage,
      prevPage,
      lastPage,
    });
  } catch (err) {
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
      const armor = item.armor;

      if (!(armor.stock >= +item.config.value)) {
        const error = new Error(
          `Not enough units of ${armor.name} in stock. ${armor.stock} units available.`
        );

        error.statusCode = 422;

        throw error;
      }

      const quantity = item.config.value;

      return {
        armor,
        quantity,
      };
    });

    const order = new Order({
      userId,
      items: orderItems,
      totalCost: totalCostItems.total,
    });

    await order.save();

    for (let i = 0; i < orderItems.length; i++) {
      const armor = await Armor.findById(orderItems[i].armor._id);

      await armor.updateStock(orderItems[i].quantity);
    }

    const user = await User.findById(userId);

    await user.clearCart();

    return res
      .status(201)
      .json({ message: 'Order successfully created!', order });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
    return err;
  }
};

exports.deleteCartItem = async (req, res, next) => {
  console.log(req);
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
