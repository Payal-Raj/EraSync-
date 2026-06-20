const express = require("express");
const router = express.Router();

const { getAllSlangs, getSlangById, createSlang, deleteSlang } = require("../controllers/slangs.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.get("/",        getAllSlangs);       
router.get("/:id",     getSlangById);     
router.post("/",       verifyToken, createSlang);   
router.delete("/:id",  verifyToken, deleteSlang);    

module.exports = router;