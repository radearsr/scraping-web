const puppeteer = require("puppeteer");
const { connectToDatabase, queryDatabase } = require("./database/methods");
const { pool, mysql } = require("./database/pool");

const endpoint = "https://185.224.82.193";
// const globalDataLink = {}; Ambil dari database episode
const data = [];

const checkAvaibleIdTitleInEpisode = async (id) => {
  const conn = await connectToDatabase();
  const result = await queryDatabase(conn, "SELECT * FROM data_episode WHERE id_data_title=?", [id]);
  return result.length;
};

const scraplinkVideo = async (linksEpsVideo, idTitleAnime) => {
  const idxCurrentLinkVideo = await checkAvaibleIdTitleInEpisode(idTitleAnime);
  console.log(idxCurrentLinkVideo);

  let conn;
  if (idxCurrentLinkVideo < 1) {
    conn = await connectToDatabase();
    await queryDatabase(conn, "INSERT INTO data_episode (episode, link_per_episode, id_data_title) VALUES ?", [[[1, linksEpsVideo[idxCurrentLinkVideo], idTitleAnime]]]);
  } else {
    conn = await connectToDatabase();
    await queryDatabase(conn, "INSERT INTO data_episode (episode, link_per_episode, id_data_title) VALUES ?", [[[idxCurrentLinkVideo + 1, linksEpsVideo[idxCurrentLinkVideo], idTitleAnime]]]);
  }

  console.log("IDXCurrLinkVideo", idxCurrentLinkVideo);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const linkGotoPage = `${endpoint}${linksEpsVideo[idxCurrentLinkVideo]}`;

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

  setTimeout(() => {
    browser.close();
  }, 1000);

  if (idxCurrentLinkVideo < linksEpsVideo.length - 1) {
    console.log("In If", idxCurrentLinkVideo);
    await scraplinkVideo(linksEpsVideo, idTitleAnime);
  }
  console.log("Selesai");
  console.log(data);
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

// Get Current Index to extract data, fetch from database 
const getIndexToExtract = async () => {
  const conn = await connectToDatabase();
  const [resultIndex] = await queryDatabase(conn, "SELECT COUNT(status) AS idx FROM title_done WHERE status=?", ["selesai"]);
  return resultIndex.idx;
};

// Get Total data in table database
const getTotalData = async () => {
  const conn = await connectToDatabase();
  const [resultTotal] = await queryDatabase(conn, "SELECT COUNT(link_anime) AS total_data FROM title_done");
  return resultTotal["total_data"];
};

const main = async (linksData) => {
  
  const dataExtracted = await getIndexToExtract();
  const totalData = await getTotalData();
  const linkForExtract = linksData[dataExtracted];

  const allLinkPerEps = await getLinkEveryEps(linksData[dataExtracted]);
  console.log("Link Per Eps",allLinkPerEps);

  let conn;

  conn = await connectToDatabase();
  const [resultIdTitle] = await queryDatabase(conn, "SELECT id FROM title_done WHERE link_anime=?", [linkForExtract])

  console.log("Before scrap");
  await scraplinkVideo(allLinkPerEps, resultIdTitle.id);
  console.log("After scrap");

  conn = await connectToDatabase();
  await queryDatabase(conn, "UPDATE title_done SET status=? WHERE link_anime=?", ["selesai", linkForExtract]);
  console.log("After Update");

  if (dataExtracted < totalData) {
    console.log(dataExtracted);
    main(linksData);
  }
};

// Get All DataLink from database
( async () => {
  console.log("Hello")
  const conn = await connectToDatabase();
  const resultData = await queryDatabase(conn, "SELECT link_anime FROM title_done");
  const result = resultData.map((rst) => rst.link_anime);
  data.push(...result);
  console.log(data);
})();
main(data);


