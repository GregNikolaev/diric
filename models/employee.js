const Config = require('../config');
const Sequelize = require('sequelize');
const db = new Sequelize(Config.DB.name, Config.DB.user, Config.DB.pass, Config.DB.opts);

const model = db.define('employees', {
  name: {
    type: Sequelize.STRING,

  },
  soname: {
    type: Sequelize.STRING,

  },
  position: {
    type: Sequelize.STRING,

  },
  description: {
    type: Sequelize.STRING,

  }
}, {timestamps: false});

module.exports = model;