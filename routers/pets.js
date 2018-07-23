var express = require('express');
var router = express.Router();
const petsService = require('../services').pets;
const matchesService = require('../services').matches;
const isInt = require('../util').isInt;
const Error = require('../util').Error;

/**
 * Add a new pet to the system
 */
router.post('/', function(req, res, next) {
  var params = req.body,
    id = params.id;
  if ('id' in params) {
    if (!isInt(id)) {
      res.send('invalid ID');
    } else {
      return petsService.getOne(id).then(pet => {
        if (pet === null) {
          petsService.create(params).then(pet => {
            if (pet === null) {
              return next(Error.invalidParams('Invalid Parameters.'));
            }
            res.send(pet);
            return matchesService.addMatchingPets(pet);
          });
        } else {
          next(Error.invalidParams('User ID in use.'));
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
        res.send(pet);
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
 * Get all matching customers for the given pet
 */
router.get('/:id/matches', function(req, res) {
  let petId = req.params.id;
  return matchesService.getMatchingCustomers({ petId }).then(customers => {
    if (customers === null) res.send('No Matches.');
    res.send(customers);
  });
});

module.exports = router;
