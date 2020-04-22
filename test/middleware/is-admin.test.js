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

  it('should throw an error if call to database errors', () => {
    const req = {
      userId: '123',
    };

    User.findById.throws();

    expect(isAdmin.bind(this, req, {}, () => {})).to.throw();
  });

  it('should throw an error with message "User not found!" if user not found', () => {
    const req = {
      userId: '123',
    };

    User.findById.returns(null);

    expect(isAdmin.bind(this, req, {}, () => {})).to.throw('User not found!');
  });

  it('should throw error if returned user not an admin', () => {
    const req = {
      userId: '123',
    };

    User.findById.returns({
      isAdmin: false,
    });

    expect(isAdmin.bind(this, req, {}, () => {})).to.throw('Not authorised!');
  });

  it('should not throw an error if user an admin', () => {
    const req = {
      userId: '123',
    };

    User.findById.returns({
      isAdmin: true,
    });

    expect(isAdmin.bind(this, req, {}, () => {})).to.not.throw(
      'User not found!'
    );
  });
});
