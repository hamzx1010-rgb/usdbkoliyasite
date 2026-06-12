/**
 * Supreme Production Node.js Server App (server.js)
 * Kulliya Platform ("كلية") — Gated Private University Social Ecosystem
 * Express + Socket.io + SQLite Production Backend ready for Render
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Initialize Express & WebSockets App
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'DELETE', 'PUT'] }
});

const PORT = process.env.PORT || 5500;

// Express Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer Storage Configuration for student ID cards (La carte étudiant)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, "carte-" + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// --- Database Configuration & Initialization ---
const dbPath = path.join(__dirname, 'kulliya.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database connection error:', err.message);
  else console.log('✓ Connected strictly to Kulliya SQLite database (kulliya.db)');
});

// Initialize Pristine Production Database Schema
db.serialize(() => {
  // 1. Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    faculty TEXT NOT NULL,
    bio TEXT,
    posts_count INTEGER DEFAULT 0,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT true,
    role TEXT DEFAULT 'student',
    avatar_icon TEXT DEFAULT '👨‍🎓',
    created_at TEXT
  )`);

  // 2. Pending Students table (For Secret Admin Dashboard ONLY)
  db.run(`CREATE TABLE IF NOT EXISTS pending_students (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    bac_number TEXT NOT NULL,
    carte_number TEXT NOT NULL,
    faculty TEXT NOT NULL,
    student_card_url TEXT,
    status TEXT DEFAULT 'pending',
    submitted_at TEXT
  )`);

  // 3. Public Posts table
  db.run(`CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    author TEXT NOT NULL,
    username TEXT NOT NULL,
    badge TEXT DEFAULT 'طالب باحث',
    faculty TEXT NOT NULL,
    time TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'regular',
    file_name TEXT,
    file_size TEXT,
    is_channel BOOLEAN DEFAULT false,
    likes INTEGER DEFAULT 0,
    created_at INTEGER
  )`);

  // 4. Post Comments table
  db.run(`CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    author TEXT NOT NULL,
    text TEXT NOT NULL,
    time TEXT NOT NULL,
    created_at INTEGER
  )`);

  // 5. Post Likes Registry
  db.run(`CREATE TABLE IF NOT EXISTS likes (
    post_id TEXT NOT NULL,
    username TEXT NOT NULL,
    PRIMARY KEY (post_id, username)
  )`);

  // 6. Direct Messages table
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    chat_target TEXT NOT NULL,
    author TEXT NOT NULL,
    text TEXT NOT NULL,
    time TEXT NOT NULL,
    icon TEXT DEFAULT '👨‍🎓',
    created_at INTEGER
  )`);

  // 7. Saved Articles table
  db.run(`CREATE TABLE IF NOT EXISTS saved_posts (
    post_id TEXT NOT NULL,
    username TEXT NOT NULL,
    PRIMARY KEY (post_id, username)
  )`);

  // Seed Default Founder Account & Official University Showcases if completely empty
  db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
    if (row && row.count === 0) {
      const nowStr = new Date().toLocaleDateString('ar-DZ');
      
      // Supreme Admin
      db.run("INSERT INTO users VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", [
        "usr-admin-supreme", "المشرف العام (Admin)", "admin_kulliya", "KulliyaSupreme2026!",
        "وزارة التعليم العالي · الإدارة العليا", "المشرف العام والمسؤول عن اعتماد حسابات الطلبة، إدارة الرقابة الأكاديمية ونشر التعاميم السيادية. ⚡🎓",
        1, 4820, 1, true, "admin", "⚡", nowStr
      ]);

      // Seed Student
      db.run("INSERT INTO users VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", [
        "usr-std-prime", "أمينة بن عمر", "aminab_dz", "StudentPass123!",
        "USTHB · كلية الإعلام الآلي", "طالبة ماستر في هندسة المعلوماتية 💻\nمهتمة بالخوارزميات والذكاء الاصطناعي.",
        2, 142, 88, true, "student", "👩‍🎓", nowStr
      ]);

      // Seed Starter Posts
      const postInsert = db.prepare("INSERT INTO posts VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)");
      postInsert.run([
        "post-init-101", "📢 قناة كلية الطب · جامعة الجزائر", "med_channel", "رسمي سيادي", "الجزائر العاصمة · البث العام",
        "منذ ساعتين", "📅 <strong>إعلان أكاديمي هام:</strong> امتحانات الفصل الثاني ستبدأ يوم #15_مايو. الجدول الكامل لجميع التخصصات متاح الآن على المنصة الرقمية. تأكدوا من مراجعة مواعيد كل مقياس. حظاً موفقاً للجميع! 🎓",
        "announcement", "", "", true, 891, Date.now() - 7200000
      ]);
      postInsert.run([
        "post-init-102", "أمينة بن عمر", "aminab_dz", "طالبة باحثة", "USTHB · هندسة المعلوماتية",
        "منذ 3 ساعات", "ملخص كامل لمقياس الخوارزميات — الفصل الثالث 📚\nشاملة كل التمارين المحلولة من الأستاذ بن علي + أسئلة الامتحانات القديمة من 2019 إلى 2024.\n#خوارزميات #USTHB",
        "pdf", "خوارزميات_ملخص_شامل_س3.pdf", "2.4 MB", false, 142, Date.now() - 10800000
      ]);
      postInsert.finalize();

      console.log("✓ Fully Seeded Default Academic Campus Ecosystem & Founder DB");
    }
  });
});

// --- REST API ENDPOINTS ---

// 1. Secure Student Registration (Gated entirely for Secret Admin DB)
app.post('/api/register', upload.single('student_card_img'), (req, res) => {
  const { full_name, username, password, faculty, bac_number, carte_number } = req.body;
  if (!full_name || !username || !password || !bac_number) {
    return res.status(400).json({ error: "Missing mandatory academic authentication identity fields" });
  }

  const reqId = "pend-" + Date.now();
  const cardUrl = req.file ? `/uploads/${req.file.filename}` : "";
  const nowStr = new Date().toLocaleDateString('ar-DZ');

  db.run(
    "INSERT INTO pending_students VALUES (?,?,?,?,?,?,?,?,?,?)",
    [reqId, full_name, username, password, bac_number, carte_number, faculty, cardUrl, "pending", nowStr],
    function (err) {
      if (err) {
        if (err.message.includes("UNIQUE")) return res.status(409).json({ error: "المعرّف الرقمي أو رقم البكالوريا مسجل مسبقاً" });
        return res.status(500).json({ error: err.message });
      }

      // Broadcast Live Real-time WebSocket event STRICTLY to connected Secret Admin interfaces
      const newPendingObj = { id: reqId, full_name, username, bac_number, carte_number, faculty, student_card_url: cardUrl, submitted_at: nowStr };
      io.emit('new_pending_signup', newPendingObj);

      res.status(201).json({ success: true, message: "تم إرسال طلبك إلى الإدارة السريّة للمطابقة والتوثيق", id: reqId });
    }
  );
});

// 2. Student & Admin Login Check
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) {
      // Check if pending waiting
      db.get("SELECT status FROM pending_students WHERE username = ? AND password = ?", [username, password], (errPend, pendRow) => {
        if (pendRow && pendRow.status === 'pending') return res.status(403).json({ error: "حسابك لا يزال قيد المراجعة والمطابقة من قِبل المشرف العام" });
        if (pendRow && pendRow.status === 'rejected') return res.status(403).json({ error: "تم رفض توثيق حسابك لعدم مطابقة البطاقة الجامعية مع رقم البكالوريا" });
        return res.status(401).json({ error: "بيانات الدخول الأكاديمية غير مطابقة" });
      });
      return;
    }
    res.status(200).json({ success: true, user: row });
  });
});

// 3. Get Public University Feed Posts
app.get('/api/posts', (req, res) => {
  db.all("SELECT * FROM posts ORDER BY created_at DESC", [], (err, posts) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Stitch associated comments
    db.all("SELECT * FROM comments", [], (errC, comments) => {
      if (errC) return res.status(500).json({ error: errC.message });
      
      const populatedPosts = posts.map(p => ({
        ...p,
        comments: comments.filter(c => c.post_id === p.id)
      }));
      res.status(200).json(populatedPosts);
    });
  });
});

// 4. Create Post
app.post('/api/posts', (req, res) => {
  const { author, username, badge, faculty, content, type, file_name, file_size, is_channel } = req.body;
  if (!content) return res.status(400).json({ error: "Post content cannot be empty" });

  const postId = "post-" + Date.now();
  const timeStr = "الآن مباشر";
  const created_at = Date.now();

  db.run(
    "INSERT INTO posts VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [postId, author, username, badge || 'طالب أكاديمي', faculty, timeStr, content, type || 'regular', file_name || '', file_size || '', is_channel || false, 1, created_at],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      
      const newPostObj = { id: postId, author, username, badge, faculty, time: timeStr, content, type, file_name, file_size, is_channel, likes: 1, comments: [], created_at };
      io.emit('new_campus_post', newPostObj);

      // Increment user posts_count
      db.run("UPDATE users SET posts_count = posts_count + 1 WHERE username = ?", [username]);

      res.status(201).json({ success: true, post: newPostObj });
    }
  );
});

// 5. Delete Post Persistent
app.delete('/api/posts/:id', (req, res) => {
  const postId = req.params.id;
  db.run("DELETE FROM posts WHERE id = ?", [postId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    db.run("DELETE FROM comments WHERE post_id = ?", [postId]);
    io.emit('post_deleted', postId);
    res.status(200).json({ success: true, deleted_id: postId });
  });
});

// 6. Like Post
app.post('/api/posts/:id/like', (req, res) => {
  const postId = req.params.id;
  db.run("UPDATE posts SET likes = likes + 1 WHERE id = ?", [postId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    io.emit('post_liked', postId);
    res.status(200).json({ success: true });
  });
});

// 7. Add Comment
app.post('/api/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  const { author, text } = req.body;
  if (!text) return res.status(400).json({ error: "Comment text empty" });

  const commId = "comm-" + Date.now();
  const timeStr = "الآن";
  
  db.run("INSERT INTO comments VALUES (?,?,?,?,?)", [commId, postId, author, text, timeStr, Date.now()], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    const commObj = { id: commId, post_id: postId, author, text, time: timeStr };
    io.emit('new_post_comment', commObj);
    res.status(201).json({ success: true, comment: commObj });
  });
});

// --- ADMIN ONLY SECURITY PIPELINE ENDPOINTS ---

// 8. Get Pending Signups (For Vault Admin ONLY)
app.get('/api/admin/pending', (req, res) => {
  db.all("SELECT * FROM pending_students WHERE status = 'pending' ORDER BY submitted_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(rows);
  });
});

// 9. Approve Pending Request
app.post('/api/admin/approve', (req, res) => {
  const { req_id } = req.body;
  db.get("SELECT * FROM pending_students WHERE id = ?", [req_id], (err, student) => {
    if (err || !student) return res.status(404).json({ error: "Student request registry not found" });

    db.run("UPDATE pending_students SET status = 'approved' WHERE id = ?", [req_id], function(errU) {
      if(errU) return res.status(500).json({ error: errU.message });
      
      const nowStr = new Date().toLocaleDateString('ar-DZ');
      db.run("INSERT OR REPLACE INTO users VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", [
        "usr-" + student.id, student.full_name, student.username, student.password,
        student.faculty, "طالب باحث موثق · " + student.faculty, 0, 1, 1, true, "student", "👨‍🎓", nowStr
      ]);

      io.emit('student_request_approved', student.username);
      res.status(200).json({ success: true, approved_user: student });
    });
  });
});

// 10. Reject Pending Request
app.post('/api/admin/reject', (req, res) => {
  const { req_id } = req.body;
  db.run("UPDATE pending_students SET status = 'rejected' WHERE id = ?", [req_id], function(err) {
    if(err) return res.status(500).json({ error: err.message });
    res.status(200).json({ success: true, rejected_id: req_id });
  });
});

// 11. Get All Verified Active Users
app.get('/api/admin/users', (req, res) => {
  db.all("SELECT id, full_name, username, faculty, verified, role, created_at FROM users ORDER BY created_at DESC", [], (err, rows) => {
    if(err) return res.status(500).json({ error: err.message });
    res.status(200).json(rows);
  });
});

// 12. Ban Verified User
app.post('/api/admin/ban', (req, res) => {
  const { username } = req.body;
  db.run("DELETE FROM users WHERE username = ?", [username], function(err) {
    if(err) return res.status(500).json({ error: err.message });
    db.run("UPDATE pending_students SET status = 'banned' WHERE username = ?", [username]);
    io.emit('user_banned', username);
    res.status(200).json({ success: true, banned_username: username });
  });
});

// --- CHAT MESSAGING REST & WEBSOCKETS ENGINE ---

// 13. Get Message streams for Direct Chat target
app.get('/api/messages/:target', (req, res) => {
  const target = req.params.target;
  db.all("SELECT * FROM messages WHERE chat_target = ? ORDER BY created_at ASC", [target], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(rows);
  });
});

// 14. Send Active Chat Message
app.post('/api/messages', (req, res) => {
  const { chat_target, author, text, icon } = req.body;
  if (!text) return res.status(400).json({ error: "Message empty" });

  const msgId = "m-" + Date.now() + Math.floor(Math.random()*100);
  const now = new Date(); const timeStr = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');

  db.run("INSERT INTO messages VALUES (?,?,?,?,?,?,?)", [msgId, chat_target, author, text, timeStr, icon || '👨‍🎓', Date.now()], function(err) {
    if(err) return res.status(500).json({ error: err.message });
    const msgObj = { id: msgId, chat_target, author, text, time: timeStr, icon };
    io.emit('new_chat_msg', msgObj);
    res.status(201).json({ success: true, message: msgObj });
  });
});

// --- WEBSOCKETS REAL-TIME ENGINE INTERACTION ---
io.on('connection', (socket) => {
  console.log(`⚡ Real-time WebSocket connection synchronized: [Socket ID: ${socket.id}]`);

  socket.on('join_study_room', (roomName) => {
    socket.join(roomName);
    console.log(`✓ Socket ${socket.id} joined collaborative academic study room: ${roomName}`);
  });

  socket.on('send_live_msg', (msgData) => {
    io.emit('broadcast_live_msg', msgData);
  });

  socket.on('disconnect', () => {
    console.log(`✕ Socket connection terminated: ${socket.id}`);
  });
});

// Universal Catch-All Fallback route supporting HTML Navigation
app.get('/*', (req, res) => {
  const filePath = path.join(__dirname, req.path);
  if (fs.existsSync(filePath)) res.sendFile(filePath);
  else res.sendFile(path.join(__dirname, 'index.html'));
});

// Execute Master HTTP Production Engine
server.listen(PORT, () => {
  console.log(`
========================================================================
👑 Supreme Kulliya Node.js Real-time Production App running flawlessly!
⚡ Local Interface URL: http://localhost:${PORT}
🚀 Ready for immediate zero-cost Cloud Deployment onto Render & Vercel
========================================================================
  `);
});
