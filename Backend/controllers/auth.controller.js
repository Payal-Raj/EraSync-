const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    const { username, email, password, generation } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Username, email and password are required" });
        }

        const existingUser = await pool.query(
            "SELECT user_id FROM users WHERE username = $1 OR email = $2",
            [username, email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: "Username or email already in use" });
        }

        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash, generation)
             VALUES ($1, $2, $3, $4)
             RETURNING user_id, username, email, role, generation, created_at`,
            [username, email, password_hash, generation]
        );

        const newUser = result.rows[0];

        res.status(201).json({
            message: "User registered successfully",
            user: newUser
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error during registration" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
            { user_id: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role,
                generation: user.generation
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error during login" });
    }
};

const getMe = (req, res) => {
    res.status(200).json({ user: req.user });
};

module.exports = { register, login, getMe };