const assert = require('assert');
const petService = require('../services/pets');
const Pet = require('../models')['Pet'];

function clearTable() {
  return Pet.destroy({ truncate: true, cascade: true });
}

describe('#pet', () => {
  before(() => {
    return clearTable();
  });
  after(() => {
    return clearTable();
  });

  it('should add a pet to the db', done => {
    let pet = {
      id: 1,
      name: 'pood',
      age: 3,
      available_from: '2018-08-01',
      species: 'dog',
      breed: 'poodle'
    };
    petService.create(pet).then(() => {
      Pet.count().then(result => {
        assert.equal(result, 1);
        done();
      });
    });
  });

  it('should not add an invalid pet to the db', done => {
    let a = {
      asdf: 'gggg'
    };
    let b = {
      name: 'b',
      available_from: '2018-09-15',
      age: 'test',
      species: 'rabbit'
    };
    let c = {
      name: 'c',
      available_from: '2018-09-15',
      age: 3,
      species: 'turtle'
    };
    let d = {
      name: 'd',
      available_from: '2018-09-15',
      age: 5,
      species: 'dog',
      breed: 'turtle'
    };
    petService.create(a).then(() => {
      petService.create(b).then(() => {
        petService.create(c).then(() => {
          petService.create(d).then(() => {
            Pet.count().then(result => {
              assert.equal(result, 1);
              done();
            });
          });
        });
      });
    });
  });

  it('should not add a pet with duplciated id to the db', done => {
    let pet = {
      id: 1,
      name: 'rat',
      age: 5,
      available_from: '2018-08-01',
      species: 'rabbit'
    };
    petService.create(pet).then(() => {
      Pet.count().then(result => {
        assert.equal(result, 1);
        done();
      });
    });
  });

  it('should not get a customer with an invalid id', done => {
    petService.getOne('invalidid').then(pet => {
      assert.equal(pet, null);
      done();
    });
  });

  it('should get a pet with a valid id', done => {
    petService.getOne(1).then(pet => {
      assert.equal(pet.id, 1);
      done();
    });
  });
});
