const express = require("express");
const router = express.Router();
const appControllers = require("../controllers/appControllers");

router.get("/", appControllers.renderHomePage);
router.post("/monit/add", appControllers.postAddMonitoringAnime);

module.exports = router;