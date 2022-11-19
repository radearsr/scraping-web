require("dotenv").config();
const utils = require("./utils/");
const mysqlService = require("./services/mysql/MysqlService");
const puppeteer = require("puppeteer");




const getLinkDownloadPage = async (linkAnime, currentEps) => {
  let browser;
  try {
    if (process.env.BROWSER_TYPE === "1") {
      browser = await puppeteer.launch({headless: false});
    } else if (process.env.BROWSER_TYPE === "2") {
      browser = await puppeteer.launch({headless: true, args: ["--no-sandbox"],  executablePath: "/usr/bin/chromium-browser"});
    } else {
      browser = await puppeteer.launch({headless: true, args: ["--no-sandbox"]});
    }
    const page = await browser.newPage();
    await page.goto(linkAnime, {waitUntil: "networkidle0", timeout: 90000});
  
    await page.waitForSelector("#venkonten > div.venser > div:nth-child(8) > ul > li > span > a", {visible: true, timeout: 90000});
  
    const result = await page.evaluate( async () => {
      const selectorEpisodeList = "#venkonten > div.venser > div:nth-child(8) > ul > li > span > a";
      return [...document.querySelectorAll(selectorEpisodeList)].map((anchor) => anchor.href);
    });
    
    if (result.length > currentEps) {
      sendNotifToTelegram(process.env.BOT_TOKEN, process.env.GROUP_ID, result[0], "Link page download didapat...", "", 0);
      return result[0];
    }
    return false;
  } catch (error) {
    sendNotifToTelegram(process.env.BOT_TOKEN, process.env.GROUP_ID, error, "Get Link Download Page", "", 0);
    console.error(error);
    return false;
  } finally {
    browser.close();
  }
};

const getLinkDownloadVideo = async (link) => {
  let browser;
  try {
    if (process.env.BROWSER_TYPE === "1") {
      browser = await puppeteer.launch({headless: false});
    } else if (process.env.BROWSER_TYPE === "2") {
      browser = await puppeteer.launch({headless: true, args: ["--no-sandbox"],  executablePath: "/usr/bin/chromium-browser"});
    } else {
      browser = await puppeteer.launch({headless: true, args: ["--no-sandbox"]});
    }
    const page = await browser.newPage();
    await page.goto(link, {waitUntil: "networkidle0", timeout: 240000});
    await page.waitForSelector("#venkonten > div.venser > div.venutama > div.download > ul:nth-child(2) > li:nth-child(3) > a", {visible: true, timeout: 240000});
    
    const result = await page.evaluate( async () => {
      const selectorLinkDownloadEpisode = "#venkonten > div.venser > div.venutama > div.download > ul:nth-child(2) > li:nth-child(3) > a";
      return [...document.querySelectorAll(selectorLinkDownloadEpisode)].map((anchor) => ({link: anchor.href, text: anchor.textContent}))
    });
    sendNotifToTelegram(process.env.BOT_TOKEN, process.env.GROUP_ID, result, "Link download video didapat...", "", 0);
    return result;
  } catch (error) {
    return sendNotifToTelegram(process.env.BOT_TOKEN, process.env.GROUP_ID, error, "Get Link Download Video", "", 0);
  } finally {
    browser.close();
  }
}

(async() => {
  let browser;
  if (process.env.BROWSER_TYPE === "1") {
    browser = await puppeteer.launch({headless: false});
  } else if (process.env.BROWSER_TYPE === "2") {
    browser = await puppeteer.launch({headless: true, args: ["--no-sandbox"],  executablePath: "/usr/bin/chromium-browser"});
  } else {
    browser = await puppeteer.launch({headless: true, args: ["--no-sandbox"]});
  }
  console.log(await browser.version());
  await browser.close();
})();

const main = async () => {
  try {
    const currDay = utils.getCurrentDay();
    const animes = await mysqlService.getAnimesByDay(currDay, "0");
    sendNotifToTelegram(process.env.BOT_TOKEN, process.env.GROUP_ID, animes, `Hari ini ${currDay}`, "", 0);
    if (animes.length < 1) {
      return sendNotifToTelegram(process.env.BOT_TOKEN, process.env.GROUP_ID, `Hari ini ${currDay}`, "Anime tidak ada didatabase...", "", 0);
    }

    const links = (time, anime) => {
      return new Promise((resolve, reject) => {
        setTimeout( async () => {
          const linkDownloadPage = await getLinkDownloadPage(anime.link, anime.episode);
          if (!linkDownloadPage) {
            reject("Belum Update...");
          }
          resolve({
            link_download: linkDownloadPage,
            title: anime.name,
            id: anime.id,
            eps: anime.episode + 1,
          });
        }, time);
      })
    };

    const downloadPages = await Promise.all(animes.map( async (anime, index) => {
      try {
        const data = await links(60000 * (index + 1), anime);
        console.log("downloadPages", data);
        return data;
      } catch (error) {
        console.log(error);
      }
    }));

    await Promise.all(downloadPages.map( async (downloadPage, index) => {
      if (downloadPage === false || downloadPage === undefined) {
        return sendNotifToTelegram(process.env.BOT_TOKEN, process.env.GROUP_ID, downloadPage, "Belum ada update...", "", 0);
      } else {
        console.log("Link download", downloadPage.link_download);
        setTimeout( async () => {
          const linkDownloadVideo = await getLinkDownloadVideo(downloadPage.link_download);
          if (!linkDownloadVideo) {
            console.log("Gagal mendapatkan link download...");
          }
          await sendNotifToTelegram(process.env.BOT_TOKEN, process.env.GROUP_ID, linkDownloadVideo, downloadPage.title, downloadPage.eps);
          await mysqlService.updateAnimesById(downloadPage.eps, "1", downloadPage.id);
        }, 90000 * (index + 1));
      }
    }));

  } catch (error) {
    await sendNotifToTelegram(process.env.BOT_TOKEN, process.env.GROUP_ID, error, "Main", "", 0);
  }

}

const resetStatus = async () => {
  try {
    const currDay = utils.getCurrentDay();
    await mysqlService.updateStatusAnime(currDay);
  } catch (error) {
    await sendNotifToTelegram(process.env.BOT_TOKEN, process.env.GROUP_ID, currDay, "Reset Status", "", 0);
  }
}


const duration =  utils.getRandomDuration(1800000, 2400000);

setInterval( async () => {
  await main();
  sendNotifToTelegram(process.env.BOT_TOKEN, process.env.GROUP_ID, "Aman..", `Main Running After ${duration}`, "", 0);
}, duration);


setInterval( async () => {
  let date = new Date();
  const hours = String(date.getHours()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  if ((hours === 00 && seconds >= 40) || (hours === "00" && seconds >= "40")) {
    sendNotifToTelegram(process.env.BOT_TOKEN, process.env.GROUP_ID, "Hari Berganti", "Reset status database...", "", 0);
    await resetStatus();
  }
  date = "";
}, 1000);

main();
