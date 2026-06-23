const pool = require("../db");

const getComments = async (req, res) => {
    const { content_type, content_id } = req.params;

    const validTypes = ['slang', 'meme', 'trend'];
    if (!validTypes.includes(content_type)) {
        return res.status(400).json({ error: "content_type must be slang, meme or trend" });
    }

    try {
        const result = await pool.query(`
            SELECT
                c.comment_id,
                c.body,
                c.parent_comment_id,
                c.is_deleted,
                c.created_at,
                u.username AS commented_by
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.user_id
            WHERE c.content_type = $1
              AND c.content_id   = $2
              AND c.is_deleted   = false
            ORDER BY c.created_at ASC
        `, [content_type, content_id]);

        res.status(200).json({
            count: result.rows.length,
            comments: result.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching comments" });
    }
};

const createComment = async (req, res) => {
    const { content_type, content_id, body, parent_comment_id } = req.body;
    const user_id = req.user.user_id;

    const validTypes = ['slang', 'meme', 'trend'];
    if (!validTypes.includes(content_type)) {
        return res.status(400).json({ error: "content_type must be slang, meme or trend" });
    }

    if (!body || body.trim() === '') {
        return res.status(400).json({ error: "Comment body cannot be empty" });
    }

    try {
        const result = await pool.query(`
            INSERT INTO comments (user_id, content_type, content_id, body, parent_comment_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING comment_id, body, content_type, content_id, parent_comment_id, created_at
        `, [user_id, content_type, content_id, body.trim(), parent_comment_id || null]);

        res.status(201).json({
            message: "Comment added successfully",
            comment: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while adding comment" });
    }
};


const deleteComment = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.user_id;

    try {
        const existing = await pool.query(
            "SELECT * FROM comments WHERE comment_id = $1",
            [id]
        );

        if (existing.rows.length === 0) {
            return res.status(404).json({ error: "Comment not found" });
        }

        if (existing.rows[0].user_id !== user_id) {
            return res.status(403).json({ error: "You can only delete your own comments" });
        }

        await pool.query(
            "UPDATE comments SET is_deleted = true WHERE comment_id = $1",
            [id]
        );

        res.status(200).json({ message: "Comment deleted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while deleting comment" });
    }
};


module.exports = { getComments, createComment, deleteComment };