const puppeteer = require("puppeteer");
const extention = "C:\\Users\\ASUS\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 1\\Extensions\\ghbmnnjooekpmoecnnnilnnbdlolhkhi\\1.46.0_0";

const endpoint = "https://185.224.82.193";
const globalDataLink = {};
const data = [
  "https://185.224.82.193/anime/hack-g-u-trilogy/",
  "https://185.224.82.193/anime/youkoso-jitsuryoku-shijou-shugi-no-kyoushitsu-e-tv/"
];

const passedData = [];

let num = 0;
const checkContentServerMp4 = async (page) => {
  console.log(num);
  const buttonServerMp4 = await page.evaluate( async () => {
    const servers = document.querySelectorAll(".server");
    const availableServers = [...servers];
    availableServers.forEach((srv) => {
      if(srv.textContent == "MP4") {
        srv.click();
      }
    })
  });


};


const scraplinkVideo = async (linksEpsVideo, identityEps) => {
  console.log("LINE 31", globalDataLink);
  if (!globalDataLink.hasOwnProperty(identityEps)) {
    globalDataLink[identityEps] = 0;
  }

  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  const idxCurrentLinkVideo = globalDataLink[identityEps];

  const linkGotoPage = `${endpoint}${linksEpsVideo[idxCurrentLinkVideo]}`;
  console.log("LINE 40", linkGotoPage);
  console.log("LINE 42", idxCurrentLinkVideo);
  if (linksEpsVideo[idxCurrentLinkVideo] == undefined) {
    console.log("LINE 44", linksEpsVideo);
  }
  await page.goto(linkGotoPage);

  const title = await page.evaluate(async() => {
    return document.querySelector("#content-wrap > div.ngiri > h1").textContent;
  });

  console.log("LINE 50", title);

  setTimeout(() => {
    browser.close();
  }, 2000);

  
  if (idxCurrentLinkVideo < linksEpsVideo.length - 1) {
    globalDataLink[identityEps]++;
    scraplinkVideo(linksEpsVideo, identityEps);
  }
};

const getLinkEveryEps = async (linkAnime) => {

  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  let totalEps = 0;

  await page.goto(linkAnime);

  const resultAllLinkEps = await page.evaluate(async() => {
    const linksEps = document.querySelectorAll(".ep > a");
    const linkPerEps = [...linksEps];
    return linkPerEps.map((link) => link.getAttribute("href"));
  });
  browser.close();

  return new Promise((resolve) => {
    resolve(resultAllLinkEps);
  });
};


let dataExtracted = 0;
const ResultDataExtracted = [];
const main = async (linksData) => {
  console.log(dataExtracted);
  const resultAllLinkEps = await getLinkEveryEps(linksData[dataExtracted]);
  console.log(resultAllLinkEps);
  const data = await scraplinkVideo(resultAllLinkEps, linksData[dataExtracted]);
  // ResultDataExtracted.push(resultAllLinkEps);
  dataExtracted++;
  if (dataExtracted < linksData.length) {
    main(linksData);
  }
  console.log(ResultDataExtracted);
};

main(data);

