const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const isAuthenticated = require('../../middleware/is-authenticated');

describe('isAuthenticated middleware', () => {
  before(() => {
    sinon.stub(jwt, 'verify');
  });

  after(() => {
    jwt.verify.restore();
  });
  it('should throw an error if no Authorization header available', () => {
    const req = {
      get: function() {
        return null;
      }
    };

    expect(isAuthenticated.bind(this, req, {}, () => {})).to.throw(
      'Not authenticated!'
    );
  });

  it('should throw an error if Authorization header has only one string', () => {
    const req = {
      get: function() {
        return 'abc';
      }
    };

    expect(isAuthenticated.bind(this, req, {}, () => {})).to.throw();
  });

  it('should throw an error if a token cannot be verified', () => {
    const req = {
      get: function() {
        return 'Bearer abc';
      }
    };

    expect(isAuthenticated.bind(this, req, {}, () => {})).to.throw();
  });

  it('should set userId on the request object from decoding a token', () => {
    const req = {
      get: function() {
        return 'Bearer abc';
      }
    };

    jwt.verify.returns({ userId: 'abc' });

    isAuthenticated(req, {}, () => {});

    expect(req).to.have.property('userId', 'abc');
    expect(jwt.verify.called).to.be.true;
  });
});
