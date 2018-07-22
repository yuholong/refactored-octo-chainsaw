var express = require('express');
var router = express.Router();
const petService = require('../services').pets;
const isInt = require('../util').isInt;

/**
 * Add a new pet to the system
 */
router.post('/', function(req, res) {
  var params = req.body,
    id = params.id;
  if ('id' in params) {
    if (!isInt(id)) {
      res.send('invalid ID');
    } else {
      petService.getOne(id).then(pet => {
        if (pet === null) {
          petService.create(params).then(pet => {
            res.send('created');
          });
        } else {
          res.send('not created');
        }
      });
    }
  } else {
    petService.create(params).then(pet => {
      res.send(pet);
    });
  }
});

/**
 * Get the pet by ID
 */
router.get('/:id', function(req, res) {
  var id = req.params.id;
  if (!isInt(id)) {
    res.send('invalid ID');
  } else {
    petService.getOne(id).then(pet => {
      if (pet === null) {
        res.send('Pet not found');
      } else {
        res.send(pet);
      }
    });
  }
});

/**
 * Get all matching customers for the given pet
 */
router.get('/:id/matches', function(req, res) {
  res.send(req.params);
});

module.exports = router;
