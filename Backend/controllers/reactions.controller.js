const pool = require("../db");

const getReactions = async (req, res) => {
    const { meme_id } = req.params;

    try {
        const result = await pool.query(`
            SELECT
                reaction_type,
                COUNT(*) AS count
            FROM meme_reactions
            WHERE meme_id = $1
            GROUP BY reaction_type
        `, [meme_id]);

        const summary = { fire: 0, skull: 0, crying: 0 };
        result.rows.forEach(row => {
            summary[row.reaction_type] = parseInt(row.count);
        });

        res.status(200).json({ meme_id, reactions: summary });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching reactions" });
    }
};

const addReaction = async (req, res) => {
    const { meme_id, reaction_type } = req.body;
    const user_id = req.user.user_id;

    const validReactions = ['fire', 'skull', 'crying'];
    if (!validReactions.includes(reaction_type)) {
        return res.status(400).json({ error: "reaction_type must be fire, skull or crying" });
    }

    if (!meme_id) {
        return res.status(400).json({ error: "meme_id is required" });
    }

    try {
        const result = await pool.query(`
            INSERT INTO meme_reactions (meme_id, user_id, reaction_type)
            VALUES ($1, $2, $3)
            ON CONFLICT (meme_id, user_id)
            DO UPDATE SET reaction_type = $3
            RETURNING reaction_id, meme_id, reaction_type, created_at
        `, [meme_id, user_id, reaction_type]);

        res.status(201).json({
            message: "Reaction added successfully",
            reaction: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while adding reaction" });
    }
};

const removeReaction = async (req, res) => {
    const { meme_id } = req.params;
    const user_id = req.user.user_id;

    try {
        const existing = await pool.query(
            "SELECT * FROM meme_reactions WHERE meme_id = $1 AND user_id = $2",
            [meme_id, user_id]
        );

        if (existing.rows.length === 0) {
            return res.status(404).json({ error: "You have not reacted to this meme" });
        }

        await pool.query(
            "DELETE FROM meme_reactions WHERE meme_id = $1 AND user_id = $2",
            [meme_id, user_id]
        );

        res.status(200).json({ message: "Reaction removed successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while removing reaction" });
    }
};


module.exports = { getReactions, addReaction, removeReaction };