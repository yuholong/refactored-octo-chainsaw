var express = require('express');

var petsService = require('./pets');
var customersService = require('./customers');
var matchesService = require('./matches');

module.exports = {
  pets: petsService,
  customers: customersService,
  matches: matchesService
};
