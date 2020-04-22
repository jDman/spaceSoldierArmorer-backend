const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

const Armor = require('../../models/armor');
const User = require('../../models/user');
const armorAdminController = require('../../controllers/armorAdmin');

describe('armorAdmin controller', () => {
  describe('createArmor', () => {
    before(() => {
      sinon.stub(Armor, 'create');
    });

    after(() => {
      Armor.create.restore();
    });

    it('should throw an error 500 code when writing to the database fails', async () => {
      const req = {
        body: {
          name: 'test',
          stock: 0,
          shield: 0,
          discount: 0,
          type: 'helmet',
          cost: 109,
          protection: 'medium',
          quality: 'low',
          description: 'A ordinary looking helmet.',
          company: 'starscape_systems',
          createdBy: {
            userId: '5e70dfb438cee83fd9e004fd',
            userName: 'Freddy',
          },
        },
      };

      Armor.create.throws();

      await armorAdminController
        .createArmor(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should create a new armor based on the data passed in', async () => {
      const req = {
        body: {
          name: 'test',
          stock: 0,
          shield: 0,
          discount: 0,
          type: 'helmet',
          cost: 109,
          protection: 'medium',
          quality: 'low',
          description: 'A ordinary looking helmet.',
          company: 'starscape_systems',
          createdBy: {
            userId: '5e70dfb438cee83fd9e004fd',
            userName: 'Freddy',
          },
        },
      };

      const res = {
        armor: null,
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.armor = data.armor;
        },
      };

      Armor.create.returns(req.body);

      await armorAdminController
        .createArmor(req, res, () => {})
        .then((result) => {
          expect(res.statusCode).to.equal(201);
          expect(res.armor).to.eq(req.body);
        });
    });
  });

  describe('updateArmor', () => {
    before(() => {
      sinon.stub(Armor, 'updateOne');
    });

    after(() => {
      Armor.updateOne.restore();
    });

    it('should throw an error 500 code when writing to the database fails', async () => {
      const req = {
        body: {
          name: 'test',
          stock: 0,
          shield: 0,
          discount: 0,
          type: 'helmet',
          cost: 109,
          protection: 'medium',
          quality: 'low',
          description: 'A ordinary looking helmet.',
          company: 'starscape_systems',
          createdBy: {
            userId: '5e70dfb438cee83fd9e004fd',
            userName: 'Freddy',
          },
        },
        params: { armorId: '123456789' },
      };

      Armor.updateOne.throws();

      await armorAdminController
        .updateArmor(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should update an armor based on the data passed in', async () => {
      const req = {
        body: {
          name: '',
          stock: 0,
          shield: 0,
          discount: 0,
          type: 'helmet',
          cost: 109,
          protection: 'medium',
          quality: 'low',
          description: 'A ordinary looking helmet.',
          company: 'starscape_systems',
          createdBy: {
            userId: '5e70dfb438cee83fd9e004fd',
            userName: 'Freddy',
          },
        },
        params: { armorId: '123456789' },
      };

      const res = {
        armor: null,
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.armor = data.armor;
        },
      };

      const updatedArmor = { ...req.body, _id: req.params };

      Armor.updateOne.returns(updatedArmor);

      await armorAdminController
        .updateArmor(req, res, () => {})
        .then((result) => {
          expect(res.statusCode).to.equal(200);
          expect(res.armor).to.eq(updatedArmor);
        });
    });
  });

  describe('deleteArmor', () => {
    before(() => {
      sinon.stub(Armor, 'findByIdAndRemove');
      sinon.stub(User, 'findOne');
    });

    after(() => {
      Armor.findByIdAndRemove.restore();
      User.findOne.restore();
    });

    it('should throw an error 500 code when accessing and removing armor from the database fails', async () => {
      const req = {
        params: { armorId: '123456789' },
      };

      Armor.findByIdAndRemove.throws();

      await armorAdminController
        .deleteArmor(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should throw an error 500 code when accessing a User from the database fails', async () => {
      const req = {
        params: { armorId: '123456789' },
      };

      Armor.findByIdAndRemove.returns(true);

      User.findOne.throws();

      await armorAdminController
        .deleteArmor(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should remove armor', async () => {
      const req = {
        params: { armorId: '123456789' },
      };
      const user = new User({
        _id: new ObjectId('5e7de2879c138b8e04c733b8'),
        email: 'test1@test1.com',
        password: 'sfsfsf',
        userName: 'Freddy',
        cart: {
          items: [
            {
              name: 'test',
              stock: 0,
              shield: 0,
              discount: 0,
              type: 'helmet',
              cost: 109,
              protection: 'medium',
              quality: 'low',
              description: 'A ordinary looking helmet.',
              company: 'starscape_systems',
              createdBy: {
                userId: '5e70dfb438cee83fd9e004fd',
                userName: 'Freddy',
              },
            },
          ],
        },
      });

      const fake = async () => Promise.resolve(true);
      sinon.replace(user, 'save', fake);

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

      Armor.findByIdAndRemove.returns(true);

      User.findOne.returns(user);

      await armorAdminController
        .deleteArmor(req, res, () => {})
        .then((result) => {
          expect(res.statusCode).to.equal(200);
          expect(res.message).to.equal('Armor removed!');
        });
    });
  });
});
