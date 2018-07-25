const express = require('express');
const _ = require('lodash');
const router = express.Router();
const petsService = require('../services').pets;
const customersService = require('../services').customers;
const matchesService = require('../services').matches;
const isInt = require('../util').isInt;
const Error = require('../util').Error;
const formatter = require('../util').formatter;

/**
 * Add a new pet to the system
 */
router.post('/', function(req, res, next) {
  var params = req.body,
    id = params.id;
  if ('id' in params) {
    if (!isInt(id)) {
      return next(Error.invalidParams('Invalid ID.'));
    } else {
      return petsService.getOne(id).then(pet => {
        if (pet === null) {
          petsService.create(params).then(pet => {
            if (pet === null) {
              return next(Error.invalidParams('Invalid Parameters.'));
            }
            res.send(formatter(pet));
            return matchesService.addMatchingPets(pet);
          });
        } else {
          next(Error.invalidParams('Pet ID in use.'));
        }
      });
    }
  } else {
    return petsService
      .create(params)
      .then(pet => {
        if (pet === null) {
          return next(Error.invalidParams('Invalid Parameters.'));
        }
        res.send(formatter(pet));
        return matchesService.addMatchingCustomers(pet);
      })
      .catch(err => {
        next(Error.invalidParams('Failed to create pet.'));
      });
  }
});

/**
 * Get the pet by ID
 */
router.get('/:id', function(req, res, next) {
  let id = req.params.id;
  if (!isInt(id)) {
    Error.invalidParams('Invalid ID.');
  } else {
    petsService.getOne(id).then(customer => {
      if (customer === null) {
        return next(Error.invalidParams('Pet not found with provided ID.'));
      } else {
        res.send(formatter(customer));
      }
    });
  }
});

/**
 * Get all matching customers for the given pet
 */
router.get('/:id/matches', function(req, res) {
  let petId = req.params.id;
  return matchesService.getMatchingCustomers({ petId }).then(customers => {
    if (customers === null) return res.send(formatter('No Matches.'));
    let ids = _.map(customers, function(customer) {
      return customer.CustomerId;
    });
    return customersService.getSome(ids).then(customers => {
      if (customers === null) res.send(formatter('No Matches'));
      res.send(formatter(customers));
    });
  });
});

module.exports = router;
