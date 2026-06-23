const express = require("express");
const router = express.Router();

const { getFollowStats, followUser, unfollowUser } = require("../controllers/followers.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.get("/:id",    getFollowStats);
router.post("/:id",   verifyToken, followUser);
router.delete("/:id", verifyToken, unfollowUser);

module.exports = router;