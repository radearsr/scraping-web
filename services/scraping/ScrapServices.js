// require("dotenv").config();
const puppeteer = require("puppeteer");
const { sendNotifToTelegram } = require("../telegram/TeleServices")

exports.getLinkDownloadPage = async (linkAnime, currentEps) => {
  try {
    // const browser = await puppeteer.launch({headless: false});
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(linkAnime);
  
    await page.waitForSelector("#venkonten > div.venser > div:nth-child(8) > ul > li > span > a");
  
    const result = await page.evaluate( async () => {
      const selectorEpisodeList = "#venkonten > div.venser > div:nth-child(8) > ul > li > span > a";
      return [...document.querySelectorAll(selectorEpisodeList)].map((anchor) => anchor.href);
    });
  
    browser.close();
  
    if (result.length > currentEps) {
      console.log("Link Page Download Didapat...");
      return result[0];
    }
    return false;
  } catch (error) {
    sendNotifToTelegram(process.env.BOT_TOKEN, process.env.GROUP_ID, error, "Get Link Download Page", "", 0);
    console.error(error);
    return false;
  }
};

exports.getLinkDownloadVideo = async (link) => {
  try {
    // const browser = await puppeteer.launch({headless: false});
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(link);
    await page.waitForSelector("#venkonten > div.venser > div.venutama > div.download > ul:nth-child(2) > li:nth-child(3) > a");
    
    const result = await page.evaluate( async () => {
      const selectorLinkDownloadEpisode = "#venkonten > div.venser > div.venutama > div.download > ul:nth-child(2) > li:nth-child(3) > a";
      return [...document.querySelectorAll(selectorLinkDownloadEpisode)].map((anchor) => ({link: anchor.href, text: anchor.textContent}))
    });
    browser.close();
    console.log("Link Download Anime Didapat...");
    return result;
  } catch (error) {
    sendNotifToTelegram(process.env.BOT_TOKEN, process.env.GROUP_ID, error, "Get Link Download Video", "", 0);
    console.error(error);
    return false;
  }
}

(async() => {
  const browser = await puppeteer.launch();
  console.log(await browser.version());
  await browser.close();
})();

