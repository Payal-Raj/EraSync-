const express = require("express");
const router = express.Router();

const { getOverview, getGenerationStats, getTopContent } = require("../controllers/analytics.controller");

router.get("/overview",     getOverview);
router.get("/generations",  getGenerationStats);
router.get("/top-content",  getTopContent);

module.exports = router;