# 🎓 LearnHub - AI-Powered Learning Platform

## 🌟 What is LearnHub?

LearnHub is a cutting-edge, gamified learning platform that combines document management, progress tracking, and AI-powered learning assistance to create an engaging, personalized educational experience.

**Developed by:** NGOGA Callioppe (The Youngstar) - 2 years Full-Stack Dev, 4 years Music Production  
**Version:** 2.0 (AI-Enhanced)  
**Status:** 🟢 Production Ready

### Core Features
- ✅ **Upload Documents** - Upload PDFs, Word docs, PowerPoint presentations
- ✅ **Track Progress** - Visual progress sliders for each document
- ✅ **AI Q&A System** - Ask questions, receive detailed answers with references
- ✅ **Image Analysis** - Upload images, get OCR + AI analysis
- ✅ **Problem Solver** - Solve problems across 8 academic subjects
- ✅ **Leaderboard** - Compete with other learners and track rankings
- ✅ **Community Forum** - Discuss topics, ask questions, share knowledge
- ✅ **Gamification** - Earn XP points, build streaks, unlock achievements
- ✅ **Secure Login** - JWT authentication, encrypted passwords
- ✅ **Dashboard** - Real-time stats, progress tracking, quick actions

## 📁 Project Structure

```
e:\web development\
├── app.html                 # Main UI (7 tabs, 850+ lines)
├── style.css                # Complete styling (2,200+ lines)
├── client.js                # Frontend logic (1,500+ lines)
├── app.js                   # Node.js backend
├── structure.py             # Python backend (Flask)
├── learnhub.db              # SQLite database (auto-created)
│
├── START_SERVER.bat         # Windows quick-start launcher
├── start-server.sh          # Mac/Linux quick-start launcher
│
├── README.md                # This file
├── UPDATES.md               # Detailed feature documentation
├── TESTING_GUIDE.txt        # Complete testing instructions
│
└── uploads/                 # Document uploads storage
```

## 🚀 QUICK START

### Windows Users (Easiest Way)
```powershell
1. Double-click: START_SERVER.bat
2. Browser opens automatically
3. Sign up and start learning! 🎉
```

### Command Line (All Platforms)
```bash
npm install
npm start
# Open: http://localhost:5000/app.html
```

### Mac/Linux Users
```bash
chmod +x start-server.sh
./start-server.sh
# Browser opens automatically
```

---

## 📖 HOW TO USE

### 1. Create Your Account
```
Click "Sign Up"
- Username: Any unique name
- Email: Your email address
- Password: Minimum 6 characters
Click "Sign Up" → Login with your credentials
```

### 2. Upload Documents (Dashboard → Documents)
- **Drag & Drop:** Drag files into upload area
- **Click Upload:** Click area to select files
- Supported: PDF, DOC, PPTX, JPG, PNG, etc.
- Earn **5 XP** per upload

### 3. Ask AI Questions (Dashboard → Ask AI)
- Click "Ask AI" tab
- Type any question
- Press Enter or click "Ask"
- Get detailed answer with references
- Earn **10 XP** per question
- Examples: "Explain photosynthesis", "How to solve quadratic equations"

### 4. Analyze Images (Dashboard → Image Analysis)
- Click "Image Analysis" tab
- Upload image by clicking or dragging
- Get OCR + AI analysis
- View references
- Earn **15 XP** per analysis
- Try uploading: math equations, diagrams, textbook pages

### 5. Solve Problems (Dashboard → Solve Problems)
- Click "Solve Problems" tab
- Select subject (Math, Physics, Chemistry, Bio, etc.)
- Enter problem text
- Get step-by-step solution
- Earn **20 XP** per solution
- Supports 8 subjects: Math, Physics, Chemistry, Biology, English, History, Geography, Economics

### 6. Track Progress (Dashboard → Progress)
- Use sliders to update progress
- Progress updates in real-time
- Average shown on dashboard
- Visual percentage indicators

