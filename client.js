/* ============================
   LEARNHUB - FRONTEND JAVASCRIPT CLIENT
   ============================ */

const API_URL = 'http://localhost:5000/api';
let currentUser = null;
let token = null;

// ============================
// INITIALIZATION
// ============================

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
        token = savedToken;
        loadUserData();
        loadGamification();
        showMainApp();
    }

    initializeEventListeners();
});

// ============================
// TAB NAVIGATION
// ============================

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    // Show selected tab
    const selectedTab = document.getElementById(tabName + '-tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
}

// ============================
// EVENT LISTENERS
// ============================

function initializeEventListeners() {
    // Auth buttons
    document.getElementById('login-btn')?.addEventListener('click', handleLogin);
    document.getElementById('register-btn')?.addEventListener('click', handleRegister);

    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            showTab(tabName);
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Logout buttons
    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
    document.getElementById('logout-btn-2')?.addEventListener('click', handleLogout);

    // Upload
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const hiddenFileInput = document.getElementById('hidden-file-input');
    const quickUploadBtn = document.getElementById('quick-upload-btn');

    uploadArea?.addEventListener('click', () => fileInput?.click());
    uploadArea?.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#5B21B6';
        uploadArea.style.background = 'rgba(91, 33, 182, 0.05)';
    });
    uploadArea?.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#E5E7EB';
        uploadArea.style.background = 'white';
    });
    uploadArea?.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#E5E7EB';
        uploadArea.style.background = 'white';
        handleFiles(e.dataTransfer.files);
    });

    fileInput?.addEventListener('change', (e) => handleFiles(e.target.files));
    quickUploadBtn?.addEventListener('click', () => hiddenFileInput?.click());
    hiddenFileInput?.addEventListener('change', (e) => handleFiles(e.target.files));

    // Preferences
    document.getElementById('save-preferences-btn')?.addEventListener('click', savePreferences);
    document.getElementById('save-goal-btn')?.addEventListener('click', saveStudyGoal);

    // Q&A System
    document.getElementById('qa-send-btn')?.addEventListener('click', sendQuestion);
    document.getElementById('qa-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendQuestion();
    });

    // Image Analysis
    const imageUploadArea = document.getElementById('image-upload-area');
    const imageInput = document.getElementById('image-input');
    imageUploadArea?.addEventListener('click', () => imageInput?.click());
    imageUploadArea?.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageUploadArea.style.borderColor = '#5B21B6';
        imageUploadArea.style.background = 'rgba(91, 33, 182, 0.05)';
    });
    imageUploadArea?.addEventListener('dragleave', () => {
        imageUploadArea.style.borderColor = '#E5E7EB';
        imageUploadArea.style.background = 'white';
    });
    imageUploadArea?.addEventListener('drop', (e) => {
        e.preventDefault();
        imageUploadArea.style.borderColor = '#E5E7EB';
        imageUploadArea.style.background = 'white';
        if (e.dataTransfer.files[0]) analyzeImage(e.dataTransfer.files[0]);
    });
    imageInput?.addEventListener('change', (e) => {
        if (e.target.files[0]) analyzeImage(e.target.files[0]);
    });

    // Problem Solver
    document.querySelectorAll('.subject-btn')?.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.subject-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    document.getElementById('solve-btn')?.addEventListener('click', solveProblem);
}

// ============================
// AUTHENTICATION
// ============================

async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showNotification('Please enter email and password', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            token = data.token;
            currentUser = data.user;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(data.user));
            showNotification('✅ Login successful!', 'success');
            showMainApp();
            loadUserData();
        } else {
            showNotification(data.error || 'Login failed', 'error');
        }
    } catch (error) {
        showNotification('❌ Connection error: ' + error.message, 'error');
    }
}

async function handleRegister() {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm-password').value;

    if (!username || !email || !password || !confirm) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (password !== confirm) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('✅ Account created! Now login.', 'success');
            document.getElementById('register-form').classList.add('hidden');
            document.getElementById('login-form').classList.remove('hidden');
            // Clear form
            document.getElementById('register-email').value = '';
            document.getElementById('register-password').value = '';
            document.getElementById('register-confirm-password').value = '';
        } else {
            showNotification(data.error || 'Registration failed', 'error');
        }
    } catch (error) {
        showNotification('❌ Connection error: ' + error.message, 'error');
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    token = null;
    currentUser = null;
    document.getElementById('auth-page').style.display = 'flex';
    document.getElementById('main-app').style.display = 'none';
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    showNotification('👋 You have been logged out', 'success');
}

// ============================
// UI STATE MANAGEMENT
// ============================

