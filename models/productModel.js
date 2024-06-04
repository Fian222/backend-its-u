const { DataTypes } = require('sequelize');
const db = require('../database/database');
const User = require('./userModel');

const Product = db.define(
  'products',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    nama_produk: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jumlah: {
      type: DataTypes.INTEGER,
    },
    harga: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    gambar: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    public_id: {
      type: DataTypes.TEXT,
    },
    id_user: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    freezeTableName: true,
  }
);

User.hasMany(Product, { as: 'products', foreignKey: 'id_user' });
Product.belongsTo(User, { foreignKey: 'id_user' });

module.exports = Product;
