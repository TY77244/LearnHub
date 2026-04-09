/* ============================
   LEARNHUB - NODE.JS BACKEND SERVER
   ============================ */

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'your-secret-key-change-this-in-production';

// ============================
// MIDDLEWARE
// ============================

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Upload folder setup
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// ============================
// DATABASE SETUP
// ============================

const db = new sqlite3.Database('./learnhub.db', (err) => {
    if (err) console.error(err.message);
    else console.log('Connected to SQLite database');
});

// Initialize database tables
db.serialize(() => {
    // Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            study_goal TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Documents table
    db.run(`
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            filename TEXT NOT NULL,
            file_path TEXT NOT NULL,
            file_size INTEGER,
            upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            progress_percentage INTEGER DEFAULT 0,
            status TEXT DEFAULT 'uploaded',
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    // Progress tracking table
    db.run(`
        CREATE TABLE IF NOT EXISTS progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            document_id INTEGER,
            pages_read INTEGER DEFAULT 0,
            total_pages INTEGER,
            completion_percentage INTEGER DEFAULT 0,
            last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(document_id) REFERENCES documents(id) ON DELETE CASCADE
        )
    `);

    // Notes table
    db.run(`
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            document_id INTEGER,
            title TEXT,
            content TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(document_id) REFERENCES documents(id)
        )
    `);

    // Study preferences table
    db.run(`
        CREATE TABLE IF NOT EXISTS study_preferences (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            subject TEXT,
            learning_style TEXT,
            time_per_session INTEGER DEFAULT 30,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);
});

// ============================
// AUTHENTICATION MIDDLEWARE
// ============================

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
}

// ============================
// API ENDPOINTS - AUTHENTICATION
// ============================

// Register
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        function(err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.json({ message: 'User registered successfully', userId: this.lastID });
        }
    );
});

// Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, SECRET_KEY, {
            expiresIn: '24h'
        });

        res.json({
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                study_goal: user.study_goal
            }
        });
    });
});

// Get current user
app.get('/api/user', authenticateToken, (req, res) => {
    db.get('SELECT id, username, email, study_goal FROM users WHERE id = ?', [req.user.id], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(user);
    });
});

// Update study goal
app.put('/api/user/study-goal', authenticateToken, (req, res) => {
    const { study_goal } = req.body;
    
    db.run(
        'UPDATE users SET study_goal = ? WHERE id = ?',
        [study_goal, req.user.id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Study goal updated successfully' });
        }
    );
});

// ============================
// API ENDPOINTS - DOCUMENTS
// ============================

// Upload document
app.post('/api/documents/upload', authenticateToken, upload.single('document'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const { document_title } = req.body;
    const filename = document_title || req.file.originalname;

    db.run(
        'INSERT INTO documents (user_id, filename, file_path, file_size) VALUES (?, ?, ?, ?)',
        [req.user.id, filename, req.file.path, req.file.size],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Initialize progress tracking
            db.run(
                'INSERT INTO progress (user_id, document_id, total_pages) VALUES (?, ?, ?)',
                [req.user.id, this.lastID, 0],
                (err) => {
                    if (err) console.error(err);
                }
            );

            res.json({
                message: 'Document uploaded successfully',
                document: {
                    id: this.lastID,
                    filename: filename,
                    file_size: req.file.size,
                    upload_date: new Date()
                }
            });
        }
    );
});

// Get user's documents
app.get('/api/documents', authenticateToken, (req, res) => {
    db.all(
        'SELECT d.id, d.filename, d.file_size, d.upload_date, d.progress_percentage, p.completion_percentage FROM documents d LEFT JOIN progress p ON d.id = p.document_id WHERE d.user_id = ? ORDER BY d.upload_date DESC',
        [req.user.id],
        (err, documents) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(documents || []);
        }
    );
});

// Delete document
app.delete('/api/documents/:id', authenticateToken, (req, res) => {
    const documentId = req.params.id;

    db.get('SELECT file_path FROM documents WHERE id = ? AND user_id = ?', [documentId, req.user.id], (err, doc) => {
        if (err || !doc) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Delete file
        fs.unlink(doc.file_path, (err) => {
            if (err) console.error('Error deleting file:', err);
        });

        // Delete database entry
        db.run('DELETE FROM documents WHERE id = ?', [documentId], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Document deleted successfully' });
        });
    });
});

// ============================
// API ENDPOINTS - PROGRESS
// ============================

// Update progress
app.put('/api/progress/:documentId', authenticateToken, (req, res) => {
    const { pages_read, total_pages } = req.body;
    const documentId = req.params.documentId;

    const completion = total_pages > 0 ? Math.round((pages_read / total_pages) * 100) : 0;

    db.run(
        'UPDATE progress SET pages_read = ?, total_pages = ?, completion_percentage = ?, last_accessed = CURRENT_TIMESTAMP WHERE document_id = ? AND user_id = ?',
        [pages_read, total_pages, completion, documentId, req.user.id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });

            // Also update document's progress percentage
            db.run(
                'UPDATE documents SET progress_percentage = ? WHERE id = ?',
                [completion, documentId],
                (err) => {
                    if (err) console.error(err);
                }
            );

            res.json({ message: 'Progress updated', completion_percentage: completion });
        }
    );
});

// Get progress
app.get('/api/progress/:documentId', authenticateToken, (req, res) => {
    db.get(
        'SELECT * FROM progress WHERE document_id = ? AND user_id = ?',
        [req.params.documentId, req.user.id],
        (err, progress) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(progress || {});
        }
    );
});

// Get overall stats
app.get('/api/stats', authenticateToken, (req, res) => {
    db.get(
        `SELECT 
            COUNT(DISTINCT d.id) as total_documents,
            COUNT(DISTINCT n.id) as total_notes,
            AVG(p.completion_percentage) as avg_progress
         FROM documents d
         LEFT JOIN progress p ON d.id = p.document_id
         LEFT JOIN notes n ON d.user_id = n.user_id
         WHERE d.user_id = ?`,
        [req.user.id],
        (err, stats) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(stats || {});
        }
    );
});

// ============================
// API ENDPOINTS - STUDY PREFERENCES
// ============================

// Set study preferences
app.post('/api/study-preferences', authenticateToken, (req, res) => {
    const { subject, learning_style, time_per_session } = req.body;

    db.run(
        'INSERT INTO study_preferences (user_id, subject, learning_style, time_per_session) VALUES (?, ?, ?, ?)',
        [req.user.id, subject, learning_style, time_per_session],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Study preferences saved', id: this.lastID });
        }
    );
});

// Get study preferences
app.get('/api/study-preferences', authenticateToken, (req, res) => {
    db.all(
        'SELECT * FROM study_preferences WHERE user_id = ? ORDER BY created_at DESC',
        [req.user.id],
        (err, prefs) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(prefs || []);
        }
    );
});

// ============================
// SERVER START
// ============================

app.listen(PORT, () => {
    console.log(`LearnHub server running on http://localhost:${PORT}`);
});
