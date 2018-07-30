const assert = require('assert');
const matchService = require('../services/matches');
const customerService = require('../services/customers');
const petService = require('../services/pets');
const Customer = require('../models')['Customer'];
const Pet = require('../models')['Pet'];
const Match = require('../models')['Match'];

function clearTable() {
  return Customer.destroy({ truncate: true, cascade: true }).then(() => {
    return Pet.destroy({ truncate: true, cascade: true }).then(() => {
      return Match.destroy({ truncate: true, cascade: true });
    });
  });
}

let pet1 = {
  id: 1,
  name: 'pood',
  age: 1,
  available_from: '2018-08-01',
  species: 'dog',
  breed: 'poodle'
};
let pet2 = {
  id: 2,
  name: 'rat',
  age: 99,
  available_from: '2018-08-01',
  species: 'rabbit'
};
let pet3 = {
  id: 3,
  name: 'cat',
  age: 5,
  available_from: '2018-08-01',
  species: 'cat'
};
let customer1 = {
  id: 1,
  preference: {
    age: {
      max: 10,
      min: 1
    },
    species: ['cat']
  }
};
let customer2 = {
  id: 2,
  preference: {
    age: {
      max: 2,
      min: 1
    },
    species: ['rabbit']
  }
};
let customer3 = {
  id: 3,
  preference: {
    age: {
      max: 10,
      min: 1
    },
    species: ['cat', 'rabbit', 'dog'],
    breed: ['poodle', 'terrier']
  }
};

describe('#match', () => {
  before(() => {
    return clearTable().then(() => {
      return petService.create(pet1).then(pet => {
        return matchService.addMatchingCustomers(pet).then(() => {
          return petService.create(pet2).then(pet => {
            return matchService.addMatchingCustomers(pet).then(() => {
              return petService.create(pet3).then(pet => {
                return matchService.addMatchingCustomers(pet).then(() => {
                  return customerService.create(customer1).then(customer => {
                    return matchService.addMatchingPets(customer).then(() => {
                      return customerService
                        .create(customer2)
                        .then(customer => {
                          return matchService
                            .addMatchingPets(customer)
                            .then(() => {
                              return customerService
                                .create(customer3)
                                .then(customer => {
                                  return matchService
                                    .addMatchingPets(customer)
                                    .then(() => {});
                                });
                            });
                        });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
  after(() => {
    return clearTable();
  });

  it('should not return any false matches for customer', done => {
    matchService.getMatchingPets({ customerId: 2 }).then(match => {
      assert.equal(match.length, 0);
      done();
    });
  });
  it('should not return any false matches for pet', done => {
    matchService.getMatchingCustomers({ petId: 2 }).then(match => {
      assert.equal(match.length, 0);
      done();
    });
  });
  it('should return appropriate matches for customer', done => {
    matchService.getMatchingPets({ customerId: 1 }).then(match => {
      assert.equal(match.length, 1);
      return matchService.getMatchingPets({ customerId: 3 }).then(match => {
        assert.equal(match.length, 2);
        done();
      });
    });
  });
  it('should return appropriate matches for pet', done => {
    matchService.getMatchingCustomers({ petId: 1 }).then(match => {
      assert.equal(match.length, 1);
      return matchService.getMatchingCustomers({ petId: 3 }).then(match => {
        assert.equal(match.length, 2);
        done();
      });
    });
  });
  it('should not show adopted pet in matches', done => {
    matchService.removeMatches({ customerId: 3, petId: 1 }).then(() => {
      return matchService.getMatchingPets({ customerId: 1 }).then(match => {
        assert.equal(match.length, 1);
        done();
      });
    });
  });
  it('should not show customers who adopted pet in matches', done => {
    matchService.getMatchingCustomers({ petId: 3 }).then(match => {
      console.log(match);
      assert.equal(match.length, 1);
      done();
    });
  });
});
