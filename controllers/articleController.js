const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./test.db');

exports.getAllArticles = async (req, res) => {
  try {
    db.all(`SELECT * FROM articles`, (err, rows) => {
      if (err) {
        res.status(500).json({ message: 'Server error', error: err });
      } else {
        res.json(rows);
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Create a new article
exports.createArticle = async (req, res) => {
  const { title, content } = req.body;
  try {
    db.run(`INSERT INTO articles (title, content, author_id) VALUES (?, ?, ?)`, [title, content, req.user.id], (err) => {
      if (err) {
        res.status(500).json({ message: 'Server error', error: err });
      } else {
        db.get(`SELECT * FROM articles WHERE id = (SELECT last_insert_rowid())`, (err, row) => {
          if (err) {
            res.status(500).json({ message: 'Server error', error: err });
          } else {
            res.status(201).json(row);
          }
        });
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
