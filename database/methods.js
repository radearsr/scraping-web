const { pool, mysql } = require("./pool")

const connectToDatabase = () => (new Promise((resolve, reject) => {
  pool.getConnection((error, conn) => {
    if (error) reject(error);
    resolve(conn);
  });
}));


const queryDatabase = (connection, sqlString, escapeStrValue) => (new Promise((resolve, reject) => {
  connection.query(sqlString, escapeStrValue, (error, result) => {
    if (error) reject(error);
    connection.release();
    resolve(result); 
  });
  
}));

module.exports = { connectToDatabase, queryDatabase, mysql };
