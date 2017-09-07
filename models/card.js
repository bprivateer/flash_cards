'use strict';
module.exports = function(sequelize, DataTypes) {
  var Card = sequelize.define('Card', {
    question: DataTypes.STRING,
    body: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    deckId: DataTypes.INTEGER
  }, {});

Card.associate = (function(models){
  Card.belongsTo(models.Deck, { as: 'Decks', foreignKey: 'deckId'});
  Card.belongsTo(models.User, { as: 'Users', foreignKey: 'userId'});
})

  return Card;
};
