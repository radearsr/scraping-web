require("dotenv").config();
const mysqlService = require("./services/mysql/MysqlService");
const cheerioService = require("./services/cheerio/CheerioService");
const teleService = require("./services/telegram/TeleServices");
const utils = require("./utils");


const main = async () => {
  try {
    const currentDay = utils.getCurrentDay()
    const animes = await mysqlService.getAnimesByDay(currentDay, "0");
    const linkPageDownloads = await Promise.all(animes.map( async (anime, index) => {
      const timeout = index * 5000;
      const result = await cheerioService.checkUpdateAndGetLinkDownload(anime.link, anime.episode, timeout);
      if (result.status) {
        return {
          id: anime.id,
          title: anime.name,
          link: result.link,
          eps: parseFloat(anime.episode) + 1
        };
      } else {
        await teleService.sendNotifFailed(process.env.BOT_TOKEN, process.env.GROUP_ID, "Anime Belum Update", anime.name, "23");
      }
    }));

    const filteredlinkPageDownloads = linkPageDownloads.filter((linkDownload) => linkDownload !== undefined);

    if (filteredlinkPageDownloads.length >= 1) {
      Promise.all(filteredlinkPageDownloads.map( async (linkPageDownload, index) => {
        try {
          const timeout = index * 5000;
          const dataLinkDownloadVideo = await cheerioService.getLinkDownloadVideo720p(linkPageDownload.link, timeout);
          if(dataLinkDownloadVideo.length >= 1) {
            await teleService.sendNotifSuccess(process.env.BOT_TOKEN, process.env.GROUP_ID, linkPageDownload.title, linkPageDownload.eps, dataLinkDownloadVideo);
            await mysqlService.updateAnimesById(linkPageDownload.eps, "1", linkPageDownload.id);
          } else {
            await teleService.sendNotifFailed(process.env.BOT_TOKEN, process.env.GROUP_ID, "Error Gagal Dapat Download Video", error, "38");
          }
        } catch (error) {
          await teleService.sendNotifFailed(process.env.BOT_TOKEN, process.env.GROUP_ID, "Error Link Page Download", error, "41");
        }
      }));
    } else {
      await teleService.sendNotifFailed(process.env.BOT_TOKEN, process.env.GROUP_ID, "Anime belum ada yang update hari ini...", "Ditunggu...", "45");
    }

  } catch (error) {
    await teleService.sendNotifFailed(process.env.BOT_TOKEN, process.env.GROUP_ID, "Error Main", error, "10");
    throw error;
  }
};

main();

const time = utils.getRandomDuration(1800000, 2400000);

setInterval( async () => {
  await main();
  await teleService.sendNotifFailed(process.env.BOT_TOKEN, process.env.GROUP_ID, "Waktu Mulai Ulang Dalam Menit", (time / 60000), "60");
}, time);

setInterval( async () => {
  let date = new Date();
  const hours = String(date.getHours()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  if ((hours === "00" && seconds >= "40") && (hours === "00" && seconds <= "46")) {
    await teleService.sendNotifFailed(process.env.BOT_TOKEN, process.env.GROUP_ID, "ALERT", "Database Reset Status To 0", "69");
    await resetStatus();
  }
  date = "";
}, 1000);
