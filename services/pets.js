const Pet = require('../models')['Pet'];
const isInt = require('../util').isInt;

const validSpecies = ['cat', 'dog', 'rabbit'];
const validBreed = ['labrador', 'poodle', 'spaniel', 'terrier'];

function validateParams(params) {
  var ok = true;
  if ('id' in params && !isInt(params.id)) ok = false;
  if (!('name' in params)) ok = false;
  if (
    !('available_from' in params) ||
    new Date(params['available_from']).getTime() <= 0
  )
    ok = false;
  if (!('age' in params) || !isInt(params.age)) ok = false;
  if (!('species' in params) || !(params['species'] in validSpecies))
    ok = false;
  else if (params['species'] !== 'dog') params['breed'] = '';
  else if ('breed' in params || !(params['breed'] in validBreed)) ok = false;

  var ret = {
    name: params.name,
    available_from: params.available_from,
    age: params.age,
    species: params.species,
    breed: params.breed
  };
  if ('id' in params) ret['id'] = params.id;
  if (ok) return ret;
  else return false;
}

module.exports = {
  getOne: function(id) {
    if (isInt(id)) return Pet.findById(id);
    else return Promise.resolve(null);
  },
  create: function(params) {
    params = validateParams(params);
    if (params !== false) return Pet.create(params);
    else return Promise.resolve(null);
  }
};
