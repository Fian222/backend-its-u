const db = require('../database/database');
const { DataTypes } = require('sequelize');

const User = db.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alamat: {
      type: DataTypes.TEXT,
    },
    nomor_telp: {
      type: DataTypes.STRING,
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user',
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = User;
