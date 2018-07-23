const _ = require('lodash');

const Match = require('../models')['Match'];
const customersService = require('./customers');
const petsService = require('./pets');

function _match(pet, customer) {
  let pref = JSON.parse(customer.preference);
  if (pet.age < pref.age.min || pet.age > pref.age.max) {
    return false;
  } else if (_.indexOf(pref.species, pet.species) === -1) {
    return false;
  } else if (pet.species === 'dog' && _.indexOf(pref.breed, pet.breed) === -1) {
    return false;
  }
  return true;
}

module.exports = {
  addMatchingPets: function(customer) {
    let customerId = customer.id;
    petsService.getAll().then(pets => {
      for (let i = 0; i < pets.length; ++i) {
        if (_match(pets[i], customer)) {
          let petId = pets[i].id;
          this.addMatch({ petId, customerId });
        }
      }
    });
  },
  addMatchingCustomers: function(pet) {
    let petId = pet.id;
    return customersService.getAll().then(customers => {
      let matches = [];
      for (let i = 0; i < customers.length; ++i) {
        if (_match(pet, customers[i])) {
          let customerId = customers[i].id;
          this.addMatch({ petId, customerId });
          matches.push(customerId);
        }
      }
      return matches;
    });
  },
  getMatchingPets: function(params) {
    let CustomerId = params.customerId;
    return Match.findAll({
      where: {
        CustomerId
      }
    });
  },
  getMatchingCustomers: function(params) {
    let PetId = params.petId;
    return Match.findAll({
      where: {
        PetId
      }
    });
  },
  addMatch: function(params) {
    let PetId = params.petId,
      CustomerId = params.customerId;
    return Match.create({
      PetId,
      CustomerId
    });
  },
  isAMatch: function(params) {
    let PetId = params.petId,
      CustomerId = params.customerId;
    return Match.findOne({ where: { PetId, CustomerId } }).then(match => {
      return match !== null;
    });
  }
};
