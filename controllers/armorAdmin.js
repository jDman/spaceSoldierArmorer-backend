const mongoose = require('mongoose');

const Armor = require('../models/armor');
const User = require('../models/user');

exports.createArmor = async (req, res, next) => {
  const {
    name,
    type,
    cost,
    protection,
    quality,
    description,
    image,
    stock,
    shield,
    discount,
    company,
    createdBy,
  } = req.body;

  try {
    const armor = await Armor.create({
      name,
      type,
      cost,
      protection,
      quality,
      description,
      image,
      stock,
      shield,
      discount,
      company,
      createdBy,
    });

    return res
      .status(201)
      .json({ message: 'Created armor successfully.', armor });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);

    return err;
  }
};

exports.updateArmor = async (req, res, next) => {
  const {
    name,
    type,
    cost,
    protection,
    quality,
    description,
    image,
    stock,
    shield,
    discount,
    company,
    createdBy,
  } = req.body;
  const { armorId } = req.params;

  try {
    const armor = await Armor.updateOne(
      { _id: armorId },
      {
        name,
        type,
        cost,
        protection,
        quality,
        description,
        image,
        stock,
        shield,
        discount,
        company,
        createdBy,
      }
    );

    return res
      .status(200)
      .json({ message: 'Updated armor successfully.', armor });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);

    return err;
  }
};

exports.deleteArmor = async (req, res, next) => {
  const { armorId } = req.params;
  const userId = '5e7de2879c138b8e04c733b8';

  try {
    await Armor.findByIdAndRemove(armorId);

    const user = await User.findOne({ _id: userId });

    user.cart.items.pull(armorId);

    await user.save();

    return res.status(200).json({
      message: 'Armor removed!',
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);

    return err;
  }
};
