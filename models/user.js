const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    cart: {
      items: [
        {
          armor: {
            type: Object,
            required: true,
          },
          quantity: { type: Number, required: true },
        },
      ],
    },
  },
  { timestamps: true }
);

userSchema.methods.addToCart = async function (chosenItem) {
  const chosenItemQuantity = +chosenItem.quantity;

  const cartItemIndex = this.cart.items.findIndex(
    (item) => item.armor._id.toString() === chosenItem.armor._id.toString()
  );
  const updatedCartItems = [...this.cart.items];

  if (cartItemIndex > -1) {
    updatedCartItems[cartItemIndex].quantity =
      chosenItemQuantity + this.cart.items[cartItemIndex].quantity;
  } else {
    updatedCartItems.push(chosenItem);
  }

  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;

  return await this.save();
};

userSchema.methods.deleteCartItem = async function (itemId) {
  const updatedCartItems = this.cart.items.filter(
    (item) => item._id.toString() !== itemId.toString()
  );

  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;

  return await this.save();
};

userSchema.methods.clearCart = async function () {
  const updatedCart = {
    items: [],
  };

  this.cart = updatedCart;

  return await this.save();
};

module.exports = mongoose.model('User', userSchema);
