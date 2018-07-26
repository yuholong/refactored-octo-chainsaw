const _ = require('lodash');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Customer = require('../models')['Customer'];
const isInt = require('../util').isInt;

const validSpecies = ['cat', 'dog', 'rabbit'];
const validBreed = ['labrador', 'poodle', 'spaniel', 'terrier'];

function validateParams(params) {
  if ('id' in params && !isInt(params.id)) return false;
  if (!('preference' in params)) return false;
  var pref = params.preference;
  //   if (typeof pref === 'string') pref = JSON.parse(params.preference); // catch error
  if (
    !('age' in pref) ||
    !('min' in pref.age) ||
    !('max' in pref.age) ||
    pref.age.min < 0
  )
    return false;
  if (
    !('species' in pref) ||
    pref.species.constructor !== Array ||
    _.difference(pref.species, validSpecies).length != 0
  ) {
    return false;
  } else if (_.indexOf(pref.species, 'dog') == -1) {
    pref['breed'] = [];
  } else if (
    !('breed' in pref) ||
    pref.breed.constructor !== Array ||
    pref.breed.length == 0 ||
    _.difference(pref.breed, validBreed).length != 0
  ) {
    return false;
  }
  var ret = {
    preference: JSON.stringify({
      age: {
        max: pref.age.max,
        min: pref.age.min
      },
      species: pref.species,
      breed: pref.breed
    })
  };
  if ('id' in params) ret['id'] = params.id;
  return ret;
}

module.exports = {
  getOne: function(id) {
    if (isInt(id)) return Customer.findById(id);
    else return Promise.resolve(null);
  },
  getAll: function() {
    return Customer.findAll({});
  },
  getSome: function(ids) {
    if (ids.length === 0) return Promise.resolve(null);
    return Customer.findAll({
      where: {
        id: {
          [Op.or]: ids
        }
      }
    });
  },
  create: function(params) {
    params = validateParams(params);
    if (params !== false) return Customer.create(params);
    else return Promise.resolve(null);
  },
  remove: function(id) {
    if (isInt(id)) return Customer.destroy({ where: { id } });
    else return Promise.resolve(null);
  }
};
