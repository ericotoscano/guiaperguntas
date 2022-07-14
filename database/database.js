const Sequelize = require("sequelize");

const connection = new Sequelize("guiaperguntas", "root", "@Vml814151923", {
  host: "localhost",
  dialect: "mysql"
});

module.exports = connection;
