const express = require("express");
const router = express.Router();

const { getRatings, addRating } = require("../controllers/ratings.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.get("/:slang_id",  getRatings);
router.post("/",          verifyToken, addRating);

module.exports = router;