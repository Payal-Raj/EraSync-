const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require("./db");

const app = express();
app.use(express.json());
app.use(cors());

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

const slangRoutes  = require("./routes/slang.routes");
app.use("/api/slangs", slangRoutes);

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});