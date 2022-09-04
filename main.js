const express = require("express");
const app = express();
const puppeteer = require("puppeteer");

const main = async () => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://185.224.82.193/anime-list/");

  const result = await page.evaluate(async() => {
    const elementLists = document.querySelectorAll(".anime-list > li");
    // return elementLists[0].childNodes[0].textContent
    const elDatas = [...elementLists];
    return elDatas.map((el) => `https://185.224.82.193${el.childNodes[0].getAttribute("href")}`);
  });

  return new Promise((resolve) => {
    resolve(result);
  });
};

app.get("/", async (req, res) => {
  const result = await main();
  res.json(result);
});

app.listen(80);
