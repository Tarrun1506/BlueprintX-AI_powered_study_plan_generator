# 🚀 BlueprintX: AI-Powered Study Plan Generator

**BlueprintX** is a premium, AI-driven academic companion designed to transform overwhelming syllabi into structured, actionable study plans. By leveraging local LLMs, BlueprintX ensures your data stays private while providing deep insights into your course material.

---

## ✨ Key Features

### 🧠 Intelligent Syllabus Decomposition
- **Local AI Analysis:** Uses **Llama 3.2:3b** via Ollama to extract modules, topics, and sub-topics.
- **Smart Prioritization:** Automatically identifies high-impact topics based on importance and complexity.
- **Effort Estimation:** Provides realistic study-time predictions for every module.

### 🔐 Secure & Private
- **User Authentication:** Robust JWT-based signup and login system.
- **Personal Library:** Save and manage multiple syllabi in your private history.
- **100% Local AI:** Your documents never leave your machine—analysis is performed entirely on your hardware.

### 🎨 Premium Experience
- **Glassmorphic UI:** A sleek, modern interface built with React 19 and Material UI.
- **Smart Navigation:** Distraction-free dashboard for new users and direct App access for authenticated students.
- **Responsive Design:** Optimized for power-users on desktop and quick checks on mobile.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, Material UI, React Context API |
| **Backend** | Python 3.11, FastAPI, Uvicorn, Pydantic v2 |
| **Database** | MongoDB (for user data and analysis history) |
| **Local AI** | Ollama (Llama 3.2:3b, Gemma 2) |
| **Security** | JWT (JSON Web Tokens), Bcrypt Hashing |

---

## 🚀 Quick Start

### 1. Prerequisites
- **Python 3.11+**
- **Node.js 18+**
- **Ollama** (Installed and running)
- **MongoDB** (Running locally or via Atlas)

### 2. AI Model Setup
Pull the recommended models to power the analysis:
```bash
ollama pull llama3.2:3b
ollama pull gemma2:2b
```

### 3. Backend Setup
```bash
cd backend
python -m venv venv
# Activate venv:
# Windows: .\venv\Scripts\activate | Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

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
│   ├── app/                # FastAPI logic (auth, analysis, routes)
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/     # UI features & layouts
│   │   ├── context/        # Auth & Analysis state
│   │   └── pages/          # Full page views
│   └── package.json
└── README.md
```

---
*Created with ❤️ by Tarrun1506*