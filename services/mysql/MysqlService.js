const { connectToDatabase, queryDatabase, mysql} = require("../../database/methods");

// Monitoring Anime
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

// Anime Lists
exports.getLinkAnimes = async (status) => {
  const conn = await connectToDatabase();
  const sql = "SELECT * FROM anime_lists WHERE status=? LIMIT 1";
  const sqlEscapeStr = [status];
  console.log(mysql.format(sql, sqlEscapeStr));
  const result = await queryDatabase(conn, sql, sqlEscapeStr);
  return result;
};

exports.insertLinkStreamingPage = async (data) => {
  const conn = await connectToDatabase();
  const sql = "INSERT INTO anime_eps (id_anime, episodes, link_episode, status) VALUES ?";
  const sqlEscapeStr = [data];
  console.log(mysql.format(sql, sqlEscapeStr));
  const result = await queryDatabase(conn, sql, sqlEscapeStr);
  return result.affectedRows;
};

exports.updateStatusListAnime = async (status, id) => {
  const conn = await connectToDatabase();
  const sql = "UPDATE anime_lists SET status=? WHERE id=?";
  const sqlEscapeStr = [status, id];
  console.log(mysql.format(sql, sqlEscapeStr));
  const result = await queryDatabase(conn, sql, sqlEscapeStr);
  return result;
};

exports.updateTotalEpsAnimeList= async (totalEps, id) => {
  const conn = await connectToDatabase();
  const sql = "UPDATE anime_lists SET total_eps=? WHERE id=?";
  const sqlEscapeStr = [totalEps, id];
  const result = await queryDatabase(conn, sql, sqlEscapeStr);
  console.log(mysql.format(sql, sqlEscapeStr));
  return result;
};

// Anime Episode List
exports.getLinkPagePerEps = async (status) => {
  const conn = await connectToDatabase();
  const sql = "SELECT * FROM anime_eps WHERE status=? AND link_episode IS NOT NULL LIMIT 1";
  const sqlEscapeStr = [status];
  console.log(mysql.format(sql, sqlEscapeStr));
  const result = await queryDatabase(conn, sql, sqlEscapeStr);
  return result;
};

exports.updateStatusListEpisode = async (status, id) => {
  const conn = await connectToDatabase();
  const sql = "UPDATE anime_eps SET status=? WHERE id=?";
  const sqlEscapeStr = [status, id];
  console.log(mysql.format(sql, sqlEscapeStr));
  await queryDatabase(conn, sql, sqlEscapeStr);
};

exports.insertStreamingVideo = async (data) => {
  const conn = await connectToDatabase();
  const sql = "INSERT INTO video_req_sources (id_episode, link_video, link_video_hd, status) VALUES ?";
  const sqlEscapeStr = [data];
  console.log(mysql.format(sql, sqlEscapeStr));
  await queryDatabase(conn, sql, sqlEscapeStr);
};

// Anime Streaming Player
exports.getSourceStreaming = async (status) => {
  const conn = await connectToDatabase();
  const sql = "SELECT * FROM video_req_sources WHERE status=? AND (link_video IS NOT NULL OR link_video_hd IS NOT NULL) LIMIT 1";
  const sqlEscapeStr = [status];
  console.log(mysql.format(sql, sqlEscapeStr));
  const result = await queryDatabase(conn, sql, sqlEscapeStr);
  return result;
};

exports.updateSourceStreaming = async (status, id) => {
  const conn = await connectToDatabase();
  const sql = "UPDATE video_req_sources SET status=? WHERE id=?";
  const sqlEscapeStr = [status, id];
  console.log(mysql.format(sql, sqlEscapeStr));
  await queryDatabase(conn, sql, sqlEscapeStr);
}

exports.insertLinkVideoPlayer = async (data) => {
  const conn = await connectToDatabase();
  const sql = "INSERT INTO video_res_sources (id_video_source, link_video, link_video_hd) VALUES ?";
  const sqlEscapeStr = [data];
  console.log(mysql.format(sql, sqlEscapeStr));
  const result = await queryDatabase(conn, sql, sqlEscapeStr);
  return result.affectedRows;
}
