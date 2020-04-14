const { expect } = require('chai');
const sinon = require('sinon');

const User = require('../../models/user');

describe('User model', () => {
  before(() => {
    sinon.stub(User.prototype, 'save');
  });

  after(() => {
    User.prototype.save.restore();
  });

  it('should have a validation error if no email', async () => {
    const TestUser = new User({
      userName: 'Freddy',
      password: '12345678',
      cart: { items: [] },
    });

    await TestUser.validate((err) => expect(err.errors.email).to.exist);
  });

  it('should have a validation error if no userName', async () => {
    const TestUser = new User({
      email: 'test@test.com',
      password: '12345678',
      cart: { items: [] },
    });

    await TestUser.validate((err) => expect(err.errors.userName).to.exist);
  });

  it('should have a validation error if no password', async () => {
    const TestUser = new User({
      email: 'test@test.com',
      userName: 'Freddy',
      cart: { items: [] },
    });

    await TestUser.validate((err) => expect(err.errors.password).to.exist);
  });

  describe('addToCart', () => {
    it('should add an item if it is not already in cart', async () => {
      const TestUser = new User({
        email: 'test@test.com',
        userName: 'Freddy',
        password: '12345678',
        cart: { items: [] },
      });
      const chosenItem = { armor: { _id: '123' }, quantity: '2' };

      User.prototype.save.returns(Promise.resolve());

      await TestUser.addToCart(chosenItem).then((user) => {
        const cartItem = TestUser.cart.items[0];
        expect(cartItem.armor).to.eql({
          _id: '123',
        });

        expect(cartItem.quantity).to.eql(2);
      });
    });

    it('should update an item if it is already in cart', async () => {
      const TestUser = new User({
        email: 'test@test.com',
        userName: 'Freddy',
        password: '12345678',
        cart: { items: [{ armor: { _id: '123' }, quantity: '2' }] },
      });
      const chosenItem = { armor: { _id: '123' }, quantity: '3' };

      User.prototype.save.returns(Promise.resolve());

      await TestUser.addToCart(chosenItem).then((user) => {
        const cartItem = TestUser.cart.items[0];
        expect(cartItem.armor).to.eql({
          _id: '123',
        });

        expect(cartItem.quantity).to.eql(5);
      });
    });
  });

  describe('deleteCartItem', () => {
    it('should remove an item from the users cart', async () => {
      const TestUser = new User({
        email: 'test@test.com',
        userName: 'Freddy',
        password: '12345678',
        cart: { items: [{ armor: { _id: '123' }, quantity: '2' }] },
      });

      const cartItemId = TestUser.cart.items[0]._id;

      await TestUser.deleteCartItem(cartItemId).then((user) => {
        const cartItem = TestUser.cart.items[0];
        expect(cartItem).to.be.undefined;
      });
    });
  });

  describe('clearCart', () => {
    it('should remove all items from users cart', async () => {
      const TestUser = new User({
        email: 'test@test.com',
        userName: 'Freddy',
        password: '12345678',
        cart: { items: [{ armor: { _id: '123' }, quantity: '2' }] },
      });

      await TestUser.clearCart().then((user) => {
        expect(TestUser.cart.items).to.be.empty;
      });
    });
  });
});