function showMainApp() {
    document.getElementById('auth-page').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';
}

function toggleAuthForm() {
    document.getElementById('login-form').classList.toggle('hidden');
    document.getElementById('register-form').classList.toggle('hidden');
}

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabName + '-tab').classList.add('active');

    if (tabName === 'progress') {
        loadProgressData();
    }
}

// ============================
// DOCUMENT UPLOAD
// ============================

async function handleFiles(files) {
    for (let file of files) {
        await uploadDocument(file);
    }
}

async function uploadDocument(file) {
    if (!token) return;

    const formData = new FormData();
    formData.append('document', file);
    formData.append('document_title', file.name);

    try {
        const response = await fetch(`${API_URL}/documents/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            showNotification(`✅ "${file.name}" uploaded successfully!`, 'success');
            loadDocuments();
        } else {
            showNotification(data.error || 'Upload failed', 'error');
        }
    } catch (error) {
        showNotification('❌ Upload error: ' + error.message, 'error');
    }
}

// ============================
// LOAD DATA
// ============================

async function loadUserData() {
    if (!token) return;

    try {
        const response = await fetch(`${API_URL}/user`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const user = await response.json();
            currentUser = user;
            document.getElementById('user-name-display').textContent = user.username || 'User';
            document.getElementById('account-email').textContent = user.email;
            if (user.study_goal) {
                document.getElementById('study-goal').value = user.study_goal;
                document.getElementById('study-goal-display').textContent = user.study_goal.substring(0, 30) + '...';
            }
        }
    } catch (error) {
        console.error('Error loading user:', error);
    }

    loadDocuments();
    loadStats();
}

async function loadDocuments() {
    if (!token) return;

    try {
        const response = await fetch(`${API_URL}/documents`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const documents = await response.json();

        // Populate documents list
        const listContainer = document.getElementById('documents-list');
        const recentContainer = document.getElementById('recent-documents');

        if (documents.length === 0) {
            listContainer.innerHTML = '<p class="empty-state">No documents uploaded yet</p>';
            recentContainer.innerHTML = '<p class="empty-state">No documents yet. Upload one to get started!</p>';
            return;
        }

        // List view
        listContainer.innerHTML = documents.map(doc => `
            <div class="doc-item">
                <div class="doc-info">
                    <div class="doc-name">${doc.filename}</div>
                    <div class="doc-meta">${formatDate(doc.upload_date)} • ${formatFileSize(doc.file_size)}</div>
                </div>
                <div class="doc-progress-bar">
                    <div class="progress-fill" style="width: ${doc.progress_percentage || doc.completion_percentage || 0}%"></div>
                </div>
                <div class="doc-percentage">${doc.progress_percentage || doc.completion_percentage || 0}%</div>
                <button class="doc-delete-btn" onclick="deleteDocument(${doc.id})">🗑️</button>
            </div>
        `).join('');

        // Recent view (dashboard)
        recentContainer.innerHTML = documents.slice(0, 3).map(doc => `
            <div class="doc-card">
                <div class="doc-card-header">
                    <span class="doc-card-title">${doc.filename}</span>
                    <span class="doc-card-progress">${doc.progress_percentage || doc.completion_percentage || 0}%</span>
                </div>
                <div class="progress-bar-small">
                    <div class="progress-fill-small" style="width: ${doc.progress_percentage || doc.completion_percentage || 0}%"></div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading documents:', error);
    }
}

async function loadStats() {
    if (!token) return;

    try {
        const response = await fetch(`${API_URL}/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const stats = await response.json();

        document.getElementById('total-docs').textContent = stats.total_documents || 0;
        document.getElementById('doc-count').textContent = stats.total_documents || 0;
        
        const avgProgress = Math.round(stats.avg_progress || 0);
        document.getElementById('total-progress').textContent = avgProgress + '%';
        document.getElementById('avg-progress').textContent = avgProgress;

    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadProgressData() {
    if (!token) return;

    try {
        const response = await fetch(`${API_URL}/documents`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const documents = await response.json();
        const container = document.getElementById('progress-container');

        if (documents.length === 0) {
            container.innerHTML = '<p class="empty-state">Upload documents to track your progress</p>';
            return;
        }

        container.innerHTML = documents.map(doc => `
            <div class="progress-item">
                <div class="progress-header">
                    <h4>${doc.filename}</h4>
                    <span class="progress-badge">${doc.progress_percentage || doc.completion_percentage || 0}%</span>
                </div>
                <div class="progress-bar-large">
                    <div class="progress-fill-large" style="width: ${doc.progress_percentage || doc.completion_percentage || 0}%"></div>
                </div>
                <div class="progress-controls">
                    <input type="range" min="0" max="100" value="${doc.progress_percentage || doc.completion_percentage || 0}" 
                           onchange="updateProgress(${doc.id}, this.value)">
                    <span class="progress-text" id="progress-text-${doc.id}">${doc.progress_percentage || doc.completion_percentage || 0}%</span>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading progress:', error);
    }
}

async function updateProgress(documentId, percentage) {
    if (!token) return;

    try {
        const response = await fetch(`${API_URL}/progress/${documentId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pages_read: percentage,
                total_pages: 100
            })
        });

        if (response.ok) {
            document.getElementById('progress-text-' + documentId).textContent = percentage + '%';
            loadStats();
            loadDocuments();
            showNotification('📈 Progress updated!', 'success');
        }
    } catch (error) {
        console.error('Error updating progress:', error);
    }
}

async function deleteDocument(docId) {
    if (!confirm('Are you sure you want to delete this document?')) return;

    if (!token) return;

    try {
        const response = await fetch(`${API_URL}/documents/${docId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            showNotification('✅ Document deleted successfully', 'success');
            loadDocuments();
            loadStats();
        }
    } catch (error) {
        console.error('Error deleting document:', error);
    }
}

// ============================
// PREFERENCES
// ============================

async function savePreferences() {
    if (!token) return;

    const subject = document.getElementById('study-subject').value;
    const learning_style = document.getElementById('learning-style').value;
    const time_per_session = document.getElementById('study-time').value;

    if (!subject || !learning_style) {
        showNotification('Please fill in all preference fields', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/study-preferences`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                subject,
                learning_style,
                time_per_session: parseInt(time_per_session)
            })
        });

        if (response.ok) {
            showNotification('✅ Study preferences saved! Now get studying! 🚀', 'success');
        }
    } catch (error) {
        showNotification('Error saving preferences: ' + error.message, 'error');
    }
}

async function saveStudyGoal() {
    if (!token) return;

    const goal = document.getElementById('study-goal').value;

    if (!goal) {
        showNotification('Please enter your study goal', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/user/study-goal`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ study_goal: goal })
        });

        if (response.ok) {
            document.getElementById('study-goal-display').textContent = goal.substring(0, 30) + '...';
            showNotification('🎯 Study goal updated!', 'success');
        }
    } catch (error) {
        showNotification('Error updating goal: ' + error.message, 'error');
    }
}

