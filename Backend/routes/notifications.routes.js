const express = require("express");
const router = express.Router();

const { getNotifications, deleteNotification } = require("../controllers/notifications.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.get("/",       verifyToken, getNotifications);
router.delete("/:id", verifyToken, deleteNotification);

module.exports = router;