const express = require("express");
const router = express.Router();

const { getBookmarks, addBookmark, removeBookmark } = require("../controllers/bookmarks.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.get("/",                              verifyToken, getBookmarks);
router.post("/",                             verifyToken, addBookmark);
router.delete("/:content_type/:content_id", verifyToken, removeBookmark);

module.exports = router;