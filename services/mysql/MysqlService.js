const { connectToDatabase, queryDatabase, mysql} = require("../../database/methods");


exports.insertAnimeToMonitoring = async (title, url, day, status, episode) => {
  const conn = await connectToDatabase();
  const sql = "INSERT INTO monitoring_anime (name, link, day, status, episode) VALUES?"
  const sqlEscapeStr = [[
    [title, url, day, status, episode]
  ]];
  console.log(mysql.format(sql, sqlEscapeStr));
  const result = await queryDatabase(conn, sql, sqlEscapeStr);
  return result;
}

exports.getAnimesByDay = async (day, status) => {
  const conn = await connectToDatabase();
  const sql = "SELECT * FROM monitoring_anime WHERE day=? AND status=?";
  const sqlEscapeStr = [day, status];
  console.log(mysql.format(sql, sqlEscapeStr));
  const result = await queryDatabase(conn, sql, sqlEscapeStr);
  return result;
};

exports.updateAnimesById = async (eps, status, id) => {
  const conn = await connectToDatabase();
  const sql = "UPDATE monitoring_anime SET episode=?, status=? WHERE id=?";
  const sqlEscapeStr = [eps, status, id];
  console.log(mysql.format(sql, sqlEscapeStr));
  const result = await queryDatabase(conn, sql, sqlEscapeStr);
  console.log(result);
};

exports.updateStatusAnime = async (day) => {
  const conn = await connectToDatabase();
  const sql = "UPDATE monitoring_anime SET status='0' WHERE day != ?"
  const sqlEscapeStr= [day];
  console.log(mysql.format(sql, sqlEscapeStr));
  const result = await queryDatabase(conn, sql, sqlEscapeStr);
  console.log(result);
};
