# 🚀 BlueprintX

**BlueprintX** is a premium, AI-powered academic companion designed to transform overwhelming syllabi into actionable, structured learning paths. By leveraging state-of-the-art LLMs and real-time search capabilities, BlueprintX automates the most tedious parts of study planning, allowing students to focus on what matters most: **learning.**

---

## ✨ Core Features

### 🧠 Intelligent Syllabus Analysis
Stop manually breaking down your course modules. BlueprintX uses **Google Gemini** and **Groq** to:
- **Decompose:** Instantly extract topics and sub-topics from PDF, DOCX, or TXT files.
- **Prioritize:** Automatically assess the importance of each topic based on course content.
- **Estimate:** Get smart study-time predictions for every module to manage your workload effectively.

### 🎥 Rich Resource Curation
Never search for "the best tutorial" again. BlueprintX surfaces high-quality learning materials directly in your workflow:
- **Video Previews:** Integration with YouTube APIs allows you to see thumbnails and play previews before leaving the app.
- **Smart Auto-Fetch:** Priority topics automatically trigger resource discovery upon analysis completion.
- **Curated Explanations:** Every suggested video or article comes with an AI-generated reason for why it fits your topic.

### 📅 Dynamic Study Plan Generation
Move from "what to do" to "how to do it" in one click:
- **Session-Based Planning:** Your syllabus is transformed into a logical, session-by-session roadmap.
- **Resource Integration:** Access your curated videos and articles directly from within your study tasks.
- **Persistent Progress:** Thanks to our global state synchronization, your analysis results and study plans stay with you as you navigate between tabs.

### 🎨 Premium User Experience
Designed with a "WOW" factor in mind:
- **Modern UI:** Built with Vanilla CSS and Material UI for a sleek, glassmorphic aesthetic.
- **Responsive Layout:** A full-screen analysis view that optimizes for readability on all devices.
- **Live Sync:** Seamlessly move between Upload and Study Plan views without losing data.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Material UI, React Router |
| **Backend** | Python 3.11, FastAPI, Uvicorn (ASGI) |
| **AI Engine** | Google Gemini 1.5 Flash, Groq (Llama-3), LangChain |
| **Search** | Tavily Search API |
| **State Management** | React Context API |

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.9+**
- **Node.js 18+**
- API Keys for **Google Gemini** and **Tavily**.

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate 
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```
Create a `.env` file in the `backend/` directory:
```env
GEMINI_API_KEY=your_key_here
TAVILY_API_KEY=your_key_here
GROQ_API_KEY=your_key_here (optional)
```
Start the server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173` (or `5175`).

---

## 📁 Project Structure

```bash
BlueprintX/
├── backend/
│   ├── app/                # FastAPI logic (routes, services, core)
│   ├── static/             # Static assets
│   └── .env                # API Configurations
├── frontend/
│   ├── src/
│   │   ├── components/     # UI Components (TopicView, StudyPlan, etc.)
│   │   ├── context/        # Global Analysis Context
│   │   ├── pages/          # Full-page views
│   │   └── utils/          # Video & API Helpers
│   └── package.json        
└── README.md
```