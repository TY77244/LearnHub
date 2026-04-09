"""
============================================================
LEARNHUB - PYTHON BACKEND (Flask)
For API, Mobile Support, and Cross-Platform Integration
============================================================
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import os
from functools import wraps

# ============================================================
# FLASK APP SETUP
# ============================================================

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///learnhub.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your-jwt-secret-key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

# Create upload folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ============================================================
# DATABASE MODELS
# ============================================================

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    study_goal = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    documents = db.relationship('Document', backref='user', lazy=True, cascade='all, delete-orphan')
    progress = db.relationship('Progress', backref='user', lazy=True, cascade='all, delete-orphan')
    notes = db.relationship('Note', backref='user', lazy=True, cascade='all, delete-orphan')
    preferences = db.relationship('StudyPreference', backref='user', lazy=True, cascade='all, delete-orphan')


class Document(db.Model):
    __tablename__ = 'documents'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    file_size = db.Column(db.Integer)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    progress_percentage = db.Column(db.Integer, default=0)
    status = db.Column(db.String(50), default='uploaded')


class Progress(db.Model):
    __tablename__ = 'progress'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    document_id = db.Column(db.Integer, db.ForeignKey('documents.id'))
    pages_read = db.Column(db.Integer, default=0)
    total_pages = db.Column(db.Integer)
    completion_percentage = db.Column(db.Integer, default=0)
    last_accessed = db.Column(db.DateTime, default=datetime.utcnow)


class Note(db.Model):
    __tablename__ = 'notes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    document_id = db.Column(db.Integer, db.ForeignKey('documents.id'))
    title = db.Column(db.String(255))
    content = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class StudyPreference(db.Model):
    __tablename__ = 'study_preferences'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    subject = db.Column(db.String(255))
    learning_style = db.Column(db.String(100))
    time_per_session = db.Column(db.Integer, default=30)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ============================================================
# AUTHENTICATION ROUTES
# ============================================================

@app.route('/api/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    user = User(
        username=data['username'],
        email=data['email'],
        password=generate_password_hash(data['password'])
    )
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully', 'user_id': user.id}), 201


@app.route('/api/login', methods=['POST'])
def login():
    """Login user and return JWT token"""
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'message': 'Login successful',
        'token': access_token,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'study_goal': user.study_goal
        }
    }), 200


@app.route('/api/user', methods=['GET'])
@jwt_required()
def get_user():
    """Get current user data"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'study_goal': user.study_goal,
        'created_at': user.created_at.isoformat()
    }), 200


@app.route('/api/user/study-goal', methods=['PUT'])
@jwt_required()
def update_study_goal():
    """Update user's study goal"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    user.study_goal = data.get('study_goal')
    db.session.commit()
    
    return jsonify({'message': 'Study goal updated'}), 200


# ============================================================
# DOCUMENT ROUTES
# ============================================================

ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx', 'jpg', 'jpeg', 'png'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/api/documents/upload', methods=['POST'])
@jwt_required()
def upload_document():
    """Upload a document"""
    user_id = get_jwt_identity()
    
    if 'document' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['document']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400
    
    filename = secure_filename(file.filename)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
    unique_filename = timestamp + filename
    file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
    file.save(file_path)
    
    document_title = request.form.get('document_title', filename)
    file_size = os.path.getsize(file_path)
    
    doc = Document(
        user_id=user_id,
        filename=document_title,
        file_path=file_path,
        file_size=file_size
    )
    
    db.session.add(doc)
    db.session.commit()
    
    # Create progress entry
    progress = Progress(user_id=user_id, document_id=doc.id)
    db.session.add(progress)
    db.session.commit()
    
    return jsonify({
        'message': 'Document uploaded successfully',
        'document': {
            'id': doc.id,
            'filename': doc.filename,
            'file_size': file_size,
            'upload_date': doc.upload_date.isoformat()
        }
    }), 201


@app.route('/api/documents', methods=['GET'])
@jwt_required()
def get_documents():
    """Get user's documents"""
    user_id = get_jwt_identity()
    documents = Document.query.filter_by(user_id=user_id).order_by(Document.upload_date.desc()).all()
    
    docs_list = []
    for doc in documents:
        progress = Progress.query.filter_by(document_id=doc.id).first()
        docs_list.append({
            'id': doc.id,
            'filename': doc.filename,
            'file_size': doc.file_size,
            'upload_date': doc.upload_date.isoformat(),
            'progress_percentage': doc.progress_percentage,
            'completion_percentage': progress.completion_percentage if progress else 0
        })
    
    return jsonify(docs_list), 200


