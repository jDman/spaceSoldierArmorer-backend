const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    cart: {
      items: [
        {
          armor: {
            type: Object,
            required: true
          },
          quantity: { type: Number, required: true }
        }
      ]
    }
  },
  { timestamps: true }
);

userSchema.methods.addToCart = async function(items) {
  this.cart.items = items.map(cartItem => {
    const existingCartItem = this.cart.items.find(
      newCartItem =>
        newCartItem.armor._id.toString() === cartItem.armor._id.toString()
    );

    if (existingCartItem) {
      cartItem.quantity = cartItem.quantity + existingCartItem.quantity;
    }

    return cartItem;
  });

  return await this.save();
};

module.exports = mongoose.model('User', userSchema);
