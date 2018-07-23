'use strict';
module.exports = (sequelize, DataTypes) => {
  var Customer = sequelize.define(
    'Customer',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      preference: DataTypes.STRING
    },
    {}
  );
  Customer.associate = function(models) {
    // associations can be defined here
  };
  return Customer;
};
