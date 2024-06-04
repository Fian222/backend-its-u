const { Sequelize } = require('sequelize');

const db = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: 'postgres',
  timezone: '+07:00',
  dialectOptions: {
    useUTC: false,
  },
});

module.exports = db;
