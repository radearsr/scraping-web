const { connectToDatabase, queryDatabase, mysql} = require("../../database/methods");

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

exports.checkStatusUpdateAnime = async (day) => {
  const conn = await connectToDatabase();
  const sql = "SELECT name from monitoring_anime where day != ? and status='1'";
  const sqlEscapeStr = [day];
  console.log(mysql.format(sql, sqlEscapeStr));
  const result = await queryDatabase(conn, sql, sqlEscapeStr);
  return result;
};

exports.getLinkAnimes = async (status) => {
  const conn = await connectToDatabase();
  const sql = "SELECT * FROM anime_lists WHERE status=? LIMIT 1";
  const sqlEscapeStr = [status];
  console.log(mysql.format(sql, sqlEscapeStr));
  const result = await queryDatabase(conn, sql, sqlEscapeStr);
  return result;
};

exports.updateStatusListAnime = async (status, id) => {
  const conn = await connectToDatabase();
  const sql = "UPDATE anime_lists SET status=? WHERE id=?";
  const sqlEscapeStr = [status, id];
  const result = await queryDatabase(conn, sql, sqlEscapeStr);
  return result;
};

exports.insertLinkStreamingPage = async (data) => {
  const conn = await connectToDatabase();
  const sql = "INSERT INTO anime_eps (id_anime, episodes, link_episode, status) VALUES ?";
  const sqlEscapeStr = [data];
  console.log(mysql.format(sql, sqlEscapeStr));
  await queryDatabase(conn, sql, sqlEscapeStr);
};