@app.route('/api/documents/<int:doc_id>', methods=['DELETE'])
@jwt_required()
def delete_document(doc_id):
    """Delete a document"""
    user_id = get_jwt_identity()
    doc = Document.query.filter_by(id=doc_id, user_id=user_id).first()
    
    if not doc:
        return jsonify({'error': 'Document not found'}), 404
    
    # Delete file
    if os.path.exists(doc.file_path):
        os.remove(doc.file_path)
    
    db.session.delete(doc)
    db.session.commit()
    
    return jsonify({'message': 'Document deleted'}), 200


# ============================================================
# PROGRESS ROUTES
# ============================================================

@app.route('/api/progress/<int:doc_id>', methods=['PUT'])
@jwt_required()
def update_progress(doc_id):
    """Update learning progress for a document"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    doc = Document.query.filter_by(id=doc_id, user_id=user_id).first()
    if not doc:
        return jsonify({'error': 'Document not found'}), 404
    
    progress = Progress.query.filter_by(document_id=doc_id, user_id=user_id).first()
    if not progress:
        progress = Progress(user_id=user_id, document_id=doc_id)
        db.session.add(progress)
    
    pages_read = data.get('pages_read', 0)
    total_pages = data.get('total_pages', 100)
    
    progress.pages_read = pages_read
    progress.total_pages = total_pages
    progress.completion_percentage = int((pages_read / total_pages * 100)) if total_pages > 0 else 0
    progress.last_accessed = datetime.utcnow()
    
    doc.progress_percentage = progress.completion_percentage
    
    db.session.commit()
    
    return jsonify({
        'message': 'Progress updated',
        'completion_percentage': progress.completion_percentage
    }), 200


@app.route('/api/progress/<int:doc_id>', methods=['GET'])
@jwt_required()
def get_progress(doc_id):
    """Get progress for a document"""
    user_id = get_jwt_identity()
    progress = Progress.query.filter_by(document_id=doc_id, user_id=user_id).first()
    
    if not progress:
        return jsonify({}), 200
    
    return jsonify({
        'id': progress.id,
        'pages_read': progress.pages_read,
        'total_pages': progress.total_pages,
        'completion_percentage': progress.completion_percentage,
        'last_accessed': progress.last_accessed.isoformat()
    }), 200


@app.route('/api/stats', methods=['GET'])
@jwt_required()
def get_stats():
    """Get user's overall statistics"""
    user_id = get_jwt_identity()
    
    total_docs = Document.query.filter_by(user_id=user_id).count()
    total_notes = Note.query.filter_by(user_id=user_id).count()
    
    progress_records = Progress.query.filter_by(user_id=user_id).all()
    avg_progress = 0
    if progress_records:
        avg_progress = sum(p.completion_percentage for p in progress_records) / len(progress_records)
    
    return jsonify({
        'total_documents': total_docs,
        'total_notes': total_notes,
        'avg_progress': round(avg_progress, 2)
    }), 200


# ============================================================
# STUDY PREFERENCES ROUTES
# ============================================================

@app.route('/api/study-preferences', methods=['POST'])
@jwt_required()
def create_study_preference():
    """Create or update study preferences"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    pref = StudyPreference(
        user_id=user_id,
        subject=data.get('subject'),
        learning_style=data.get('learning_style'),
        time_per_session=data.get('time_per_session', 30)
    )
    
    db.session.add(pref)
    db.session.commit()
    
    return jsonify({
        'message': 'Study preferences saved',
        'id': pref.id
    }), 201


@app.route('/api/study-preferences', methods=['GET'])
@jwt_required()
def get_study_preferences():
    """Get user's study preferences"""
    user_id = get_jwt_identity()
    prefs = StudyPreference.query.filter_by(user_id=user_id).order_by(StudyPreference.created_at.desc()).all()
    
    prefs_list = []
    for pref in prefs:
        prefs_list.append({
            'id': pref.id,
            'subject': pref.subject,
            'learning_style': pref.learning_style,
            'time_per_session': pref.time_per_session,
            'created_at': pref.created_at.isoformat()
        })
    
    return jsonify(prefs_list), 200


# ============================================================
# ERROR HANDLERS
# ============================================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500


# ============================================================
# HEALTH CHECK
# ============================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """API health check"""
    return jsonify({'status': 'LearnHub API is running'}), 200


# ============================================================
# MAIN EXECUTION
# ============================================================

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("Database tables created successfully")
    
    print("🚀 LearnHub Python Backend running on http://localhost:5001")
    app.run(debug=True, port=5001)
