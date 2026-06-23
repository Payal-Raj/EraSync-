const express = require("express");
const router = express.Router();

const { getReactions, addReaction, removeReaction } = require("../controllers/reactions.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.get("/:meme_id",    getReactions);
router.post("/",           verifyToken, addReaction);
router.delete("/:meme_id", verifyToken, removeReaction);

module.exports = router;