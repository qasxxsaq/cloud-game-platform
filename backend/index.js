const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080; // fallback to 8080
const HOST = '0.0.0.0';

app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/game', require('./routes/game'));

// simple health route
app.get('/health', (req, res) => res.send('ok'));

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
