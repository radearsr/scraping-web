const puppeteer = require("puppeteer");
const log = require("log-to-file");

exports.scrapingLinkStreamingVideo = async (link) => {
  let browser;
  try {
    if (process.env.BROWSER_CONF === "1") {
      browser = await puppeteer.launch({headless: false});
    } else if (process.env.BROWSER_CONF === "2") {
      browser = await puppeteer.launch({headless: true, args: ["--no-sandbox"],  executablePath: "/usr/bin/chromium-browser"});
    } else {
      browser = await puppeteer.launch({headless: true, args: ["--no-sandbox"]});
    }
    const page = await browser.newPage();
    await page.goto(link, {waitUntil: "networkidle2", timeout: 300000});
    await page.waitForSelector("#player > .jw-wrapper > .jw-media > .jw-video", { timeout: 300000 });
    const linkStreaming = await page.$eval("#player > .jw-wrapper > .jw-media > .jw-video", (el) => el.src);
    if (linkStreaming !== "") {
      return linkStreaming;
    } else {
      await scrapingVideo(link);
    }
  } catch (error) {
    log(error, "puppeetter-log.txt");
    throw error;
  } finally {
    browser.close();
  }
};

exports.getBrowserVersion = async () => {
  let browser;
  if (process.env.BROWSER_CONF === "1") {
    browser = await puppeteer.launch({headless: false});
  } else if (process.env.BROWSER_CONF === "2") {
    browser = await puppeteer.launch({headless: true, args: ["--no-sandbox"],  executablePath: "/usr/bin/chromium-browser"})
  } else {
    browser = await puppeteer.launch({headless: true, args: ["--no-sandbox"]});
  }
  console.log(await browser.version());
  await browser.close();
}

// (async() => {
//   let browser;
//   if (process.env.BROWSER_CONF === "1") {
//     browser = await puppeteer.launch({headless: false});
//   } else if (process.env.BROWSER_CONF === "2") {
//     browser = await puppeteer.launch({headless: true, args: ["--no-sandbox"],  executablePath: "/usr/bin/chromium-browser"})
//   } else {
//     browser = await puppeteer.launch({headless: true, args: ["--no-sandbox"]});
//   }
//   console.log(await browser.version());
//   await browser.close();
// })();