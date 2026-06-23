const pool = require("../db");

const getBookmarks = async (req, res) => {
    const user_id = req.user.user_id;

    try {
        const result = await pool.query(`
            SELECT
                bookmark_id,
                content_type,
                content_id,
                created_at
            FROM bookmarks
            WHERE user_id = $1
            ORDER BY created_at DESC
        `, [user_id]);

        res.status(200).json({
            count: result.rows.length,
            bookmarks: result.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching bookmarks" });
    }
};

const addBookmark = async (req, res) => {
    const { content_type, content_id } = req.body;
    const user_id = req.user.user_id;

    const validTypes = ['slang', 'meme', 'trend'];
    if (!validTypes.includes(content_type)) {
        return res.status(400).json({ error: "content_type must be slang, meme or trend" });
    }

    if (!content_id) {
        return res.status(400).json({ error: "content_id is required" });
    }

    try {
        const existing = await pool.query(
            "SELECT * FROM bookmarks WHERE user_id = $1 AND content_type = $2 AND content_id = $3",
            [user_id, content_type, content_id]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({ error: "Already bookmarked" });
        }

        const result = await pool.query(`
            INSERT INTO bookmarks (user_id, content_type, content_id)
            VALUES ($1, $2, $3)
            RETURNING bookmark_id, content_type, content_id, created_at
        `, [user_id, content_type, content_id]);

        res.status(201).json({
            message: "Bookmarked successfully",
            bookmark: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while adding bookmark" });
    }
};

const removeBookmark = async (req, res) => {
    const { content_type, content_id } = req.params;
    const user_id = req.user.user_id;

    console.log("DELETE params:", content_type, content_id, "user:", user_id);

    try {
        const existing = await pool.query(
            "SELECT * FROM bookmarks WHERE user_id = $1 AND content_type = $2 AND content_id = $3",
            [user_id, content_type, content_id]
        );

        console.log("Found bookmark:", existing.rows);
        if (existing.rows.length === 0) {
            return res.status(404).json({ error: "Bookmark not found" });
        }

        await pool.query(
            "DELETE FROM bookmarks WHERE user_id = $1 AND content_type = $2 AND content_id = $3",
            [user_id, content_type, content_id]
        );

        res.status(200).json({ message: "Bookmark removed successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while removing bookmark" });
    }
};


module.exports = { getBookmarks, addBookmark, removeBookmark };