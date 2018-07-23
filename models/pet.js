'use strict';
module.exports = (sequelize, DataTypes) => {
  var Pet = sequelize.define(
    'Pet',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
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
