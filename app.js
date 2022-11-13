require("dotenv").config();
const utils = require("./utils/");
const mysqlService = require("./services/mysql/MysqlService");
const puppeteer = require("puppeteer");
const axios = require("axios");

const sendNotifToTelegram = async (token, msgId, message,  title, episode, status=1) => {
  try {
    if (!status) {
      return await axios.get(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${msgId}&text=${title}%0D%0A${message}`);
    }
    const reformatLinks = message.map((msg) => {
      return `Tempat : ${msg.text}%0D%0ALink : ${msg.link}`;
    }).join("%0D%0A");
    const formatMsg = `>>>> Anime Update <<<<%0D%0A>>${title}<<%0D%0A>>Episode ${episode}<<%0D%0A${reformatLinks}`;
    await axios.get(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${msgId}&text=${formatMsg}`);
    console.log("Terkirim");
  } catch (error) {
    console.error(error);
  }
};

const getLinkDownloadPage = async (linkAnime, currentEps) => {
  let browser;
  try {
    // browser = await puppeteer.launch();
    // browser = await puppeteer.launch({headless: true, args: ["--no-sandbox"]});
    browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(linkAnime, {waitUntil: "networkidle0", timeout: 90000});
  
    await page.waitForSelector("#venkonten > div.venser > div:nth-child(8) > ul > li > span > a", {visible: true, timeout: 90000});
  
    const result = await page.evaluate( async () => {
      const selectorEpisodeList = "#venkonten > div.venser > div:nth-child(8) > ul > li > span > a";
      return [...document.querySelectorAll(selectorEpisodeList)].map((anchor) => anchor.href);
    });
    
    if (result.length > currentEps) {
      console.log("Link Page Download Didapat...");
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
    // browser = await puppeteer.launch();
    // browser = await puppeteer.launch({headless: true, args: ["--no-sandbox"]});
    browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(link, {waitUntil: "networkidle0", timeout: 240000});
    await page.waitForSelector("#venkonten > div.venser > div.venutama > div.download > ul:nth-child(2) > li:nth-child(3) > a", {visible: true, timeout: 240000});
    
    const result = await page.evaluate( async () => {
      const selectorLinkDownloadEpisode = "#venkonten > div.venser > div.venutama > div.download > ul:nth-child(2) > li:nth-child(3) > a";
      return [...document.querySelectorAll(selectorLinkDownloadEpisode)].map((anchor) => ({link: anchor.href, text: anchor.textContent}))
    });
    console.log("Link Download Anime Didapat...");
    return result;
  } catch (error) {
    sendNotifToTelegram(process.env.BOT_TOKEN, process.env.GROUP_ID, error, "Get Link Download Video", "", 0);
    console.error(error);
    return false;
  } finally {
    browser.close();
  }
}

(async() => {
  const browser = await puppeteer.launch();
  //const browser = await puppeteer.launch({headless: true, args: ["--no-sandbox"]});
  console.log(await browser.version());
  await browser.close();
})();

const main = async () => {
  try {
    const currDay = utils.getCurrentDay();
    const animes = await mysqlService.getAnimesByDay(currDay, "0");
    if (animes.length < 1) {
      console.log("Anime tidak ada didatabase...");
      return false;
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
    }

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
        console.log("Belum ada update...");
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
    await sendNotifToTelegram(process.env.BOT_TOKEN, process.env.GROUP_ID, error, "Reset Status", "", 0);
  }
}


setInterval( async () => {
  await main();
}, utils.getRandomDuration(1800000, 2400000));


setInterval( async () => {
  let date = new Date();
  const hours = String(date.getHours()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  if ((hours === 00 && seconds >= 40) || (hours === "00" && seconds >= "40")) {
    await resetStatus();
  }
  date = "";
}, 1000);

main();
