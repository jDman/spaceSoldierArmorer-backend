const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const armorSchema = new Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['helmet', 'body', 'arm', 'leg'],
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    protection: {
      type: String,
      enum: ['high', 'medium', 'low'],
      required: true,
    },
    quality: {
      type: String,
      enum: ['high', 'medium', 'low'],
      required: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 2000,
    },
    image: {
      data: { type: Buffer },
      contentType: { type: String },
    },
    stock: {
      type: Number,
      default: 0,
    },
    shield: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    company: {
      type: String,
      enum: ['starscape_systems', 'adrax_corp', 'orian_labs'],
      required: true,
    },
    createdBy: {
      userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
      userName: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

armorSchema.methods.updateStock = async function (orderedStock) {
  const newStockValue = this.stock - orderedStock;

  this.stock = newStockValue;

  return await this.save();
};

module.exports = mongoose.model('Armor', armorSchema);
