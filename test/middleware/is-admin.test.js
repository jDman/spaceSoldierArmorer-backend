const { expect } = require('chai');
const sinon = require('sinon');

const User = require('../../models/user');

const isAdmin = require('../../middleware/is-admin');

describe('isAdmin', () => {
  before(() => {
    sinon.stub(User, 'findById');
  });

  after(() => {
    User.findById.restore();
  });

  it('should throw an error if call to database errors', async () => {
    const req = {
      userId: '123',
    };

    User.findById.throws();

    await isAdmin(req, {}, () => {}).then((result) => {
      expect(result).to.be.an('error');
      expect(result).to.have.property('statusCode', 500);
    });
  });

  it('should throw an error with message "User not found!" if user not found', async () => {
    const req = {
      userId: '123',
    };

    User.findById.returns(null);

    await isAdmin(req, {}, () => {}).then((result) => {
      expect(result).to.be.an('error');
      expect(result).to.have.property('statusCode', 404);
      expect(result).to.have.property('message', 'User not found!');
    });
  });

  it('should throw error if returned user not an admin', async () => {
    const req = {
      userId: '123',
    };

    User.findById.returns({
      isAdmin: false,
    });

    await isAdmin(req, {}, () => {}).then((result) => {
      expect(result).to.be.an('error');
      expect(result).to.have.property('statusCode', 401);
      expect(result).to.have.property('message', 'Not authorised!');
    });
  });

  it('should not throw an error if user an admin', async () => {
    const req = {
      userId: '123',
    };

    User.findById.returns({
      isAdmin: true,
    });

    await isAdmin(req, {}, () => {}).then((result) => {
      expect(result).to.not.be.an('error');
    });
  });
});
