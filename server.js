const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080; // fallback to 8080
const HOST = '0.0.0.0';

app.use(express.json());

app.use(express.static(path.join(__dirname, 'frontend')));

// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/game', require('./routes/game'));

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

// simple health route
app.get('/health', (req, res) => res.send('ok'));

// Return 404 for all other requests
app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
