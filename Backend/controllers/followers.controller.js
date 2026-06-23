const pool = require("../db");

const getFollowStats = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`
            SELECT
                (SELECT COUNT(*) FROM user_followers WHERE following_id = $1) AS followers,
                (SELECT COUNT(*) FROM user_followers WHERE follower_id  = $1) AS following
        `, [id]);

        res.status(200).json({
            user_id:   parseInt(id),
            followers: parseInt(result.rows[0].followers),
            following: parseInt(result.rows[0].following)
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching follow stats" });
    }
};

const followUser = async (req, res) => {
    const following_id = parseInt(req.params.id);
    const follower_id  = req.user.user_id;

    if (follower_id === following_id) {
        return res.status(400).json({ error: "You cannot follow yourself" });
    }

    try {
        const userExists = await pool.query(
            "SELECT user_id FROM users WHERE user_id = $1",
            [following_id]
        );

        if (userExists.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const existing = await pool.query(
            "SELECT * FROM user_followers WHERE follower_id = $1 AND following_id = $2",
            [follower_id, following_id]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({ error: "You are already following this user" });
        }

        await pool.query(
            "INSERT INTO user_followers (follower_id, following_id) VALUES ($1, $2)",
            [follower_id, following_id]
        );

        res.status(201).json({ message: "User followed successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while following user" });
    }
};

const unfollowUser = async (req, res) => {
    const following_id = parseInt(req.params.id);
    const follower_id  = req.user.user_id;

    try {
        const existing = await pool.query(
            "SELECT * FROM user_followers WHERE follower_id = $1 AND following_id = $2",
            [follower_id, following_id]
        );

        if (existing.rows.length === 0) {
            return res.status(404).json({ error: "You are not following this user" });
        }

        await pool.query(
            "DELETE FROM user_followers WHERE follower_id = $1 AND following_id = $2",
            [follower_id, following_id]
        );

        res.status(200).json({ message: "User unfollowed successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while unfollowing user" });
    }
};


module.exports = { getFollowStats, followUser, unfollowUser };