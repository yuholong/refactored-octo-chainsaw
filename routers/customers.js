const _ = require('lodash');
const express = require('express');
const router = express.Router();
const customersService = require('../services').customers;
const petsService = require('../services').pets;
const matchesService = require('../services').matches;
const isInt = require('../util').isInt;
const Error = require('../util').Error;

/**
 * Add a new customer to the system
 */
router.post('/', function(req, res, next) {
  let params = req.body,
    id = params.id;
  if ('id' in params) {
    if (!isInt(id)) {
      res.send('invalid ID');
    } else {
      return customersService.getOne(id).then(customer => {
        if (customer === null) {
          customersService.create(params).then(customer => {
            if (customer === null) {
              return next(Error.invalidParams('Invalid Parameters.'));
            }
            res.send(customer);
            return matchesService.addMatchingPets(customer);
          });
        } else {
          next(Error.invalidParams('Customer ID in use.'));
        }
      });
    }
  } else {
    return customersService
      .create(params)
      .then(customer => {
        if (customer === null) {
          return next(Error.invalidParams('Invalid Parameters.'));
        }
        res.send(customer);
        return matchesService.addMatchingPets(customer);
      })
      .catch(err => {
        next(Error.invalidParams('Failed to create customer.'));
      });
  }
});

/**
 * Get the customer by ID
 */
router.get('/:id', function(req, res, next) {
  let id = req.params.id;
  if (!isInt(id)) {
    Error.invalidParams('Invalid ID.');
  } else {
    customersService.getOne(id).then(customer => {
      if (customer === null) {
        return next(
          Error.invalidParams('Customer not found with provided ID.')
        );
      } else {
        res.send(customer);
      }
    });
  }
});

/**
 * Get all matching customers for the given customer
 */
router.get('/:id/matches', function(req, res) {
  let customerId = req.params.id;
  return matchesService.getMatchingPets({ customerId }).then(pets => {
    let petids = _.map(pets, function(pet) {
      return pet.PetId;
    });
    return petsService.getSome(petids).then(pets => {
      if (pets === null) res.send('No Matches');
      res.send(pets);
    });
  });
});

/**
 * The customer adopts the given pet
 */
router.post('/:id/adopt', function(req, res) {
  let customerId = req.params.id,
    petId = req.query.pet_id;
  return matchesService.isAMatch({ customerId, petId }).then(match => {
    if (match) {
      return matchesService.removeMatches({ customerId, petId }).then(() => {
        return customersService.remove(customerId).then(() => {
          return petsService.remove(petId).then(() => {
            res.send('Adopted.');
          });
        });
      });
    } else res.send('no match');
  });
});

module.exports = router;
