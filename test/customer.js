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

  it('should not add an invalid customer to the db', done => {
    let a = {
      asdf: 'gggg'
    };
    let b = {
      preference: {
        age: { max: 10, min: 1 },
        species: ['turtle']
      }
    };
    let c = {
      preference: {
        age: { max: 10, min: 1 },
        species: ['dog']
      }
    };
    let d = {
      preference: {
        age: { min: 10 },
        species: ['cat']
      }
    };
    let e = {
      preference: {
        age: { max: 20, min: 10 },
        species: ['dog'],
        breed: ['rabbit']
      }
    };
    customerService.create(a).then(() => {
      customerService.create(b).then(() => {
        customerService.create(c).then(() => {
          customerService.create(d).then(() => {
            customerService.create(e).then(() => {
              Customer.count().then(result => {
                assert.equal(result, 1);
                done();
              });
            });
          });
        });
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

  it('should not get a customer with an invalid id', done => {
    customerService.getOne('invalidid').then(customer => {
      assert.equal(customer, null);
      done();
    });
  });

  it('should get a customer with a valid id', done => {
    customerService.getOne(1).then(customer => {
      assert.equal(customer.id, 1);
      done();
    });
  });
});