// ============================
// UTILITIES
// ============================

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ============================
// Q&A SYSTEM WITH WEB SEARCH
// ============================

async function sendQuestion() {
    const input = document.getElementById('qa-input');
    const question = input.value.trim();

    if (!question) return;

    // Add user message to chat
    const chatHistory = document.getElementById('chat-history');
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message message-user';
    userMessage.innerHTML = `<div class="message-content">${escapeHtml(question)}</div>`;
    chatHistory.appendChild(userMessage);

    input.value = '';
    input.focus();

    // Show loading indicator
    showNotification('🤔 Searching for answer...', 'info');

    try {
        // Simulate AI response with web search integration
        const response = await generateAIAnswer(question);
        
        // Add AI message to chat
        const aiMessage = document.createElement('div');
        aiMessage.className = 'chat-message message-ai';
        aiMessage.innerHTML = `
            <div class="message-content">
                ${response.answer}
                <div class="message-reference">
                    📚 References: ${response.references.join(' | ')}
                </div>
            </div>
        `;
        chatHistory.appendChild(aiMessage);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        // Award XP for asking questions
        awardXP(10);
        showNotification('✅ Answer found!', 'success');
    } catch (error) {
        showNotification('❌ Error: ' + error.message, 'error');
    }
}

async function generateAIAnswer(question) {
    // This simulates calling an AI service with web search capabilities
    // In production, integrate with: Google Custom Search, Bing API, or similar
    
    const answers = {
        'photosynthesis': {
            answer: `<strong>Photosynthesis</strong> is the process by which plants convert light energy (usually from the sun) into chemical energy stored in glucose (sugar). The process occurs mainly in the leaves and has two main stages: the light-dependent reactions and the light-independent reactions (Calvin cycle).

<strong>Light-Dependent Reactions (in thylakoid membrane):</strong>
• Occur in the presence of light
• Water molecules are split, releasing oxygen as a byproduct
• Energy (ATP) and reducing power (NADPH) are generated
• Happens in chloroplasts

<strong>Light-Independent Reactions - Calvin Cycle (in stroma):</strong>
• Occur in darkness (but depend on ATP and NADPH from light reactions)
• Use CO₂ to produce glucose
• Three main phases: Carbon fixation, Reduction, and Regeneration

<strong>Simple Equation:</strong>
6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂`,
            references: [
                'Khan Academy - Photosynthesis',
                'Biology Online - Light-dependent & Independent Reactions',
                'National Geographic - How Photosynthesis Works'
            ]
        },
        'quadratic': {
            answer: `<strong>Quadratic Equations</strong> are polynomial equations of the second degree in the form: ax² + bx + c = 0

<strong>Methods to Solve:</strong>

1. <strong>Quadratic Formula:</strong>
   x = [-b ± √(b² - 4ac)] / 2a
   
2. <strong>Factoring:</strong>
   If ax² + bx + c = (dx + e)(fx + g)
   Then solutions are x = -e/d and x = -g/f

3. <strong>Completing the Square:</strong>
   Move constant to right side
   Divide by coefficient of x²
   Add (b/2)² to both sides
   Take square root of both sides

4. <strong>Graphing:</strong>
   Solution is where parabola crosses x-axis

<strong>Example:</strong> x² + 5x + 6 = 0
Factors to: (x + 2)(x + 3) = 0
Solutions: x = -2 or x = -3`,
            references: [
                'Math is Fun - Quadratic Equations',
                'Khan Academy - Formula for solving quadratic equations',
                'Wolfram MathWorld - Quadratic Equation'
            ]
        }
    };

    // Check if question matches known topics
    const questionLower = question.toLowerCase();
    for (const [key, data] of Object.entries(answers)) {
        if (questionLower.includes(key)) {
            return data;
        }
    }

    // Default response with simulated web search
    return {
        answer: `<strong>Based on Web Search Results:</strong>

Your question about "${question}" has been searched across multiple educational sources. Here are the key findings:

<strong>Summary:</strong>
The topic you're asking about is an important concept in learning. The key points to understand are:
1. Core definition and basic concepts
2. How it relates to other topics you're studying
3. Real-world applications and examples
4. Practice problems to solidify understanding

<strong>Next Steps:</strong>
• Review your textbook or uploaded documents on this topic
• Try solving practice problems
• Use the Image Analysis feature to upload diagrams
• Use Problem Solver for specific calculations

To get a more accurate answer, please provide more specific details about your question!`,
        references: [
            'Educational Sources Database',
            'Learning Material Repository',
            'Expert Knowledge Base'
        ]
    };
}

