const puppeteer = require("puppeteer");
const extention = "C:\\Users\\ASUS\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 1\\Extensions\\ghbmnnjooekpmoecnnnilnnbdlolhkhi\\1.46.0_0";

const endpoint = "https://185.224.82.193";
const globalDataLink = {};
const data = [
  "https://185.224.82.193/anime/hack-g-u-trilogy/",
  "https://185.224.82.193/anime/youkoso-jitsuryoku-shijou-shugi-no-kyoushitsu-e-tv/",
  "https://185.224.82.193/anime/boruto-naruto-next-generations/",
];

const scraplinkVideo = async (linksEpsVideo, identityEps) => {
  // console.log("LINE 31", globalDataLink);
  if (!globalDataLink.hasOwnProperty(identityEps)) {
    globalDataLink[identityEps] = 0;
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const idxCurrentLinkVideo = globalDataLink[identityEps];

  const linkGotoPage = `${endpoint}${linksEpsVideo[idxCurrentLinkVideo]}`;
  // console.log("LINE 40", linkGotoPage);
  // console.log("LINE 42", idxCurrentLinkVideo);
  // if (linksEpsVideo[idxCurrentLinkVideo] == undefined) {
  //   console.log("LINE 44", linksEpsVideo);
  // }
  await page.goto(linkGotoPage);

  const srcIframe = await page.evaluate(async() => {
    const iframeEl = document.querySelector("#tontonin");
    const servers = document.querySelectorAll(".server");
    const availableServers = [...servers];
    const dataSrcIframe = availableServers.map((srv) => {
      srv.click()
      const text = srv.textContent;
      const srcLink = iframeEl.getAttribute("src");
      return {text, srcLink};
    });
    return dataSrcIframe;
  });

  console.log(srcIframe);
  // console.log("LINE 50", title);

  setTimeout(() => {
    browser.close();
  }, 1000);

  if (idxCurrentLinkVideo < linksEpsVideo.length - 1) {
    globalDataLink[identityEps]++;
    scraplinkVideo(linksEpsVideo, identityEps);
  }
};

const getLinkEveryEps = async (linkAnime) => {

  const browser = await puppeteer.launch();
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
const main = async (linksData) => {
  console.log(dataExtracted);
  const resultAllLinkEps = await getLinkEveryEps(linksData[dataExtracted]);
  console.log(resultAllLinkEps);
  const data = await scraplinkVideo(resultAllLinkEps, linksData[dataExtracted]);
  dataExtracted++;
  if (dataExtracted < linksData.length) {
    main(linksData);
  }
  // console.log(ResultDataExtracted);
};

main(data);

