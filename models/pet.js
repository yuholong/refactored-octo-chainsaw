'use strict';
module.exports = (sequelize, DataTypes) => {
  var Pet = sequelize.define(
    'Pet',
    {
      name: DataTypes.STRING,
      available_from: DataTypes.DATE,
      age: DataTypes.INTEGER,
      species: DataTypes.STRING,
      breed: DataTypes.STRING
    },
    {}
  );
  Pet.associate = function(models) {
    // associations can be defined here
  };
  return Pet;
};
