const pool = require("../db");

const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`
            SELECT
                user_id,
                username,
                bio,
                avatar_url,
                location,
                generation,
                role,
                created_at
            FROM users
            WHERE user_id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const stats = await pool.query(`
            SELECT
                (SELECT COUNT(*) FROM slangs WHERE submitted_by = $1) AS total_slangs,
                (SELECT COUNT(*) FROM memes  WHERE submitted_by = $1) AS total_memes,
                (SELECT COUNT(*) FROM trends WHERE submitted_by = $1) AS total_trends
        `, [id]);

        res.status(200).json({
            user: result.rows[0],
            stats: stats.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching user" });
    }
};

const getMyProfile = async (req, res) => {
    const user_id = req.user.user_id;

    try {
        const result = await pool.query(`
            SELECT
                user_id,
                username,
                email,
                bio,
                avatar_url,
                location,
                generation,
                role,
                created_at
            FROM users
            WHERE user_id = $1
        `, [user_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const stats = await pool.query(`
            SELECT
                (SELECT COUNT(*) FROM slangs    WHERE submitted_by = $1) AS total_slangs,
                (SELECT COUNT(*) FROM memes     WHERE submitted_by = $1) AS total_memes,
                (SELECT COUNT(*) FROM trends    WHERE submitted_by = $1) AS total_trends,
                (SELECT COUNT(*) FROM comments  WHERE user_id      = $1) AS total_comments,
                (SELECT COUNT(*) FROM bookmarks WHERE user_id      = $1) AS total_bookmarks
        `, [user_id]);

        res.status(200).json({
            user: result.rows[0],
            stats: stats.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching profile" });
    }
};

const updateMyProfile = async (req, res) => {
    const user_id = req.user.user_id;
    const { bio, avatar_url, location } = req.body;

    try {
        const result = await pool.query(`
            UPDATE users
            SET
                bio        = COALESCE($1, bio),
                avatar_url = COALESCE($2, avatar_url),
                location   = COALESCE($3, location)
            WHERE user_id = $4
            RETURNING user_id, username, email, bio, avatar_url, location, generation
        `, [bio, avatar_url, location, user_id]);

        res.status(200).json({
            message: "Profile updated successfully",
            user: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while updating profile" });
    }
};


module.exports = { getUserById, getMyProfile, updateMyProfile };