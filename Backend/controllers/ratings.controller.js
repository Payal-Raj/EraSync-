const pool = require("../db");

const getRatings = async (req, res) => {
    const { slang_id } = req.params;

    try {
        const result = await pool.query(`
            SELECT
                COUNT(*)                    AS total_ratings,
                ROUND(AVG(rating), 1)       AS average_rating
            FROM slang_ratings
            WHERE slang_id = $1
        `, [slang_id]);

        res.status(200).json({
            slang_id,
            total_ratings:  parseInt(result.rows[0].total_ratings),
            average_rating: parseFloat(result.rows[0].average_rating) || 0
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching ratings" });
    }
};

const addRating = async (req, res) => {
    const { slang_id, rating } = req.body;
    const user_id = req.user.user_id;

    if (!slang_id || !rating) {
        return res.status(400).json({ error: "slang_id and rating are required" });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    try {
        const result = await pool.query(`
            INSERT INTO slang_ratings (slang_id, user_id, rating)
            VALUES ($1, $2, $3)
            ON CONFLICT (slang_id, user_id)
            DO UPDATE SET rating = $3
            RETURNING rating_id, slang_id, rating, created_at
        `, [slang_id, user_id, rating]);

        res.status(201).json({
            message: "Rating submitted successfully",
            rating: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while submitting rating" });
    }
};


module.exports = { getRatings, addRating };