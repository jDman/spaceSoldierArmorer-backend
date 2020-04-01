const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');

const User = require('../../models/user');
const authController = require('../../controllers/auth');

describe('authController', () => {
  describe('signup', () => {
    before(() => {
      sinon.stub(User.prototype, 'save');
      sinon.stub(User, 'findOne');
    });

    after(() => {
      User.findOne.restore();
      User.prototype.save.restore();
    });

    it('should throw an error 500 code when accessing the database fails', async () => {
      const req = {
        body: { email: 'john&test1.com', password: 'pnQ234lKfg', name: 'John' }
      };

      User.findOne.throws();

      await authController
        .signup(req, {}, () => {})
        .then(result => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should throw a 403 error if existing user found', async () => {
      const req = {
        body: { email: 'john&test1.com', password: 'pnQ234lKfg', name: 'John' }
      };

      User.findOne.returns({ _id: 'pnQ234lKfg' });

      await authController
        .signup(req, {}, () => {})
        .then(result => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 403);
        });
    });

    it('should save a new user and return a 201 statusCode in the response along with user id and confirmation message', async () => {
      const req = {
        body: { email: 'john&test1.com', password: 'pnQ234lKfg', name: 'John' }
      };

      const res = {
        message: null,
        userId: null,
        statusCode: 500,
        status: function(code) {
          this.statusCode = code;

          return this;
        },
        json: function(data) {
          this.message = data.message;
          this.userId = data.userId;
        }
      };

      User.findOne.returns(null);

      User.prototype.save.returns({ _id: 'pnQ234lKfg' });

      await authController
        .signup(req, res, () => {})
        .then(result => {
          expect(res).to.have.property('statusCode', 201);

          expect(res.message).to.equal('User created');
          expect(res.userId).to.equal('pnQ234lKfg');
        });
    });
  });

  describe('login', () => {
    before(() => {
      sinon.stub(User, 'findOne');
    });

    after(() => {
      User.findOne.restore();
    });

    it('should throw an error 500 code when accessing the database fails', async () => {
      const req = {
        body: { email: 'john&test1.com', password: 'pnQ234lKfg' }
      };

      User.findOne.throws();

      await authController
        .login(req, {}, () => {})
        .then(result => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should throw an error 401 code when a user is not found', async () => {
      const req = {
        body: { email: 'john&test1.com', password: 'pnQ234lKfg' }
      };

      User.findOne.returns(null);

      await authController
        .login(req, {}, () => {})
        .then(result => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 401);
        });
    });

    it('should ', async () => {
      const userId = '123456789';
      const hashedPassword = await bcrypt.hash('pnQ234lKfg', 12);
      const req = {
        body: { email: 'john&test1.com', password: 'pnQ234lKfg' }
      };
      const res = {
        message: null,
        userId: null,
        token: null,
        statusCode: 500,
        status: function(code) {
          this.statusCode = code;

          return this;
        },
        json: function(data) {
          this.message = data.message;
          this.userId = data.userId;
          this.token = data.token;
        }
      };

      User.findOne.returns({
        _id: userId,
        email: 'john&test1.com',
        password: hashedPassword
      });

      await authController
        .login(req, res, () => {})
        .then(() => {
          expect(res).to.have.property('statusCode', 200);

          expect(res.message).to.equal('User authenticated');
          expect(res.userId).to.equal(userId);
          expect(res.token).to.exist;
        });
    });
  });
});