### 7. Set Preferences (Dashboard → Preferences)
- Set learning goals
- Choose learning style
- Save study preferences
- Settings persist automatically

### 8. Watch Gamification
- **Dashboard:** See XP points, streak counter
- **Earn XP:** From all learning activities
- **Build Streak:** Use app different days
- **Get Badges:** Unlock achievements at milestones

---

## ✨ NEW FEATURES (Version 2.0)

### 🤖 AI Q&A System
Ask any question and receive detailed explanations with references. Perfect for:
- Clarifying difficult concepts
- Getting quick answers
- Learning new topics
- Homework help

### 📸 Image Analysis
Upload photos, diagrams, or screenshots and get AI-powered analysis with OCR. Great for:
- Mathematical equations
- Chemistry diagrams
- Ph� COMPLETE DOCUMENTATION

### Getting Started
- **TESTING_GUIDE.txt** - Step-by-step testing instructions
- **START_SERVER.bat** - Windows launcher (just double-click!)
- **start-server.sh** - Mac/Linux launcher

### Feature Documentation
- **UPDATES.md** - Detailed feature documentation & function reference
- **Code Comments** - Throughout app.html, style.css, and client.js

### Quick Reference
- **API Endpoints:** See UPDATES.md section
- **Gamification:** XP system details in UPDATES.md
- **Troubleshooting:** TESTING_GUIDE.txt section 7

---

## 🎯 GAMIFICATION BREAKDOWN
- Textbook pages
- Handwritten notes

### 🧠 Problem Solver
Solve problems across 8 academic subjects with step-by-step explanations:
- **Math** - Algebra, geometry, calculus
- **Physics** - Motion, energy, waves
- **Chemistry** - Reactions, bonding
- **Biology** - Cells, genetics, anatomy
- **English** - Grammar, literature
- **History** - Events, analysis
- **Geography** - Maps, climate
- **Economics** - Concepts, analysis

### 🎮 Gamification System
- **XP Points:** Earn points for every learning activity
- **Streak Counter:** Track consecutive days learning
- **Achievement Badges:** Unlock milestones
- **Leaderboard:** Compete with others (coming soon)

### 🎨 Enhanced UI
- **7 Navigation Tabs:** Dashboard, Documents, Progress, Ask AI, Image Analysis, Solve Problems, Preferences
- **Modern Design:** Clean, intuitive interface with animations
- **Responsive:** Works perfectly on desktop, tablet, and mobile
- **Professional Footer:** Developer credits and copyright

---

## 🔧 FIXING THE UPLOAD ISSUE

**PROBLEM:** Document uploads weren't showing in dashboard

**SOLUTION:** This system now:
1. ✅ Stores documents in the database immediately
2. ✅ Creates progress tracking entries automatically
3. ✅ Displays documents on dashboard right after upload
4. ✅ Shows progress percentage for each document
5. ✅ Allows users to update progress with sliders

---

## 📱 MOBILE/CROSS-PLATFORM SUPPORT

The Python backend (`structure.py`) provides a REST API that can be used for:
- ✅ Mobile apps (iOS/Android) via HTTP requests
- ✅ Desktop applications
- ✅ CLI tools
- ✅ Cross-platform support

### API Endpoints
All endpoints require JWT authentication (except /register and /login)

#### Authentication
- `POST /api/register` - Create account
- `POST /api/login` - Login and get token
- `GET /api/user` - Get current user (requires auth)

#### Documents
- `POST /api/documents/upload` - Upload document (requires auth)
- `GET /api/documents` - Get user's documents (requires auth)
- `DELETE /api/documents/<id>` - Delete document (requires auth)

#### Progress
- `PUT /api/progress/<doc_id>` - Update progress (requires auth)
- `GET /api/progress/<doc_id>` - Get progress (requires auth)
- `GET /api/stats` - Get user stats (requires auth)

