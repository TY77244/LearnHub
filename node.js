/* ============================
   LEARNHUB - LEARNING PLATFORM JAVASCRIPT
   ============================ */

// DOM Elements
const navBtns = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');
const uploadBtn = document.getElementById('upload-trigger');
const fileInput = document.getElementById('file-input');
const uploadArea = document.getElementById('upload-area');
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatWindow = document.getElementById('chat-window');
const createNoteBtn = document.getElementById('create-note-btn');
const noteModal = document.getElementById('note-modal');
const searchInput = document.getElementById('search-input');
const documentsList = document.getElementById('documents-list');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeFileUpload();
    initializeChat();
    initializeModals();
    initializeSearch();
});

/* ============================
   TAB NAVIGATION
   ============================ */

function initializeTabs() {
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            showTab(tabName);
            
            // Update active button
            navBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showTab(tabName) {
    // Hide all tabs
    tabContents.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName + '-tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
}

/* ============================
   FILE UPLOAD HANDLING
   ============================ */

function initializeFileUpload() {
    uploadBtn.addEventListener('click', openFileDialog);
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('drop', handleFileDrop);
    uploadArea.addEventListener('click', openFileDialog);
}

function openFileDialog() {
    fileInput.click();
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        processFiles(files);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    uploadArea.style.borderColor = '#5B21B6';
    uploadArea.style.background = 'rgba(91, 33, 182, 0.05)';
}

function handleFileDrop(e) {
    e.preventDefault();
    uploadArea.style.borderColor = '#E5E7EB';
    uploadArea.style.background = 'var(--bg-white)';
    
    const files = e.dataTransfer.files;
    processFiles(files);
}

function processFiles(files) {
    Array.from(files).forEach(file => {
        console.log('File uploaded:', file.name, file.size, file.type);
        showNotification(`✓ ${file.name} uploaded successfully!`, 'success');
    });
}

/* ============================
   CHAT FUNCTIONALITY
   ============================ */

function initializeChat() {
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Quick buttons
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.textContent;
            userInput.value = question;
            sendMessage();
        });
    });
}

function sendMessage() {
    const message = userInput.value.trim();
    
    if (message === '') return;
    
    // Add user message
    addChatMessage(message, 'user');
    userInput.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const responses = [
            "That's a great question! Let me help you understand this concept better...",
            "Based on your notes, here's what I found: The key points are important to understand...",
            "I found relevant information in your materials. Would you like me to explain it in detail?",
            "Let me break this down for you with a simple example..."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addChatMessage(randomResponse, 'ai');
    }, 500);
}

function addChatMessage(text, sender) {
    const wrapper = document.createElement('div');
    wrapper.className = `message-wrapper ${sender === 'ai' ? 'ai-wrapper' : 'user-wrapper'}`;
    
    const message = document.createElement('div');
    message.className = `message ${sender === 'ai' ? 'ai-message' : 'user-message'}`;
    message.textContent = text;
    
    wrapper.appendChild(message);
    chatWindow.appendChild(wrapper);
    
    // Scroll to bottom
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

/* ============================
   MODAL FUNCTIONALITY
   ============================ */

function initializeModals() {
    // Close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Create note button
    createNoteBtn.addEventListener('click', () => {
        noteModal.style.display = 'flex';
    });
    
    // Cancel buttons
    document.querySelectorAll('.btn-cancel').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });
    
    // Save note button
    const saveBtns = document.querySelectorAll('.btn-save');
    saveBtns.forEach(btn => {
        btn.addEventListener('click', saveNote);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

function saveNote() {
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;
    const tags = document.getElementById('note-tags').value;
    
    if (!title || !content) {
        showNotification('Please fill in title and content', 'error');
        return;
    }
    
    console.log('Note saved:', { title, content, tags });
    showNotification('✓ Note saved successfully!', 'success');
    
    // Reset form
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
    document.getElementById('note-tags').value = '';
    
    // Close modal
    noteModal.style.display = 'none';
}

/* ============================
   SEARCH FUNCTIONALITY
   ============================ */

function initializeSearch() {
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        filterDocuments(query);
    });
}

function filterDocuments(query) {
    const docItems = document.querySelectorAll('.doc-item');
    
    docItems.forEach(item => {
        const docName = item.querySelector('.doc-name').textContent.toLowerCase();
        
        if (query === '' || docName.includes(query)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

/* ============================
   NOTIFICATION SYSTEM
   ============================ */

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 2000;
        animation: slideIn 0.3s ease;
        ${type === 'success' ? 'background: #10B981;' : 'background: #EF4444;'}
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add slide animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/* ============================
   ADDITIONAL FEATURES
   ============================ */

// Document selection in chat
const docSelector = document.getElementById('document-selector');
if (docSelector) {
    docSelector.addEventListener('change', function() {
        console.log('Selected document:', this.value);
    });
}

// Quiz buttons
document.querySelectorAll('[data-tab="quizzes"] .btn-primary').forEach(btn => {
    btn.addEventListener('click', function() {
        console.log('Starting quiz...');
        showNotification('Quiz will start soon!', 'info');
    });
});

// Logout button
document.querySelector('.logout-btn').addEventListener('click', function() {
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logged out successfully', 'success');
        // Add logout logic here
    }
});

/* ============================
   LOCAL STORAGE FOR PERSISTENCE
   ============================ */

function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

function getFromLocalStorage(key) {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return null;
    }
}

// Save user activity on unload
window.addEventListener('beforeunload', function() {
    const lastActiveTab = document.querySelector('.nav-btn.active').getAttribute('data-tab');
    saveToLocalStorage('lastActiveTab', lastActiveTab);
});

// Restore last active tab on load
window.addEventListener('load', function() {
    const lastTab = getFromLocalStorage('lastActiveTab');
    if (lastTab) {
        const tabBtn = document.querySelector(`[data-tab="${lastTab}"]`);
        if (tabBtn) {
            tabBtn.click();
        }
    }
});

console.log('✓ LearnHub Platform Loaded Successfully!');
