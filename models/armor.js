const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const armorSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['helmet', 'body', 'arm', 'leg'],
      required: true
    },
    cost: {
      type: Number,
      required: true
    },
    protection: {
      type: String,
      enum: ['high', 'medium', 'low'],
      required: true
    },
    quality: {
      type: String,
      enum: ['high', 'medium', 'low'],
      required: true
    },
    description: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 2000
    },
    image: {
      data: { type: Buffer },
      contentType: { type: String }
    },
    stock: {
      type: Number,
      default: 0
    },
    shield: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    company: {
      type: String,
      enum: ['starscape_systems', 'adrax_corp', 'orian_labs'],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Armor', armorSchema);
