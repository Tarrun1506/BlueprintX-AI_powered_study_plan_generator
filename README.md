# 🚀 BlueprintX: AI-Powered Study Plan Generator

**BlueprintX** is a premium, AI-driven academic companion designed to transform overwhelming syllabi into structured, actionable study plans. By leveraging local LLMs, BlueprintX ensures your data stays private while providing deep insights, interactive learning tools, and comprehensive progress tracking.

---

## ✨ Key Features

### 🧠 Intelligent Syllabus Analysis
- **Local AI Analysis:** Uses **Llama 3.2:3b** via Ollama to extract modules, topics, and sub-topics from PDF, DOCX, or TXT files.
- **Smart Prioritization:** Automatically identifies high-impact topics based on importance and complexity.
- **Effort Estimation:** Provides realistic study-time predictions for every module.

### 📅 Smart Scheduling
- **Automated Calendar Generation:** Creates day-by-day study schedules based on your exam date and daily availability.
- **Intelligent Distribution:** Evenly distributes topics to prevent burnout and ensure comprehensive coverage.
- **Flexible Planning:** Customize daily study hours and days off.

### 🎓 Interactive Learning Tools
- **AI Tutor Chat:** Ask questions about specific topics with context-aware AI assistance.
- **Topic Quizzes:** Test your knowledge with AI-generated quizzes (unlocked after completing topics).
- **External Resources:** Quick access to YouTube and Google search for each topic.

### 📊 Progress Tracking & Analytics
- **Visual Dashboard:** Track completion rates with interactive Pie and Bar charts.
- **Course Breakdown:** Monitor progress across multiple syllabi simultaneously.
- **Cascading Checkboxes:** Mark parent topics to automatically check all subtopics.
- **Auto-Completion:** Parent topics auto-complete when all children are finished.

### 📄 Export & Sharing
- **PDF Export:** Download professional study plans with all topics, schedules, and metadata.
- **Persistent Storage:** All progress is saved to MongoDB and syncs across sessions.

### 🔐 Secure & Private
- **User Authentication:** Robust JWT-based signup and login system.
- **Personal Library:** Save and manage multiple syllabi in your private history.
- **100% Local AI:** Your documents never leave your machine—analysis is performed entirely on your hardware.

### 🎨 Premium Experience
- **Modern UI:** Sleek interface built with React 19 and Material UI.
- **Landing Page:** Professional welcome page with feature highlights.
- **Responsive Design:** Optimized for desktop and mobile devices.
- **Clean Navigation:** Intuitive routing with smart authentication redirects.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, Material UI, React Router, Recharts |
| **Backend** | Python 3.11, FastAPI, Uvicorn, Pydantic v2 |
| **Database** | MongoDB (for user data and analysis history) |
| **Local AI** | Ollama (Llama 3.2:3b for analysis & chat) |
| **Security** | JWT (JSON Web Tokens), Bcrypt Hashing |
| **PDF Generation** | jsPDF, html2canvas |

---

## 🚀 Quick Start

### 1. Prerequisites
- **Python 3.11+**
- **Node.js 18+**
- **Ollama** (Installed and running)
- **MongoDB** (Running locally or via Atlas)

### 2. AI Model Setup
Pull the recommended model to power the analysis:
```bash
ollama pull llama3.2:3b
```

### 3. Backend Setup
```bash
cd backend
python -m venv venv
# Activate venv:
# Windows: .\\venv\\Scripts\\activate | Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```
Backend will run on `http://localhost:8000`

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Visit `http://localhost:5173` to get started!

---

## 📂 Project Structure
```bash
BlueprintX/
├── backend/
│   ├── app/
│   │   ├── api/              # API routes (auth, analysis, syllabus)
│   │   ├── core/             # Database & security config
│   │   ├── models/           # Pydantic models
│   │   └── services/         # Business logic (Ollama, scheduler)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # Auth & Analysis state management
│   │   ├── pages/            # Full page views (Dashboard, Upload, etc.)
│   │   ├── services/         # API client functions
│   │   └── utils/            # PDF export utilities
│   └── package.json
└── README.md
```

---

## 🎯 How It Works

1. **Upload Syllabus:** Drag and drop your course syllabus (PDF/DOCX/TXT).
2. **AI Analysis:** Llama 3.2 extracts topics, estimates hours, and assigns importance.
3. **Generate Schedule:** Set your exam date and daily study hours to get a personalized calendar.
4. **Track Progress:** Check off topics as you complete them—parent topics auto-complete.
5. **Interactive Learning:** Use AI chat for questions and quizzes to test your knowledge.
6. **Monitor Dashboard:** View your overall progress and course breakdown with visual charts.
7. **Export Plan:** Download your complete study plan as a PDF.

---

## 🌟 Features in Detail

### Dashboard
- Real-time statistics (Total Topics, Completed, Pending, Study Hours)
- Interactive Pie Chart showing overall completion percentage
- Bar Chart displaying progress across multiple courses
- Quick access to upload new syllabi

### Analysis Result Page
- Hierarchical topic view with expandable subtopics
- Checkbox progress tracking with cascading behavior
- Scheduled dates for each topic
- YouTube and Google search integration
- AI Chat and Quiz buttons for each subtopic
- PDF export functionality

### My Library
- List of all saved analyses with timestamps
- Quick view and delete actions
- Navigate to any saved analysis

---

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=blueprintx
SECRET_KEY=your-secret-key-here
OLLAMA_BASE_URL=http://localhost:11434
```

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login and get JWT token

### Syllabus Analysis
- `POST /api/syllabus/upload` - Upload and analyze syllabus
- `GET /api/analysis/` - Get all saved analyses
- `GET /api/analysis/{id}` - Get specific analysis
- `PUT /api/analysis/{id}` - Update analysis (for progress tracking)
- `DELETE /api/analysis/{id}` - Delete analysis
- `POST /api/analysis/{id}/schedule` - Generate study schedule

### Interactive Features
- `POST /api/interactive/chat` - Chat with AI about a topic
- `POST /api/interactive/quiz` - Generate quiz for a topic