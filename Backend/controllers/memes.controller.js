const pool = require("../db");

const getAllMemes = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                m.meme_id,
                m.title,
                m.image_url,
                m.context,
                m.generation,
                m.view_count,
                m.created_at,
                u.username AS submitted_by
            FROM memes m
            LEFT JOIN users u ON m.submitted_by = u.user_id
            ORDER BY m.created_at DESC
        `);

        res.status(200).json({
            count: result.rows.length,
            memes: result.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching memes" });
    }
};

const getMemeById = async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query(
            "UPDATE memes SET view_count = view_count + 1 WHERE meme_id = $1",
            [id]
        );

        const result = await pool.query(`
            SELECT
                m.meme_id,
                m.title,
                m.image_url,
                m.context,
                m.generation,
                m.view_count,
                m.created_at,
                u.username AS submitted_by
            FROM memes m
            LEFT JOIN users u ON m.submitted_by = u.user_id
            WHERE m.meme_id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Meme not found" });
        }

        res.status(200).json({ meme: result.rows[0] });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching meme" });
    }
};

const createMeme = async (req, res) => {
    const { title, image_url, context, generation } = req.body;
    const submitted_by = req.user.user_id;

    try {
        if (!title || !image_url) {
            return res.status(400).json({ error: "Title and image URL are required" });
        }

        const result = await pool.query(`
            INSERT INTO memes (title, image_url, context, generation, submitted_by)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING meme_id, title, image_url, generation, created_at
        `, [title, image_url, context, generation, submitted_by]);

        res.status(201).json({
            message: "Meme created successfully",
            meme: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while creating meme" });
    }
};

const deleteMeme = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.user_id;

    try {
        const existing = await pool.query(
            "SELECT * FROM memes WHERE meme_id = $1",
            [id]
        );

        if (existing.rows.length === 0) {
            return res.status(404).json({ error: "Meme not found" });
        }

        if (existing.rows[0].submitted_by !== user_id) {
            return res.status(403).json({ error: "You can only delete your own memes" });
        }

        await pool.query("DELETE FROM memes WHERE meme_id = $1", [id]);

        res.status(200).json({ message: "Meme deleted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while deleting meme" });
    }
};


module.exports = { getAllMemes, getMemeById, createMeme, deleteMeme };