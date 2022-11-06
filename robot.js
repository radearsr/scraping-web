require("dotenv").config();
const mysqlService = require("./services/mysql/MysqlService");
const scrapServices = require("./services/scraping/ScrapServices");
const teleService = require("./services/telegram/TeleServices");
const utils = require("./utils/index");

exports.main = async () => {
  try {
    const currDay = utils.getCurrentDay();
    const animes = await mysqlService.getAnimesByDay(currDay, "0");
    if (animes.length < 1) {
      console.log("Anime tidak ada didatabase...");
      return false;
    }
    animes.forEach( async (anime) => {
      const linkDownloadPage = await scrapServices.getLinkDownloadPage(anime.link, anime.episode);
      if (!linkDownloadPage) {
        console.log("Belum Update...");
        return false;
      }
      const linkDownloads = await scrapServices.getLinkDownloadVideo(linkDownloadPage);
      if (!linkDownloads) {
        console.log("Gagal mendapatkan link download...");
        return false;
      }
      await teleService.sendNotifToTelegram(process.env.BOT_TOKEN, process.env.GROUP_ID, linkDownloads, anime.name);
      await mysqlService.updateAnimesById(anime.episode + 1, "1", anime.id);
    });
  } catch (error) {
    await teleService.sendNotifToTelegram(process.env.BOT_TOKEN, process.env.GROUP_ID, error, "Main", 0);
  }

}

exports.resetStatus = async () => {
  try {
    const currDay = utils.getCurrentDay();
    await mysqlService.updateStatusAnime(currDay);
  } catch (error) {
    await teleService.sendNotifToTelegram(process.env.BOT_TOKEN, process.env.GROUP_ID, error, "Reset Status", 0);
  }
}
