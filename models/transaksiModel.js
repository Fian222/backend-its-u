const db = require('../database/database');
const { DataTypes } = require('sequelize');
const Product = require('./productModel');
const User = require('./userModel');

const Transaksi = db.define(
  'transaksi',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    status: {
      type: DataTypes.ENUM('pending', 'success', 'failed'),
    },
    jumlah_barang: {
      type: DataTypes.INTEGER,
    },
    total_harga: {
      type: DataTypes.INTEGER,
    },
    nomor_resi: {
      type: DataTypes.STRING,
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

Transaksi.belongsTo(User, { as: 'transaksi_users', foreignKey: 'id_user' });
Transaksi.belongsTo(Product, { as: 'transaksi_products', foreignKey: 'id_product' });

module.exports = Transaksi;
