'use strict';
module.exports = function(sequelize, DataTypes) {
  var Deck = sequelize.define('Deck', {
    deckName: DataTypes.STRING,
    body: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});

Deck.asscociate = (function(models){
  Deck.belongsTo(models.User, { as: 'Users', foreignKey: 'userId'});
  Deck.hasMany(models.Card, { as: 'Cards', foreignKey: 'deckId'});
})

  return Deck;
};
