'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    salt: DataTypes.STRING
  }, {});

User.associate = (function(models){
  User.hasMany(models.Deck, {as: 'Decks', foreignKey: 'userId'});
  User.hasMany(models.Card, {as: 'Cards', foreignKey: 'userId'});
})

  return User;
};
