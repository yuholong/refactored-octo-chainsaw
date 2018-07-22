var express = require('express');
var router = express.Router();
const customersService = require('../services').customers;
const isInt = require('../util').isInt;

/**
 * Add a new customer to the system
 */
router.post('/', function(req, res, next) {
  var params = req.body,
    id = params.id;
  if ('id' in params) {
    if (!isInt(id)) {
      res.send('invalid ID');
    } else {
      customersService.getOne(id).then(customer => {
        if (customer === null) {
          customersService.create(params).then(customer => {
            if (customer === null) {
              return next('invalid params');
            }
            res.send(customer);
          });
        } else {
          res.send('not created');
        }
      });
    }
  } else {
    customersService
      .create(params)
      .then(customer => {
        if (customer === null) {
          var err = {
            statusCode: 345,
            message: 'invalid params'
          };
          return next(err);
        }
        res.send(customer);
      })
      .catch(err => {
        res.send(err);
      });
  }
});

/**
 * Get the customer by ID
 */
router.get('/:id', function(req, res) {
  var id = req.params.id;
  if (!isInt(id)) {
    res.send('invalid ID');
  } else {
    customersService.getOne(id).then(customer => {
      if (customer === null) {
        res.send('customer not found');
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
  res.send(req.params);
});

/**
 * The customer adopts the given customer
 */
router.post('/:id/adopt', function(req, res) {
  var customer_id = req.params.id,
    customer_id = req.query.customer_id;
  res.send(customer_id + ' adopting ' + customer_id);
});

module.exports = router;
