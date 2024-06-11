const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./test.db');

// Register User
exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
      if (err || user) {
        res.status(400).json({ message: 'Username already exists' });
      } else {
        db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`, [username, password, role], (err) => {
          if (err) {
            res.status(400).json({ message: 'Error registering user', error: err });
          } else {
            res.status(201).json({ message: 'User registered successfully' });
          }
        });
      }
    });
  } catch (err) {
    res.status(400).json({ message: 'Error registering user', error: err });
  }
};

// Login User
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
      if (err || !user) {
        res.status(404).json({ message: 'User not found' });
      } else {
        const isMatch = password===user.password
        if (!isMatch) {
          res.status(400).json({ message: 'Invalid credentials' });
        } else {
          const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
          res.json({ token });
        }
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
