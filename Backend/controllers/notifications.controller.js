const pool = require("../db");

const getNotifications = async (req, res) => {
    const user_id = req.user.user_id;

    try {
        const result = await pool.query(`
            SELECT
                n.notification_id,
                n.type,
                n.content_type,
                n.content_id,
                n.created_at,
                u.username AS actor_username
            FROM notifications n
            LEFT JOIN users u ON n.actor_id = u.user_id
            WHERE n.user_id = $1
            ORDER BY n.created_at DESC
        `, [user_id]);

        res.status(200).json({
            count: result.rows.length,
            notifications: result.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching notifications" });
    }
};

const deleteNotification = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.user_id;

    try {
        const existing = await pool.query(
            "SELECT * FROM notifications WHERE notification_id = $1",
            [id]
        );

        if (existing.rows.length === 0) {
            return res.status(404).json({ error: "Notification not found" });
        }

        if (existing.rows[0].user_id !== user_id) {
            return res.status(403).json({ error: "You can only delete your own notifications" });
        }

        await pool.query(
            "DELETE FROM notifications WHERE notification_id = $1",
            [id]
        );

        res.status(200).json({ message: "Notification deleted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while deleting notification" });
    }
};


module.exports = { getNotifications, deleteNotification };