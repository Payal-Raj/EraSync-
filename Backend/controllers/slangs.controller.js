const pool = require("../db");

const getAllSlangs = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                s.slang_id,
                s.word,
                s.pronunciation,
                s.meaning,
                s.origin,
                s.example_sentence,
                s.generation,
                s.view_count,
                s.created_at,
                u.username AS submitted_by
            FROM slangs s
            LEFT JOIN users u ON s.submitted_by = u.user_id
            ORDER BY s.created_at DESC
        `);

        res.status(200).json({
            count: result.rows.length,
            slangs: result.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching slangs" });
    }
};

const getSlangById = async (req, res) => {
    const { id } = req.params;

    try {
        // Increment view count first
        await pool.query(
            "UPDATE slangs SET view_count = view_count + 1 WHERE slang_id = $1",
            [id]
        );

        const result = await pool.query(`
            SELECT 
                s.slang_id,
                s.word,
                s.pronunciation,
                s.meaning,
                s.origin,
                s.example_sentence,
                s.generation,
                s.view_count,
                s.created_at,
                u.username AS submitted_by
            FROM slangs s
            LEFT JOIN users u ON s.submitted_by = u.user_id
            WHERE s.slang_id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Slang not found" });
        }

        res.status(200).json({ slang: result.rows[0] });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching slang" });
    }
};


const createSlang = async (req, res) => {
    const { word, pronunciation, meaning, origin, example_sentence, generation } = req.body;

    // req.user comes from verifyToken middleware
    const submitted_by = req.user.user_id;

    try {
        if (!word || !meaning) {
            return res.status(400).json({ error: "Word and meaning are required" });
        }

        const result = await pool.query(`
            INSERT INTO slangs (word, pronunciation, meaning, origin, example_sentence, generation, submitted_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING slang_id, word, meaning, generation, created_at
        `, [word, pronunciation, meaning, origin, example_sentence, generation, submitted_by]);

        res.status(201).json({
            message: "Slang created successfully",
            slang: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while creating slang" });
    }
};

const deleteSlang = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.user_id;

    try {
        // Check if slang exists and belongs to this user
        const existing = await pool.query(
            "SELECT * FROM slangs WHERE slang_id = $1",
            [id]
        );

        if (existing.rows.length === 0) {
            return res.status(404).json({ error: "Slang not found" });
        }

        if (existing.rows[0].submitted_by !== user_id) {
            return res.status(403).json({ error: "You can only delete your own slangs" });
        }

        await pool.query("DELETE FROM slangs WHERE slang_id = $1", [id]);

        res.status(200).json({ message: "Slang deleted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while deleting slang" });
    }
};


module.exports = { getAllSlangs, getSlangById, createSlang, deleteSlang };