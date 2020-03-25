const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    items: [
      {
        armor: {
          type: Object,
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);
