const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require("./db");
const authRoutes = require("./routes/auth.routes");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});