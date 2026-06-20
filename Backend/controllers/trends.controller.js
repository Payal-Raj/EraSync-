const pool = require("../db");

const getAllTrends = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                t.trend_id,
                t.name,
                t.description,
                t.origin_platform,
                t.generation,
                t.status,
                t.view_count,
                t.created_at,
                u.username AS submitted_by
            FROM trends t
            LEFT JOIN users u ON t.submitted_by = u.user_id
            ORDER BY t.created_at DESC
        `);

        res.status(200).json({
            count: result.rows.length,
            trends: result.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching trends" });
    }
};

const getTrendById = async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query(
            "UPDATE trends SET view_count = view_count + 1 WHERE trend_id = $1",
            [id]
        );

        const result = await pool.query(`
            SELECT
                t.trend_id,
                t.name,
                t.description,
                t.origin_platform,
                t.generation,
                t.status,
                t.view_count,
                t.created_at,
                u.username AS submitted_by
            FROM trends t
            LEFT JOIN users u ON t.submitted_by = u.user_id
            WHERE t.trend_id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Trend not found" });
        }

        res.status(200).json({ trend: result.rows[0] });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching trend" });
    }
};

const createTrend = async (req, res) => {
    const { name, description, origin_platform, generation, status } = req.body;
    const submitted_by = req.user.user_id;

    try {
        if (!name) {
            return res.status(400).json({ error: "Trend name is required" });
        }

        const result = await pool.query(`
            INSERT INTO trends (name, description, origin_platform, generation, status, submitted_by)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING trend_id, name, status, generation, created_at
        `, [name, description, origin_platform, generation, status || "rising", submitted_by]);

        res.status(201).json({
            message: "Trend created successfully",
            trend: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while creating trend" });
    }
};

const deleteTrend = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.user_id;

    try {
        const existing = await pool.query(
            "SELECT * FROM trends WHERE trend_id = $1",
            [id]
        );

        if (existing.rows.length === 0) {
            return res.status(404).json({ error: "Trend not found" });
        }

        if (existing.rows[0].submitted_by !== user_id) {
            return res.status(403).json({ error: "You can only delete your own trends" });
        }

        await pool.query("DELETE FROM trends WHERE trend_id = $1", [id]);

        res.status(200).json({ message: "Trend deleted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while deleting trend" });
    }
};


module.exports = { getAllTrends, getTrendById, createTrend, deleteTrend };