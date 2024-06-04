const db = require('../database/database');
const { DataTypes } = require('sequelize');
const Product = require('./productModel');
const User = require('./userModel');

const Rating = db.define(
  'ratings',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    id_user: {
      type: DataTypes.UUID,
    },
    id_product: {
      type: DataTypes.UUID,
    },
  },
  {
    freezeTableName: true,
  }
);

Rating.belongsTo(User, { as: 'rating_users', foreignKey: 'id_user' });
Rating.belongsTo(Product, { as: 'rating_products', foreignKey: 'id_product' });

module.exports = Rating;
