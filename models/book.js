const Sequelize = require('sequelize');
'use strict';

module.exports = (sequelize) => {
  class Book extends Sequelize.Model {}
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  Book.init({

    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a valid title.'
        }
      }
    },

    author: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a valid author.'
        }
      },

      genre: {
        type: Sequelize.STRING,
      },

      year: {
        type: Sequelize.INTEGER,
      }
    }
  },  { sequelize, modelName: 'Book'});

  return Book;
};