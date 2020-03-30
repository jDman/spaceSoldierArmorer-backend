const { expect } = require('chai');
const sinon = require('sinon');

const Armor = require('../../models/armor');
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
          page: mockedCurrentPageNumber
        }
      };

      Armor.find.throws();

      await armorShopController
        .getAllArmor(req, {}, () => {})
        .then(result => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should return armor list with a response statusCode of 200', async () => {
      const armorList = [
        {
          _id: {
            $oid: '5e70e0330fe361400ed21c2b'
          },
          stock: {
            $numberInt: '0'
          },
          shield: {
            $numberInt: '0'
          },
          discount: {
            $numberInt: '0'
          },
          type: 'helmet',
          cost: {
            $numberInt: '109'
          },
          protection: 'medium',
          quality: 'low',
          description: 'A ordinary looking helmet.',
          company: 'starscape_systems',
          createdBy: {
            userId: {
              $oid: '5e70dfb438cee83fd9e004fd'
            },
            userName: 'Freddy'
          },
          createdAt: {
            $date: {
              $numberLong: '1584455731063'
            }
          },
          updatedAt: {
            $date: {
              $numberLong: '1584455731063'
            }
          },
          __v: {
            $numberInt: '0'
          }
        }
      ];
      Armor.find.returns({
        countDocuments: () => 1,
        sort: function() {
          return this;
        },
        skip: function() {
          return this;
        },
        limit: () => Promise.resolve(armorList)
      });

      const req = {
        query: {
          page: 1
        }
      };
      const res = {
        armor: null,
        statusCode: 500,
        status: function(code) {
          this.statusCode = code;

          return this;
        },
        json: function(data) {
          this.armor = data.armor;
        }
      };

      await armorShopController
        .getAllArmor(req, res, () => {})
        .then(() => {
          expect(res.statusCode).to.equal(200);
          expect(res.armor).to.equal(armorList);
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
          armorId
        }
      };

      Armor.findById.throws();

      await armorShopController
        .getArmor(req, {}, () => {})
        .then(result => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should throw an error 404 code when it cannot find any armor', async () => {
      const armorId = 3;
      const req = {
        params: {
          armorId: armorId
        }
      };

      Armor.findById.returns(null);

      await armorShopController
        .getArmor(req, {}, () => {})
        .then(result => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 404);
        });
    });
  });

  describe('updateCart', () => {
    beforeEach(() => {
      sinon.stub(Armor, 'find');
      sinon.stub(User, 'findById');
    });

    afterEach(() => {
      Armor.find.restore();
      User.findById.restore();
    });

    it('should throw an error 500 code when accessing the database for Armor fails', async () => {
      const req = {
        body: {
          items: [
            {
              armorId: '5e70e0330fe361400ed21c2b',
              quantity: 4
            }
          ]
        }
      };

      Armor.find.throws();

      await armorShopController
        .updateCart(req, {}, () => {})
        .then(result => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should throw an error 500 code when accessing the database for an User fails', async () => {
      const req = {
        body: {
          items: [
            {
              armorId: '5e70e0330fe361400ed21c2b',
              quantity: 4
            }
          ]
        }
      };

      Armor.find.returns([
        {
          createdBy: {
            userId: { $oid: '5e70dfb438cee83fd9e004fd' },
            userName: 'Freddy'
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
          __v: { $numberInt: '0' }
        }
      ]);

      User.findById.throws();

      await armorShopController
        .updateCart(req, {}, () => {})
        .then(result => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should call Users addToCart method with appropriate information', async () => {
      const req = {
        body: {
          items: [
            {
              armorId: '5e70e0330fe361400ed21c2b',
              quantity: 4
            }
          ]
        }
      };

      const res = {
        cart: null,
        statusCode: 500,
        status: function(code) {
          this.statusCode = code;

          return this;
        },
        json: function(data) {
          this.cart = data.cart;
        }
      };

      Armor.find.returns([
        {
          createdBy: {
            userId: { $oid: '5e70dfb438cee83fd9e004fd' },
            userName: 'Freddy'
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
          __v: { $numberInt: '0' }
        }
      ]);

      const user = {
        email: 'test1@test1.com',
        password: 'sfsfsf',
        userName: 'Freddy',
        cart: {
          items: []
        },
        addToCart: async items => {
          user.cart.items = items;
          return await Promise.resolve(items);
        }
      };

      User.findById.returns(user);

      await armorShopController
        .updateCart(req, res, () => {})
        .then(() => {
          expect(res).to.have.property('statusCode', 201);

          expect(res.cart).to.eql({
            items: [
              {
                armor: {
                  __v: {
                    $numberInt: '0'
                  },
                  _id: '5e70e0330fe361400ed21c2b',
                  company: 'starscape_systems',
                  cost: {
                    $numberInt: '109'
                  },
                  createdAt: {
                    $date: {
                      $numberLong: '1584455731063'
                    }
                  },
                  createdBy: {
                    userId: {
                      $oid: '5e70dfb438cee83fd9e004fd'
                    },
                    userName: 'Freddy'
                  },
                  description: 'A ordinary looking helmet.',
                  discount: {
                    $numberInt: '0'
                  },
                  protection: 'medium',
                  quality: 'low',
                  shield: {
                    $numberInt: '0'
                  },
                  stock: {
                    $numberInt: '0'
                  },
                  type: 'helmet',
                  updatedAt: {
                    $date: {
                      $numberLong: '1584455731063'
                    }
                  }
                },
                quantity: 4
              }
            ]
          });
        });
    });
  });
});
