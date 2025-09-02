const mysql = require("mysql2/promise"); // Correct pour CommonJS

const db = mysql.createPool({
  host: "192.168.29.130", // ou l'IP de la VM si distant
  user: "gael",
  password: "Fred123!",
  database: "library_db",
});

module.exports = { db };
