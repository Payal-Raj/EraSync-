const express = require("express");
const router = express.Router();

const { getAllTrends, getTrendById, createTrend, deleteTrend } = require("../controllers/trends.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.get("/",       getAllTrends);
router.get("/:id",    getTrendById);
router.post("/",      verifyToken, createTrend);
router.delete("/:id", verifyToken, deleteTrend);

module.exports = router;