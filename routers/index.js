var express = require('express');
var router = express.Router();

var petsRouter = require('./pets');
var customersRouter = require('./customers');

router.use(express.json(), express.urlencoded({ extended: true }));

router.get('/', function(req, res) {
  res.send('ok');
});
router.use('/pets', petsRouter);
router.use('/customers', customersRouter);

module.exports = router;
