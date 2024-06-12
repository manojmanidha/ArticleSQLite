const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();

const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);

// Connect to db
const db = new sqlite3.Database("./test.db", sqlite3.OPEN_READWRITE, (err) => {if (err) return console.error(err.message);});

// creating article and user table

const article_table = 
`CREATE TABLE articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id)
)`

const user_table=
`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('user', 'admin')) DEFAULT 'user'
)`


// Check if users table exists
db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='users'`, (err, row) => {
  if (err) {
    console.error(err);
  } else if (!row) {
    // Create users table if it doesn't exist
    db.run(user_table, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
});

// Check if articles table exists
db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='articles'`, (err, row) => {
  if (err) {
    console.error(err);
  } else if (!row) {
    // Create articles table if it doesn't exist
    db.run(article_table, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
});

//running the server on port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
