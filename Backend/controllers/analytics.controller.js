const pool = require("../db");

const getOverview = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                (SELECT COUNT(*) FROM users)    AS total_users,
                (SELECT COUNT(*) FROM slangs)   AS total_slangs,
                (SELECT COUNT(*) FROM memes)    AS total_memes,
                (SELECT COUNT(*) FROM trends)   AS total_trends,
                (SELECT COUNT(*) FROM comments) AS total_comments,
                (SELECT COUNT(*) FROM meme_reactions) AS total_reactions
        `);

        res.status(200).json({ overview: result.rows[0] });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching analytics" });
    }
};

const getGenerationStats = async (req, res) => {
    try {
        const slangs = await pool.query(`
            SELECT generation, COUNT(*) AS count
            FROM slangs
            WHERE generation IS NOT NULL
            GROUP BY generation
        `);

        const memes = await pool.query(`
            SELECT generation, COUNT(*) AS count
            FROM memes
            WHERE generation IS NOT NULL
            GROUP BY generation
        `);

        const trends = await pool.query(`
            SELECT generation, COUNT(*) AS count
            FROM trends
            WHERE generation IS NOT NULL
            GROUP BY generation
        `);

        res.status(200).json({
            slangs_by_generation: slangs.rows,
            memes_by_generation:  memes.rows,
            trends_by_generation: trends.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching generation stats" });
    }
};

const getTopContent = async (req, res) => {
    try {
        const topSlangs = await pool.query(`
            SELECT slang_id, word, generation, view_count
            FROM slangs
            ORDER BY view_count DESC
            LIMIT 5
        `);

        const topMemes = await pool.query(`
            SELECT meme_id, title, generation, view_count
            FROM memes
            ORDER BY view_count DESC
            LIMIT 5
        `);

        const topTrends = await pool.query(`
            SELECT trend_id, name, generation, status, view_count
            FROM trends
            ORDER BY view_count DESC
            LIMIT 5
        `);

        res.status(200).json({
            top_slangs: topSlangs.rows,
            top_memes:  topMemes.rows,
            top_trends: topTrends.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching top content" });
    }
};


module.exports = { getOverview, getGenerationStats, getTopContent };