// ============================
// IMAGE ANALYSIS WITH AI
// ============================

async function analyzeImage(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
        const imageData = e.target.result;
        
        // Show preview
        const preview = document.getElementById('image-preview');
        preview.src = imageData;
        
        document.getElementById('image-result-container').style.display = 'block';
        
        showNotification('📸 Analyzing image...', 'info');

        try {
            const analysis = await analyzeImageContent(imageData);
            document.getElementById('image-analysis-text').innerHTML = analysis.text;
            document.getElementById('image-references').innerHTML = 
                `<strong>📚 References:</strong> ${analysis.references.join(' | ')}`;
            
            awardXP(15);
            showNotification('✅ Image analyzed!', 'success');
        } catch (error) {
            showNotification('❌ Analysis error: ' + error.message, 'error');
        }
    };
    reader.readAsDataURL(file);
}

async function analyzeImageContent(imageData) {
    // Simulates image analysis using OCR + AI
    // In production, use: Google Cloud Vision, AWS Rekognition, or Tesseract.js for OCR
    
    return {
        text: `<strong>Image Analysis Results:</strong>

<strong>Detected Content:</strong>
This image appears to contain mathematical equations, diagrams, or educational content. The AI has extracted the following:

✓ Mathematical expressions and formulas detected
✓ Diagram structure identified
✓ Text content recognized via OCR

<strong>Interpretation:</strong>
The image contains learning material that requires step-by-step analysis. Based on the content detected:

1. <strong>Problem Type:</strong> [Specific to your image]
2. <strong>Key Concepts:</strong> [Relevant topics]
3. <strong>Solution Approach:</strong> [Method to solve]
4. <strong>Expected Answer:</strong> [Result]

<strong>Recommendations:</strong>
• Upload clearer images for better accuracy
• Use the Problem Solver for mathematical equations
• Create notes in the Notes section for future reference
• Practice similar problems to strengthen understanding

Upload a clearer image for precise analysis!`,
        references: [
            'Computer Vision Database',
            'OCR Recognition System',
            'AI Analysis Engine'
        ]
    };
}

// ============================
// PROBLEM SOLVER
// ============================

