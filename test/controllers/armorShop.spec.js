const { expect } = require('chai');
const sinon = require('sinon');

const Armor = require('../../models/armor');
const Order = require('../../models/order');
const User = require('../../models/user');
const armorShopController = require('../../controllers/armorShop');

describe('armorShop controller', () => {
  describe('getAllPosts', () => {
    before(() => {
      sinon.stub(Armor, 'find');
    });

    after(() => {
      Armor.find.restore();
    });

    it('should throw an error 500 code when accessing the database fails', async () => {
      const mockedCurrentPageNumber = 3;
      const req = {
        query: {
          page: mockedCurrentPageNumber,
          perPage: 1,
        },
      };

      Armor.find.throws();

      await armorShopController
        .getAllArmor(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should return armor list with a response statusCode of 200', async () => {
      const armorList = [
        {
          _id: {
            $oid: '5e70e0330fe361400ed21c2b',
          },
          stock: {
            $numberInt: '0',
          },
          shield: {
            $numberInt: '0',
          },
          discount: {
            $numberInt: '0',
          },
          type: 'helmet',
          cost: {
            $numberInt: '109',
          },
          protection: 'medium',
          quality: 'low',
          description: 'A ordinary looking helmet.',
          company: 'starscape_systems',
          createdBy: {
            userId: {
              $oid: '5e70dfb438cee83fd9e004fd',
            },
            userName: 'Freddy',
          },
          createdAt: {
            $date: {
              $numberLong: '1584455731063',
            },
          },
          updatedAt: {
            $date: {
              $numberLong: '1584455731063',
            },
          },
          __v: {
            $numberInt: '0',
          },
        },
      ];
      Armor.find.returns({
        countDocuments: () => 1,
        sort: function () {
          return this;
        },
        skip: function () {
          return this;
        },
        limit: () => Promise.resolve(armorList),
      });

      const req = {
        query: {
          page: 1,
          perPage: 1,
        },
      };
      const res = {
        armors: null,
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.armors = data.armors;
        },
      };

      await armorShopController
        .getAllArmor(req, res, () => {})
        .then(() => {
          expect(res.statusCode).to.equal(200);
          expect(res.armors).to.equal(armorList);
        });
    });
  });

  describe('getArmor', () => {
    before(() => {
      sinon.stub(Armor, 'find');
      sinon.stub(Armor, 'findById');
    });

    after(() => {
      Armor.find.restore();
      Armor.findById.restore();
    });

    it('should throw an error 500 code when accessing the database fails', async () => {
      const armorId = 3;
      const req = {
        params: {
          armorId,
        },
      };

      Armor.findById.throws();

      await armorShopController
        .getArmor(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should throw an error 404 code when it cannot find any armor', async () => {
      const armorId = 3;
      const req = {
        params: {
          armorId: armorId,
        },
      };

      Armor.findById.returns(null);

      await armorShopController
        .getArmor(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 404);
        });
    });
  });

  describe('getCart', () => {
    before(() => {
      sinon.stub(User, 'findById');
    });

    after(() => {
      User.findById.restore();
    });

    it('should throw an error 500 code when accessing the database fails', async () => {
      const req = {
        userId: '1',
      };
      User.findById.throws();

      await armorShopController
        .getCart(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should return the users cart items', async () => {
      const req = {
        userId: '1',
      };
      const res = {
        items: null,
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.items = data.items;
        },
      };
      const userCartItem = {
        armor: {
          __v: {
            $numberInt: '0',
          },
          _id: '5e70e0330fe361400ed21c2b',
          company: 'starscape_systems',
          cost: {
            $numberInt: '109',
          },
          createdAt: {
            $date: {
              $numberLong: '1584455731063',
            },
          },
          createdBy: {
            userId: {
              $oid: '5e70dfb438cee83fd9e004fd',
            },
            userName: 'Freddy',
          },
          description: 'A ordinary looking helmet.',
          discount: {
            $numberInt: '0',
          },
          protection: 'medium',
          quality: 'low',
          shield: {
            $numberInt: '0',
          },
          stock: {
            $numberInt: '0',
          },
          type: 'helmet',
          updatedAt: {
            $date: {
              $numberLong: '1584455731063',
            },
          },
        },
        quantity: 4,
      };
      const user = {
        email: 'test1@test1.com',
        password: 'sfsfsf',
        userName: 'Freddy',
        cart: {
          items: [userCartItem],
        },
      };

      User.findById.returns(user);

      await armorShopController
        .getCart(req, res, () => {})
        .then((result) => {
          expect(res).to.have.property('statusCode', 201);

          expect(res.items).to.eql([userCartItem]);
        });
    });
  });

  describe('updateCart', () => {
    beforeEach(() => {
      sinon.stub(Armor, 'findById');
      sinon.stub(User, 'findById');
    });

    afterEach(() => {
      Armor.findById.restore();
      User.findById.restore();
    });

    it('should throw an error 500 code when accessing the database for Armor fails', async () => {
      const req = {
        body: {
          armorId: '5e70e0330fe361400ed21c2b',
          quantity: 4,
        },
      };

      Armor.findById.throws();

      await armorShopController
        .updateCart(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should throw an error 500 code when accessing the database for an User fails', async () => {
      const req = {
        body: {
          armorId: '5e70e0330fe361400ed21c2b',
          quantity: 4,
        },
      };

      Armor.findById.returns({
        createdBy: {
          userId: { $oid: '5e70dfb438cee83fd9e004fd' },
          userName: 'Freddy',
        },
        stock: { $numberInt: '0' },
        shield: { $numberInt: '0' },
        discount: { $numberInt: '0' },
        _id: { $oid: '5e70e0330fe361400ed21c2b' },
        type: 'helmet',
        cost: { $numberInt: '109' },
        protection: 'medium',
        quality: 'low',
        description: 'A ordinary looking helmet.',
        company: 'starscape_systems',
        createdAt: { $date: { $numberLong: '1584455731063' } },
        updatedAt: { $date: { $numberLong: '1584455731063' } },
        __v: { $numberInt: '0' },
      });

      User.findById.throws();

      await armorShopController
        .updateCart(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should call Users addToCart method with appropriate information', async () => {
      const req = {
        body: {
          armorId: '5e70e0330fe361400ed21c2b',
          quantity: 4,
        },
      };

      const res = {
        cart: null,
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.cart = data.cart;
        },
      };

      Armor.findById.returns({
        createdBy: {
          userId: { $oid: '5e70dfb438cee83fd9e004fd' },
          userName: 'Freddy',
        },
        stock: { $numberInt: '0' },
        shield: { $numberInt: '0' },
        discount: { $numberInt: '0' },
        _id: '5e70e0330fe361400ed21c2b',
        type: 'helmet',
        cost: { $numberInt: '109' },
        protection: 'medium',
        quality: 'low',
        description: 'A ordinary looking helmet.',
        company: 'starscape_systems',
        createdAt: { $date: { $numberLong: '1584455731063' } },
        updatedAt: { $date: { $numberLong: '1584455731063' } },
        __v: { $numberInt: '0' },
      });

      const user = {
        email: 'test1@test1.com',
        password: 'sfsfsf',
        userName: 'Freddy',
        cart: {
          items: [],
        },
        addToCart: async (item) => {
          user.cart.items = [item];
          return await Promise.resolve([item]);
        },
      };

      User.findById.returns(user);

      await armorShopController
        .updateCart(req, res, () => {})
        .then(() => {
          expect(res).to.have.property('statusCode', 201);

          expect(res.cart).to.eql([
            {
              armor: {
                __v: {
                  $numberInt: '0',
                },
                _id: '5e70e0330fe361400ed21c2b',
                company: 'starscape_systems',
                cost: {
                  $numberInt: '109',
                },
                createdAt: {
                  $date: {
                    $numberLong: '1584455731063',
                  },
                },
                createdBy: {
                  userId: {
                    $oid: '5e70dfb438cee83fd9e004fd',
                  },
                  userName: 'Freddy',
                },
                description: 'A ordinary looking helmet.',
                discount: {
                  $numberInt: '0',
                },
                protection: 'medium',
                quality: 'low',
                shield: {
                  $numberInt: '0',
                },
                stock: {
                  $numberInt: '0',
                },
                type: 'helmet',
                updatedAt: {
                  $date: {
                    $numberLong: '1584455731063',
                  },
                },
              },
              quantity: 4,
            },
          ]);
        });
    });

    it('should call Users addToCart method and update users cart when armor already added', async () => {
      const req = {
        body: {
          armorId: '5e70e0330fe361400ed21c2b',
          quantity: 4,
        },
      };

      const res = {
        cart: null,
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.cart = data.cart;
        },
      };

      const armor = {
        createdBy: {
          userId: { $oid: '5e70dfb438cee83fd9e004fd' },
          userName: 'Freddy',
        },
        stock: { $numberInt: '0' },
        shield: { $numberInt: '0' },
        discount: { $numberInt: '0' },
        _id: '5e70e0330fe361400ed21c2b',
        type: 'helmet',
        cost: { $numberInt: '109' },
        protection: 'medium',
        quality: 'low',
        description: 'A ordinary looking helmet.',
        company: 'starscape_systems',
        createdAt: { $date: { $numberLong: '1584455731063' } },
        updatedAt: { $date: { $numberLong: '1584455731063' } },
        __v: { $numberInt: '0' },
      };

      Armor.findById.returns(armor);

      const user = {
        email: 'test1@test1.com',
        password: 'sfsfsf',
        userName: 'Freddy',
        cart: {
          items: [{ armor, quantity: 1 }],
        },
        addToCart: async (item) => {
          user.cart.items = [item];
          return await Promise.resolve([item]);
        },
      };

      User.findById.returns(user);

      await armorShopController
        .updateCart(req, res, () => {})
        .then(() => {
          expect(res).to.have.property('statusCode', 201);

          expect(res.cart).to.eql([
            {
              armor: {
                __v: {
                  $numberInt: '0',
                },
                _id: '5e70e0330fe361400ed21c2b',
                company: 'starscape_systems',
                cost: {
                  $numberInt: '109',
                },
                createdAt: {
                  $date: {
                    $numberLong: '1584455731063',
                  },
                },
                createdBy: {
                  userId: {
                    $oid: '5e70dfb438cee83fd9e004fd',
                  },
                  userName: 'Freddy',
                },
                description: 'A ordinary looking helmet.',
                discount: {
                  $numberInt: '0',
                },
                protection: 'medium',
                quality: 'low',
                shield: {
                  $numberInt: '0',
                },
                stock: {
                  $numberInt: '0',
                },
                type: 'helmet',
                updatedAt: {
                  $date: {
                    $numberLong: '1584455731063',
                  },
                },
              },
              quantity: 4,
            },
          ]);
        });
    });
  });

  describe('deleteCartItem', () => {
    before(() => {
      sinon.stub(User, 'findById');
    });

    after(() => {
      User.findById.restore();
    });

    it('should throw an error 500 code when accessing the database for an User fails', async () => {
      const req = {
        userId: '123',
        query: {
          itemId: '456',
        },
      };

      User.findById.throws();

      await armorShopController
        .deleteCartItem(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should remove item from cart, returning a confirmation message and statusCode of 204', async () => {
      const req = {
        userId: '123',
        query: {
          itemId: '456',
        },
      };

      const res = {
        message: null,
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.message = data.message;
        },
      };

      const user = {
        email: 'test1@test1.com',
        password: 'sfsfsf',
        userName: 'Freddy',
        cart: {
          items: [{ _id: '456', armor: {}, quantity: 1 }],
        },
        deleteCartItem: async (item) => {
          user.cart.items = [];
          return await Promise.resolve([item]);
        },
      };

      User.findById.returns(user);

      await armorShopController
        .deleteCartItem(req, res, () => {})
        .then(() => {
          expect(res).to.have.property('statusCode', 204);
          expect(res).to.have.property('message', 'Item removed from cart.');
        });
    });
  });

  describe('getAllOrders', () => {
    before(() => {
      sinon.stub(Order, 'find');
    });

    after(() => {
      Order.find.restore();
    });

    it('should throw a 500 error when database access fails', async () => {
      const req = {
        query: {
          page: 3,
          perPage: 10,
        },
      };

      Order.find.throws();

      await armorShopController
        .getAllOrders(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should return order list with a response statusCode of 200', async () => {
      const req = {
        query: {
          page: 1,
          perPage: 10,
        },
      };

      const orderList = [{}];

      Order.find.returns({
        countDocuments: () => 1,
        sort: function () {
          return this;
        },
        skip: function () {
          return this;
        },
        limit: () => Promise.resolve(orderList),
      });

      const res = {
        orders: null,
        totalItems: null,
        hasNextPage: null,
        hasPrevPage: null,
        nextPage: null,
        prevPage: null,
        lastPage: null,
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.orders = data.orders;
          this.totalItems = data.totalItems;
          this.hasNextPage = data.hasNextPage;
          this.hasPrevPage = data.hasPrevPage;
          this.nextPage = data.nextPage;
          this.prevPage = data.prevPage;
          this.lastPage = data.lastPage;
        },
      };

      await armorShopController
        .getAllOrders(req, res, () => {})
        .then(() => {
          expect(res.orders).to.eql([{}]);
          expect(res.totalItems).to.eql(1);
          expect(res.hasNextPage).to.eql(false);
          expect(res.hasPrevPage).to.eql(false);
          expect(res.nextPage).to.eql(1);
          expect(res.prevPage).to.eql(1);
          expect(res.lastPage).to.eql(1);
          expect(res).to.have.property('statusCode', 200);
        });
    });
  });

  describe('addOrder', () => {
    before(() => {
      sinon.stub(Order.prototype, 'save');
      sinon.stub(User, 'findById');
      sinon.stub(Armor, 'findById');
    });

    after(() => {
      Order.prototype.save.restore();
      User.findById.restore();
      Armor.findById.restore();
    });

    it('should throw a 500 error if user not found', async () => {
      const req = {
        body: {
          items: [
            {
              id: '44',
              armor: { _id: '2', stock: 4 },
              config: { value: 3 },
              totalCost: 900,
            },
            {
              id: '45',
              armor: { _id: '3', stock: 4 },
              config: { value: 1 },
              totalCost: 100,
            },
          ],
        },
        userId: '123',
      };

      Order.prototype.save.returns(Promise.resolve());

      User.findById.throws();

      await armorShopController
        .addOrder(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should throw a 500 error if save fails', async () => {
      const req = {
        body: {
          items: [],
        },
        userId: '123',
      };

      Order.prototype.save.throws();

      await armorShopController
        .addOrder(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should throw a 422 error if quantity of order greater than items in stock', async () => {
      const req = {
        body: {
          items: [
            {
              _id: '22',
              armor: { _id: '2', name: 'ABC', stock: 1 },
              config: { value: 3 },
              totalCost: 900,
            },
          ],
        },
        userId: '123',
      };

      const res = {
        message: null,
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.message = data.message;
        },
      };

      await armorShopController
        .addOrder(req, res, () => {})
        .then((result) => {
          expect(result).to.be.an('error');

          expect(result).to.have.property('statusCode', 422);
        });
    });

    it('should create an order with correct information', async () => {
      const req = {
        body: {
          items: [
            {
              armor: { _id: '2', stock: 4 },
              config: { value: 3 },
              totalCost: 900,
            },
          ],
        },
        userId: '123',
      };

      const res = {
        message: null,
        order: null,
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.order = data.order;
          this.message = data.message;
        },
      };

      Order.prototype.save.returns(Promise.resolve());

      User.findById.returns({
        email: 'test1@test1.com',
        password: 'sfsfsf',
        userName: 'Freddy',
        cart: {
          items: [{ _id: '456', armor: { _id: '2', stock: 4 }, quantity: 1 }],
        },
        clearCart: async function () {
          this.items = [];
        },
      });

      Armor.findById.returns({
        stock: 4,
        updateStock: async function () {
          this.stock = 1;
        },
      });

      await armorShopController
        .addOrder(req, res, () => {})
        .then((result) => {
          expect(res).to.have.property(
            'message',
            'Order successfully created!'
          );
          expect(res.order.items).to.exist;
          expect(res).to.have.property('statusCode', 201);
        });
    });
  });
});