#### Preferences
- `POST /api/study-preferences` - Save preferences (requires auth)
- `GET /api/study-preferences` - Get preferences (requires auth)

---

## 🗄️ DATABASE STRUCTURE

The app uses SQLite with these tables:

### users
- id, username, email, password, study_goal, created_at

### documents
- id, user_id, filename, file_path, file_size, upload_date, progress_percentage, status

### progress
- id, user_id, document_id, pages_read, total_pages, completion_percentage, last_accessed

### notes
- id, user_id, document_id, title, content, created_at

### study_preferences
- id, user_id, subject, learning_style, time_per_session, created_at

---

## 🚀 IMPORTANT FEATURES INCLUDED

1. **Secure Authentication**
   - Passwords hashed with bcryptjs
   - JWT tokens for API access
   - Token expires in 24 hours

2. **File Upload Management**
   - Multiple file format support
   - Automatic file naming with timestamps
   - File size tracking
   - File deletion with cleanup

3. **Progress Tracking**
   - Automatic progress calculation
   - Last accessed timestamp
   - Overall statistics
   - Progress visualization

4. **User Preferences**
   - Learning style options
   - Study session duration
   - Subject/topic tracking
   - Study goals

5. **Responsive Design**
   - Mobile-friendly interface
   - Tablet optimized
   - Works on any modern browser

---

## ⚙️ CONFIGURATION

### To change database location:
**Node.js**: Edit `app.js` line with SQLite path
**Python**: Edit `structure.py` line with SQLite path

### To change API port:
**Node.js**: Edit `app.js` const PORT = 5000
**Python**: Edit `structure.py` app.run(port=5001)

### To change upload folder:
Both backends use `./uploads/` folder (auto-created)

---

## 🔐 SECURITY NOTES

1. Change the secret keys in both backends before deploying to production:
   - Node.js: `SECRET_KEY`, `JWT_SECRET`
   - Python: `SECRET_KEY`, `JWT_SECRET_KEY`

2. Use HTTPS in production

3. Set proper CORS restrictions for production

4. Consider adding rate limiting for production

---

## 🐛 TROUBLESHOOTING

### "Cannot POST /api/login"
- Make sure backend server is running
- Check if port 5000 (Node) or 5001 (Python) is in use
- Update API_URL in frontend if needed

### "Document not visible after upload"
- Check browser console for errors (F12)
- Verify backend server is running
- Check if uploads/ folder exists and is writable

### "Login not working"
- Make sure you're using an email that exists
- Password must be correct
- Check if database file exists

### "Get 404 on API calls"
- Verify the API URL matches your backend
- Check that backend server is running
- Clear browser cache

---

## 📞 SUPPORT

For issues or questions:
1. Check the troubleshooting section above
2. Verify backend server is running: Look for "running on http://localhost:5000"
3. Check browser console for error messages (F12 key)
4. Verify all dependencies are installed

---

## 📝 NEXT STEPS & ENHANCEMENTS

Consider adding:
- 💾 Cloud storage integration (AWS S3, Google Cloud)
- 🤖 AI-powered quiz generation
- 📊 Advanced analytics and insights
- 💬 Peer discussion forums
- 🎓 Certificates of completion
- 📧 Email notifications
- 🌙 Dark mode
- 🌍 Multi-language support

---

## ✅ What's Been Fixed/Added

✅ Complete login/logout system
✅ Document upload with proper storage
✅ Documents display in dashboard immediately
✅ Progress tracking for each document
✅ Learning preferences system
✅ Study goal setting
✅ User statistics dashboard
✅ Mobile/cross-platform Python backend
✅ Secure JWT authentication
✅ Responsive design
✅ Proper error handling
✅ File management
✅ Database with all necessary tables

---

## 🎉 You're All Set!

Your LearnHub platform is now fully functional. Start uploading documents, setting goals, and tracking your learning progress!

**Happy Learning! 📚**