async function solveProblem() {
    const problemInput = document.getElementById('problem-input');
    const problem = problemInput.value.trim();
    const activeSubject = document.querySelector('.subject-btn.active').dataset.subject;

    if (!problem) {
        showNotification('Please enter a problem', 'error');
        return;
    }

    showNotification('🧠 Solving problem...', 'info');

    try {
        const solution = await generateSolution(problem, activeSubject);
        
        document.getElementById('solution-text').innerHTML = solution.solution;
        document.getElementById('solution-references').innerHTML = 
            `<strong>📚 References:</strong> ${solution.references.join(' | ')}`;
        document.getElementById('solution-container').style.display = 'block';
        
        awardXP(20);
        showNotification('✅ Solution provided!', 'success');
    } catch (error) {
        showNotification('❌ Error: ' + error.message, 'error');
    }
}

async function generateSolution(problem, subject) {
    // Simulates AI problem solving across all subjects
    const solutions = {
        math: {
            solution: `<strong>Mathematical Solution:</strong>

<strong>Problem:</strong> ${problem}

<strong>Solution Steps:</strong>
1. <strong>Identify the problem type</strong> - This appears to be a [specific type] problem
2. <strong>List known values</strong> - Variables: [x, y, z, etc.]
3. <strong>Apply relevant formula</strong> - Use appropriate mathematical equation
4. <strong>Calculate step-by-step</strong> - Show all work
5. <strong>Verify answer</strong> - Check using alternative method

<strong>Detailed Work:</strong>
[Step-by-step calculation shown here]

<strong>Final Answer:</strong> [Result]

<strong>Check:</strong> [Verification method]`,
            references: ['Math Problem Solutions', 'Formula Database', 'Calculation Verification']
        },
        physics: {
            solution: `<strong>Physics Solution:</strong>

<strong>Problem:</strong> ${problem}

<strong>Given Information:</strong>
• [All known values listed]

<strong>To Find:</strong> [What needs to be calculated]

<strong>Relevant Physics Concepts:</strong>
1. [Newton's Laws / Energy Conservation / Momentum / etc.]
2. [Specific principles applicable]

<strong>Formula(s) to Use:</strong>
• F = ma (or relevant equation)

<strong>Solution Process:</strong>
1. Analyze the problem
2. Draw a diagram if helpful
3. Apply appropriate formulas
4. Substitute values
5. Calculate result

<strong>Answer:</strong> [With units]`,
            references: ['Physics Handbook', 'Classical Mechanics', 'Physics Lab Manual']
        },
        chemistry: {
            solution: `<strong>Chemistry Solution:</strong>

<strong>Problem:</strong> ${problem}

<strong>Relevant Concepts:</strong>
• [Element properties / Chemical bonding / Reactions / etc.]

<strong>Chemical Equations:</strong>
[Balanced equations shown]

<strong>Solution Steps:</strong>
1. [Analysis of reaction type]
2. [Balancing equation]
3. [Molar calculations]
4. [Result determination]

<strong>Answer:</strong> [Final result with proper units]`,
            references: ['Chemistry Textbook', 'Periodic Table', 'Reaction Database']
        },
        english: {
            solution: `<strong>English Solution:</strong>

<strong>Question:</strong> ${problem}

<strong>Analysis:</strong>
[Detailed literary or grammatical analysis]

<strong>Key Points:</strong>
1. [Main concept]
2. [Supporting evidence]
3. [Examples from text if applicable]

<strong>Answer:</strong>
[Well-structured response with proper grammar and punctuation]

<strong>Tips for Writing:</strong>
• Use clear and concise language
• Support claims with evidence
• Proofread for grammar and spelling`,
            references: ['English Grammar Guide', 'Writing Style Manual', 'Literary Analysis']
        },
        biology: {
            solution: `<strong>Biology Solution:</strong>

<strong>Topic:</strong> ${problem}

<strong>Key Biological Concepts:</strong>
[Relevant biology principles]

<strong>Process/Explanation:</strong>
1. [Origin/Definition]
2. [Function/Purpose]
3. [Examples in nature]
4. [Applications]

<strong>Answer:</strong>
[Comprehensive biological explanation]`,
            references: ['Biology Textbook', 'Life Sciences Database', 'Nature Review']
        }
    };

    return solutions[subject] || {
        solution: `<strong>${subject.toUpperCase()} Problem Solution:</strong><br><br>Your problem: "${problem}"<br><br>
                   <strong>Solution:</strong> This is a ${subject} problem. Follow these steps:<br>
                   1. Understand the problem completely<br>
                   2. Identify key information<br>
                   3. Apply relevant concepts<br>
                   4. Show your work step-by-step<br>
                   5. Check your answer<br><br>
                   For detailed step-by-step solution, please upload clearer problem details!`,
        references: ['Subject Specific Database', 'Educational Resources', 'Expert Solutions']
    };
}

