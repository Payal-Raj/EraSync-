const express = require("express");
const router = express.Router();

const { getUserById, getMyProfile, updateMyProfile } = require("../controllers/users.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.get("/me/profile",  verifyToken, getMyProfile);      
router.get("/:id",         getUserById);                   
router.put("/me/profile",  verifyToken, updateMyProfile);   

module.exports = router;