require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const puppetteerService = require("./services/puppetter/PuppetterService");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.post("/getter", async (req, res) => {
  try {
    const { link_streaming } = req.body;
    console.log(await puppetteerService.getBrowserVersion());
    const result = await puppetteerService.scrapingLinkStreamingVideo(link_streaming);
    res.statusCode = 200;
    res.json({
      status: "success",
      result,
    });
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    res.json({
      status: "error",
      msg: "Terjadi kegagalan pada server...",
    });
  }
})

const port = 3000;

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