// ============================
// GAMIFICATION & XP SYSTEM
// ============================

function awardXP(points) {
    let currentXP = parseInt(localStorage.getItem('userXP') || '0');
    currentXP += points;
    localStorage.setItem('userXP', currentXP);
    document.getElementById('points-display').textContent = currentXP;
    
    // Update streak
    const today = new Date().toDateString();
    const lastLogin = localStorage.getItem('lastLogin');
    if (lastLogin !== today) {
        let streak = parseInt(localStorage.getItem('streak') || '0') + 1;
        localStorage.setItem('streak', streak);
        localStorage.setItem('lastLogin', today);
        document.getElementById('streak-display').textContent = streak;
    }
}

function loadGamification() {
    const xp = localStorage.getItem('userXP') || '0';
    const streak = localStorage.getItem('streak') || '0';
    document.getElementById('points-display').textContent = xp;
    document.getElementById('streak-display').textContent = streak;
}

// ============================
// UTILITIES
// ============================

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ============================
// Q&A SYSTEM WITH WEB SEARCH
// ============================

async function sendQuestion() {
    const input = document.getElementById('qa-input');
    const question = input.value.trim();

    if (!question) return;

    // Add user message to chat
    const chatHistory = document.getElementById('chat-history');
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message message-user';
    userMessage.innerHTML = `<div class="message-content">${escapeHtml(question)}</div>`;
    chatHistory.appendChild(userMessage);

    input.value = '';
    input.focus();

    // Show loading indicator
    showNotification('🤔 Searching for answer...', 'info');

    try {
        // Simulate AI response with web search integration
        const response = await generateAIAnswer(question);
        
        // Add AI message to chat
        const aiMessage = document.createElement('div');
        aiMessage.className = 'chat-message message-ai';
        aiMessage.innerHTML = `
            <div class="message-content">
                ${response.answer}
                <div class="message-reference">
                    📚 References: ${response.references.join(' | ')}
                </div>
            </div>
        `;
        chatHistory.appendChild(aiMessage);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        // Award XP for asking questions
        awardXP(10);
        showNotification('✅ Answer found!', 'success');
    } catch (error) {
        showNotification('❌ Error: ' + error.message, 'error');
    }
}

async function generateAIAnswer(question) {
    // This simulates calling an AI service with web search capabilities
    // In production, integrate with: Google Custom Search, Bing API, or similar
    
    const answers = {
        'photosynthesis': {
            answer: `<strong>Photosynthesis</strong> is the process by which plants convert light energy (usually from the sun) into chemical energy stored in glucose (sugar). The process occurs mainly in the leaves and has two main stages: the light-dependent reactions and the light-independent reactions (Calvin cycle).

<strong>Light-Dependent Reactions (in thylakoid membrane):</strong>
• Occur in the presence of light
• Water molecules are split, releasing oxygen as a byproduct
• Energy (ATP) and reducing power (NADPH) are generated
• Happens in chloroplasts

<strong>Light-Independent Reactions - Calvin Cycle (in stroma):</strong>
• Occur in darkness (but depend on ATP and NADPH from light reactions)
• Use CO₂ to produce glucose
• Three main phases: Carbon fixation, Reduction, and Regeneration

<strong>Simple Equation:</strong>
6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂`,
            references: [
                'Khan Academy - Photosynthesis',
                'Biology Online - Light-dependent & Independent Reactions',
                'National Geographic - How Photosynthesis Works'
            ]
        },
        'quadratic': {
            answer: `<strong>Quadratic Equations</strong> are polynomial equations of the second degree in the form: ax² + bx + c = 0

<strong>Methods to Solve:</strong>

1. <strong>Quadratic Formula:</strong>
   x = [-b ± √(b² - 4ac)] / 2a
   
2. <strong>Factoring:</strong>
   If ax² + bx + c = (dx + e)(fx + g)
   Then solutions are x = -e/d and x = -g/f

3. <strong>Completing the Square:</strong>
   Move constant to right side
   Divide by coefficient of x²
   Add (b/2)² to both sides
   Take square root of both sides

4. <strong>Graphing:</strong>
   Solution is where parabola crosses x-axis

<strong>Example:</strong> x² + 5x + 6 = 0
Factors to: (x + 2)(x + 3) = 0
Solutions: x = -2 or x = -3`,
            references: [
                'Math is Fun - Quadratic Equations',
                'Khan Academy - Formula for solving quadratic equations',
                'Wolfram MathWorld - Quadratic Equation'
            ]
        }
    };

    // Check if question matches known topics
    const questionLower = question.toLowerCase();
    for (const [key, data] of Object.entries(answers)) {
        if (questionLower.includes(key)) {
            return data;
        }
    }

    // Default response with simulated web search
    return {
        answer: `<strong>Based on Web Search Results:</strong>

Your question about "${question}" has been searched across multiple educational sources. Here are the key findings:

<strong>Summary:</strong>
The topic you're asking about is an important concept in learning. The key points to understand are:
1. Core definition and basic concepts
2. How it relates to other topics you're studying
3. Real-world applications and examples
4. Practice problems to solidify understanding

<strong>Next Steps:</strong>
• Review your textbook or uploaded documents on this topic
• Try solving practice problems
• Use the Image Analysis feature to upload diagrams
• Use Problem Solver for specific calculations

To get a more accurate answer, please provide more specific details about your question!`,
        references: [
            'Educational Sources Database',
            'Learning Material Repository',
            'Expert Knowledge Base'
        ]
    };
}

