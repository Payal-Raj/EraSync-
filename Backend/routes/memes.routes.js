const express = require("express");
const router = express.Router();

const { getAllMemes, getMemeById, createMeme, deleteMeme } = require("../controllers/memes.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.get("/",       getAllMemes);
router.get("/:id",    getMemeById);
router.post("/",      verifyToken, createMeme);
router.delete("/:id", verifyToken, deleteMeme);

module.exports = router;