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

const memesRoutes  = require("./routes/memes.routes");
app.use("/api/memes", memesRoutes);

const memesTrends  = require("./routes/trends.routes");
app.use("/api/trends", memesTrends);

const commentsTrends  = require("./routes/comments.routes");
app.use("/api/comments", commentsTrends);

const reactionRoutes = require("./routes/reactions.routes");
app.use("/api/reactions", reactionRoutes);

const ratingRoutes = require("./routes/ratings.routes");
app.use("/api/ratings", ratingRoutes);

const bookmarkRoutes = require("./routes/bookmarks.routes");
app.use("/api/bookmarks", bookmarkRoutes);

const userRoutes = require("./routes/users.routes");
app.use("/api/users", userRoutes);

const followRoutes = require("./routes/followers.routes");
app.use("/api/follow", followRoutes);

const notificationRoutes = require("./routes/notifications.routes");
app.use("/api/notifications", notificationRoutes);

const analyticsRoutes = require("./routes/analytics.routes");
app.use("/api/analytics", analyticsRoutes);

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});