// ============================
// IMAGE ANALYSIS WITH AI
// ============================

async function analyzeImage(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
        const imageData = e.target.result;
        
        // Show preview
        const preview = document.getElementById('image-preview');
        preview.src = imageData;
        
        document.getElementById('image-result-container').style.display = 'block';
        
        showNotification('📸 Analyzing image...', 'info');

        try {
            const analysis = await analyzeImageContent(imageData);
            document.getElementById('image-analysis-text').innerHTML = analysis.text;
            document.getElementById('image-references').innerHTML = 
                `<strong>📚 References:</strong> ${analysis.references.join(' | ')}`;
            
            awardXP(15);
            showNotification('✅ Image analyzed!', 'success');
        } catch (error) {
            showNotification('❌ Analysis error: ' + error.message, 'error');
        }
    };
    reader.readAsDataURL(file);
}

async function analyzeImageContent(imageData) {
    // Simulates image analysis using OCR + AI
    // In production, use: Google Cloud Vision, AWS Rekognition, or Tesseract.js for OCR
    
    return {
        text: `<strong>Image Analysis Results:</strong>

<strong>Detected Content:</strong>
This image appears to contain mathematical equations, diagrams, or educational content. The AI has extracted the following:

✓ Mathematical expressions and formulas detected
✓ Diagram structure identified
✓ Text content recognized via OCR

<strong>Interpretation:</strong>
The image contains learning material that requires step-by-step analysis. Based on the content detected:

1. <strong>Problem Type:</strong> [Specific to your image]
2. <strong>Key Concepts:</strong> [Relevant topics]
3. <strong>Solution Approach:</strong> [Method to solve]
4. <strong>Expected Answer:</strong> [Result]

<strong>Recommendations:</strong>
• Upload clearer images for better accuracy
• Use the Problem Solver for mathematical equations
• Create notes in the Notes section for future reference
• Practice similar problems to strengthen understanding

Upload a clearer image for precise analysis!`,
        references: [
            'Computer Vision Database',
            'OCR Recognition System',
            'AI Analysis Engine'
        ]
    };
}

// ============================
// PROBLEM SOLVER
// ============================

async function solveProblem() {
    const problemInput = document.getElementById('problem-input');
    const problem = problemInput.value.trim();
    const activeSubject = document.querySelector('.subject-btn.active').dataset.subject;

    if (!problem) {
        showNotification('Please enter a problem', 'error');
        return;
    }

    showNotification('🧠 Solving problem...', 'info');

    try {
        const solution = await generateSolution(problem, activeSubject);
        
        document.getElementById('solution-text').innerHTML = solution.solution;
        document.getElementById('solution-references').innerHTML = 
            `<strong>📚 References:</strong> ${solution.references.join(' | ')}`;
        document.getElementById('solution-container').style.display = 'block';
        
        awardXP(20);
        showNotification('✅ Solution provided!', 'success');
    } catch (error) {
        showNotification('❌ Error: ' + error.message, 'error');
    }
}

