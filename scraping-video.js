const puppeteer = require("puppeteer");
const extention = "C:\\Users\\ASUS\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 1\\Extensions\\ghbmnnjooekpmoecnnnilnnbdlolhkhi\\1.46.0_0";

const data = [
  "https://185.224.82.193/anime/hack-g-u-trilogy/",
];

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

const scraplinkVideo = async (linkEpsVideo) => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto(linkEpsVideo);
  checkContentServerMp4(page);
};

const main = async (linkdata) => {

  const browser = await puppeteer.launch({headless: false, ignoreDefaultArgs: ["--disable-extensions", "--enable-automation"],});
  const page = await browser.newPage();

  let totalEps = 0;

  await page.goto(linkdata);

  const resultAllLinkEps = await page.evaluate(async() => {
    const linksEps = document.querySelectorAll(".ep > a");
    const linkPerEps = [...linksEps];
    return linkPerEps.map((link) => link.getAttribute("href"));
  });

  scraplinkVideo(`https://185.224.82.193/${resultAllLinkEps[0]}`);
  // resultAllLinkEps.forEach((resultLink) => {
  // });

  // const resultLink = await page.evaluate(async() => {
  //   const countEps = document.querySelectorAll(".ep > a");
  //   return countEps.length;
  // });

  // console.log(resultLink);

  // return new Promise((resolve) => {
  //   resolve(result);
  // });

  browser.close();
};

data.forEach((dt) => {
  main(dt);
});