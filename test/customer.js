const assert = require('assert');
const customerService = require('../services/customers');
const Customer = require('../models')['Customer'];

function clearTable() {
  return Customer.destroy({ truncate: true, cascade: true });
}

describe('#customer', () => {
  before(() => {
    return clearTable();
  });
  after(() => {
    return clearTable();
  });

  it('should add a customer to the db', done => {
    let customer = {
      id: 1,
      preference: {
        age: {
          max: 10,
          min: 1
        },
        species: ['cat', 'rabbit', 'dog'],
        breed: ['poodle', 'terrier']
      }
    };
    customerService.create(customer).then(() => {
      Customer.count().then(result => {
        assert.equal(result, 1);
        done();
      });
    });
  });

  it('should not add invalid customer to the db', done => {
    let customer = {
      asdf: 'gggg'
    };
    customerService.create(customer).then(() => {
      Customer.count().then(result => {
        assert.equal(result, 1);
        done();
      });
    });
  });

  it('should not add a customer with duplciated id to the db', done => {
    let customer = {
      id: 1,
      preference: {
        age: {
          max: 5,
          min: 3
        },
        species: ['cat', 'rabbit', 'dog'],
        breed: ['poodle', 'terrier']
      }
    };
    customerService.create(customer).then(() => {
      Customer.count().then(result => {
        assert.equal(result, 1);
        done();
      });
    });
  });
});
