const mongoose = require('mongoose');

const Armor = require('../models/armor');

const ObjectId = mongoose.Types.ObjectId;

exports.createArmor = async (req, res, next) => {
  const {
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
    createdBy
  } = req.body;

  try {
    const armor = await Armor.create({
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
      createdBy
    });

    res.status(201).json({ message: 'Created armor successfully.', armor });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
  await Armor.create();
};
