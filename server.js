const cors = require("cors");

const express = require('express');
const { Pool } = require("pg");
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080; // fallback to 8080
const HOST = '0.0.0.0';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// GET / : Root page. Redirect to login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// POST /register: Register a new user
app.post("/register", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username required" });

  try {
    // Check if user exists
    let result = await pool.query("SELECT * FROM users WHERE username=$1", [username]);
    let user;
    if (result.rows.length === 0) {
      // Insert new user
      result = await pool.query(
        "INSERT INTO users (username) VALUES ($1) RETURNING *",
        [username]
      );
      user = result.rows[0];
    } else {
      user = result.rows[0];
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/klotski/save", async (req, res) => {
  const { user_id, board, current_steps } = req.body;

  // Validate input
  if (!user_id) return res.status(400).json({ error: "user_id required"});
  if (!board) return res.status(400).json({ error: "board required"});
  if (typeof current_steps !== "number") return res.status(400).json({ error: "steps must be a number"});

  try{
    const result = await pool.query(
      `
      INSERT INTO klotski_game (user_id, board, current_steps)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id)
      DO UPDATE SET
        board = EXCLUDED.board,
        current_steps = EXCLUDED.current_steps,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `,
      [user_id, board, current_steps]
    );

    res.status(200).json({
      ok: true,
      game: result.rows[0],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/klotski/load", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "username required"});
  
  try{
    const user = await pool.query(
      "SELECT user_id FROM users WHERE username = $1",
      [username]
    );

    if (user.rows.length === 0) return res.status(404).json({ error: "User not found" });
    const user_id = user.rows[0].user_id;
    const savedResult = await pool.query(
      "SELECT board, current_steps FROM klotski_game WHERE user_id = $1",
      [user_id]
    );
    if (savedResult.rows.length === 0) return res.json({ exists: false, user_id});

    const save = savedResult.rows[0];
    return res.json({
      exists: true,
      user_id: user_id,
      board: save.board,
      current_steps: save.current_steps
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// simple health route
app.get('/health', (req, res) => res.send('ok'));

// Return 404 for all other requests
app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
