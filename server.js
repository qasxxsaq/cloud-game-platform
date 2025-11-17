const cors = require("cors");
const bcrypt = require("bcrypt");
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
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "Username already taken." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING user_id, username, created_at",
      [username, hashedPassword]
    );

    const newUser = result.rows[0];
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error: register" });
  }
});

// POST /login: Login a user. Query database to check the credentials. 
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if user exists
    const userResult = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const user = userResult.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    // Optionally update last_login
    await pool.query(
      "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1",
      [user.user_id]
    );

    // Respond with user info (without password)
    res.json({
      message: "Login successful",
      user: { user_id: user.user_id, username: user.username },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error: login" });
  }
});

// POST /api/klotski/save: Save the players current Klotski game state
app.post("/api/klotski/save", async (req, res) => {
  const { user_id, board, current_steps } = req.body;

  // Check if input valid
  if (!user_id) return res.status(400).json({ error: "user_id required"});
  if (!board) return res.status(400).json({ error: "board required"});
  if (typeof current_steps !== "number") return res.status(400).json({ error: "steps must be a number"});

  try{
    // Insert or update the saved game
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

    // Return success and saved game data
    res.status(200).json({
      ok: true,
      game: result.rows[0],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Klotski save error" });
  }
});

// POST /api/klotski/load: Load saved klotski game state given username
app.post("/api/klotski/load", async (req, res) => {
  const { username } = req.body;
  // Check if input valid
  if (!username) return res.status(400).json({ error: "username required"});
  
  try{
    // Find user_id from username
    const user = await pool.query(
      "SELECT user_id FROM users WHERE username = $1",
      [username]
    );

    // If user does not exist in DB
    if (user.rows.length === 0) return res.status(404).json({ error: "User not found" });
    
    const user_id = user.rows[0].user_id;
    // Load saved game
    const savedResult = await pool.query(
      "SELECT board, current_steps FROM klotski_game WHERE user_id = $1",
      [user_id]
    );
    // User exists but no saved data
    if (savedResult.rows.length === 0) return res.json({ exists: false, user_id});

    // User exists and have saved data, return data
    const save = savedResult.rows[0];
    return res.json({
      exists: true,
      user_id: user_id,
      board: save.board,
      current_steps: save.current_steps
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Klotski save error" });
  }
});

// GET /api/klotski/leaderboard: Retrieve top 10 user from leaderboard
app.get("/api/klotski/leaderboard", async (req, res) =>{
  try{
    const result = await pool.query(
      `
      SELECT 
        u.username,
        l.best_steps,
        l.created_at
      FROM klotski_leaderboard l
      JOIN users u ON u.user_id = l.user_id
      ORDER BY l.best_steps ASC
      LIMIT 10;
      `
    );
    res.json(result.rows);
  } catch(err) {
    res.status(500).json({ error: "Leaderboard error" });
  }
});

// POST /api/klotski/leaderboard/save: Update leaderboard with new best score
app.post("/api/klotski/leaderboard/save", async (req, res) => {
  const { user_id, best_steps } = req.body;
  // Check if input valid
  if (!user_id || typeof best_steps !== "number") {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    // Insert new record with better best_steps
    const result = await pool.query(
      `INSERT INTO klotski_leaderboard (user_id, best_steps)
       VALUES ($1, $2)
       ON CONFLICT (user_id)
       DO UPDATE SET
         best_steps = LEAST(klotski_leaderboard.best_steps, EXCLUDED.best_steps),
         created_at = CASE 
             WHEN EXCLUDED.best_steps < klotski_leaderboard.best_steps 
             THEN CURRENT_TIMESTAMP 
             ELSE klotski_leaderboard.created_at 
         END
       RETURNING *;`,
      [user_id, best_steps]
    );

    // return updated leaderboard
    res.json({
      updated: true,
      data: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({ error: "Leaderboard save error"})
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