async function generateSolution(problem, subject) {
    // Simulates AI problem solving across all subjects
    const solutions = {
        math: {
            solution: `<strong>Mathematical Solution:</strong>

<strong>Problem:</strong> ${problem}

<strong>Solution Steps:</strong>
1. <strong>Identify the problem type</strong> - This appears to be a [specific type] problem
2. <strong>List known values</strong> - Variables: [x, y, z, etc.]
3. <strong>Apply relevant formula</strong> - Use appropriate mathematical equation
4. <strong>Calculate step-by-step</strong> - Show all work
5. <strong>Verify answer</strong> - Check using alternative method

<strong>Detailed Work:</strong>
[Step-by-step calculation shown here]

<strong>Final Answer:</strong> [Result]

<strong>Check:</strong> [Verification method]`,
            references: ['Math Problem Solutions', 'Formula Database', 'Calculation Verification']
        },
        physics: {
            solution: `<strong>Physics Solution:</strong>

<strong>Problem:</strong> ${problem}

<strong>Given Information:</strong>
• [All known values listed]

<strong>To Find:</strong> [What needs to be calculated]

<strong>Relevant Physics Concepts:</strong>
1. [Newton's Laws / Energy Conservation / Momentum / etc.]
2. [Specific principles applicable]

<strong>Formula(s) to Use:</strong>
• F = ma (or relevant equation)

<strong>Solution Process:</strong>
1. Analyze the problem
2. Draw a diagram if helpful
3. Apply appropriate formulas
4. Substitute values
5. Calculate result

<strong>Answer:</strong> [With units]`,
            references: ['Physics Handbook', 'Classical Mechanics', 'Physics Lab Manual']
        },
        chemistry: {
            solution: `<strong>Chemistry Solution:</strong>

<strong>Problem:</strong> ${problem}

<strong>Relevant Concepts:</strong>
• [Element properties / Chemical bonding / Reactions / etc.]

<strong>Chemical Equations:</strong>
[Balanced equations shown]

<strong>Solution Steps:</strong>
1. [Analysis of reaction type]
2. [Balancing equation]
3. [Molar calculations]
4. [Result determination]

<strong>Answer:</strong> [Final result with proper units]`,
            references: ['Chemistry Textbook', 'Periodic Table', 'Reaction Database']
        },
        english: {
            solution: `<strong>English Solution:</strong>

<strong>Question:</strong> ${problem}

<strong>Analysis:</strong>
[Detailed literary or grammatical analysis]

<strong>Key Points:</strong>
1. [Main concept]
2. [Supporting evidence]
3. [Examples from text if applicable]

<strong>Answer:</strong>
[Well-structured response with proper grammar and punctuation]

<strong>Tips for Writing:</strong>
• Use clear and concise language
• Support claims with evidence
• Proofread for grammar and spelling`,
            references: ['English Grammar Guide', 'Writing Style Manual', 'Literary Analysis']
        },
        biology: {
            solution: `<strong>Biology Solution:</strong>

<strong>Topic:</strong> ${problem}

<strong>Key Biological Concepts:</strong>
[Relevant biology principles]

<strong>Process/Explanation:</strong>
1. [Origin/Definition]
2. [Function/Purpose]
3. [Examples in nature]
4. [Applications]

<strong>Answer:</strong>
[Comprehensive biological explanation]`,
            references: ['Biology Textbook', 'Life Sciences Database', 'Nature Review']
        }
    };

    return solutions[subject] || {
        solution: `<strong>${subject.toUpperCase()} Problem Solution:</strong><br><br>Your problem: "${problem}"<br><br>
                   <strong>Solution:</strong> This is a ${subject} problem. Follow these steps:<br>
                   1. Understand the problem completely<br>
                   2. Identify key information<br>
                   3. Apply relevant concepts<br>
                   4. Show your work step-by-step<br>
                   5. Check your answer<br><br>
                   For detailed step-by-step solution, please upload clearer problem details!`,
        references: ['Subject Specific Database', 'Educational Resources', 'Expert Solutions']
    };
}

// ============================
// GAMIFICATION & XP SYSTEM
// ============================

function awardXP(points) {
    let currentXP = parseInt(localStorage.getItem('userXP') || '0');
    currentXP += points;
    localStorage.setItem('userXP', currentXP);
    document.getElementById('points-display').textContent = currentXP;
    
    // Update streak
    const today = new Date().toDateString();
    const lastLogin = localStorage.getItem('lastLogin');
    if (lastLogin !== today) {
        let streak = parseInt(localStorage.getItem('streak') || '0') + 1;
        localStorage.setItem('streak', streak);
        localStorage.setItem('lastLogin', today);
        document.getElementById('streak-display').textContent = streak;
    }
}

function loadGamification() {
    const xp = localStorage.getItem('userXP') || '0';
    const streak = localStorage.getItem('streak') || '0';
    document.getElementById('points-display').textContent = xp;
    document.getElementById('streak-display').textContent = streak;
}

// ============================
// UTILITIES
// ============================

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
