'use strict';
module.exports = (sequelize, DataTypes) => {
  var Match = sequelize.define(
    'Match',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      }
    },
    {}
  );
  Match.associate = function(models) {
    Match.belongsTo(models.Pet);
    Match.belongsTo(models.Customer);
  };
  return Match;
};
