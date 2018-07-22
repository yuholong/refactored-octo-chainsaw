const Customer = require('../models')['Customer'];
const isInt = require('../util').isInt;
const _ = require('lodash');

const validSpecies = ['cat', 'dog', 'rabbit'];
const validBreed = ['labrador', 'poodle', 'spaniel', 'terrier'];

function validateParams(params) {
  var ok = true;
  if ('id' in params && !isInt(params.id)) ok = false;
  if (!('preference' in params)) ok = false;
  var pref = params.preference;
  //   if (typeof pref === 'string') pref = JSON.parse(params.preference); // catch error
  if (
    !('age' in pref) ||
    !('min' in pref.age) ||
    !('max' in pref.age) ||
    pref.age.min < 0
  )
    ok = false;
  if (
    !('species' in pref) ||
    pref.species.constructor !== Array ||
    _.difference(pref.species, validSpecies).length != 0
  ) {
    ok = false;
  } else if (_.indexOf(pref.species, 'dog') == -1) {
    pref['breed'] = [];
  } else if (
    !('breed' in pref) ||
    pref.breed.constructor !== Array ||
    pref.breed.length == 0 ||
    _.difference(pref.breed, validBreed).length != 0
  ) {
    ok = false;
  }
  var ret = {
    preference: JSON.stringify({
      age: {
        max: pref.age.max,
        min: pref.age.min
      },
      spcies: pref.species,
      breed: pref.breed
    })
  };
  if ('id' in params) ret['id'] = params.id;
  if (ok) return ret;
  else return false;
}

module.exports = {
  getOne: function(id) {
    if (isInt(id)) return Customer.findById(id);
    else return Promise.resolve(null);
  },
  create: function(params) {
    params = validateParams(params);
    if (params !== false) return Customer.create(params);
    else return Promise.resolve(null);
  }
};
