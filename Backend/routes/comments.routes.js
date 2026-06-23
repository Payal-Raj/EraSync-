const express = require("express");
const router = express.Router();

const { getComments, createComment, deleteComment } = require("../controllers/comments.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.get("/:content_type/:content_id",  getComments);
router.post("/",         verifyToken, createComment);
router.delete("/:id",    verifyToken, deleteComment);

module.exports = router;