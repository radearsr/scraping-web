const mysqlService = require("../services/mysql/MysqlService");

exports.renderHomePage = (req, res) => {
  res.render("index");
}

exports.postAddMonitoringAnime = async (req, res) => {
  try {
    const {
      title,
      url,
      day,
      status,
      episode,
    } = req.body;
    await mysqlService.insertAnimeToMonitoring(title, url, day, status, episode);
    res.redirect("/");
  } catch (error) {
    res.render("error");
    console.error(error);
  }
} 