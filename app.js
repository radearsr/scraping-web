const express = require("express");
const bodyParser = require("body-parser");

const appRoutes = require("./routes/appRoutes.js")
const app = express();

const robot = require("./robot");
const utils = require("./utils");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: false}));

app.use("/", appRoutes);

app.listen(3005, () => {
  console.log("http://localhost:3005");
});


setInterval( async () => {
  await robot.main();
}, utils.getRandomDuration(3600000, 5400000));


setInterval( async () => {
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  if ((hours === 00 && seconds === 30) || (hours === "00" && seconds === "30")) {
    robot.resetStatus();
  }
}, 1000);
