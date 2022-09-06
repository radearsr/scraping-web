const mysql = require("mysql");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "scrap_animeindo",
});

module.exports = {pool, mysql};