# Smart Classroom Edge AI Telemetry & AC Automation System

A full-stack, local Edge AI telemetry system and glassmorphic monitoring dashboard built with **FastAPI**, **TensorFlow / Keras**, **Next.js 14**, and **Tailwind CSS**.

Powered by your custom Google Teachable Machine deep learning model (`keras_model.h5` & `labels.txt`).

---

## 🌟 Key System Capabilities

1. **Local Neural Inference Engine**:
   - High-throughput video frame processing with real-time FPS pacing.
   - Input Preprocessing: BGR -> RGB 224×224 normalization `(img / 127.5) - 1.0`.
   - **3.0-Second State Hold Protection**: State transitions for both `LOW` and `HIGH` occupancy lock for 3.0 seconds to eliminate state flickering.

2. **People Count Prediction & Headcount Mapping**:
   - **LOW Occupancy**: `1 - 2 persons` -> Smart AC Power `OFF`
   - **MEDIUM Occupancy**: `3 - 10 persons` -> Smart AC Power `ON`, Target `24°C` (`ECO` Mode)
   - **HIGH Occupancy**: `More than 10 persons` -> Smart AC Power `ON`, Target `20°C` (`COOL` Mode)

3. **Privacy-First Edge Processing & Playback Control**:
   - **100% Offline Processing**: Raw video frames are analyzed locally in memory and never transmitted to external cloud servers.
   - **Clean Playback Completion**: Video streams stop cleanly at the final frame without auto-looping back.
   - **Preserved Statistics**: Historical telemetry analytics remain stored until explicit video deletion.

4. **Glassmorphic Web Dashboard**:
   - **Command Center (`/`)**: Real-time telemetry metric cards, live HTTP MJPEG stream (`/api/stream`), live performance meters.
   - **Video Workbench (`/video`)**: Drag-and-drop uploader (`react-dropzone`) and video playback control toolbar.
   - **Analytics & Statistics (`/statistics`)**: Historical occupancy distributions, average inference latency, and headcount trends.
   - **Live Console Logs (`/logs`)**: Real-time system logger terminal interface.
   - **Control Settings (`/settings`)**: Interactive threshold & AC rule configuration.

---

## 📁 Project Architecture

```text
smart_classroom_ac/
├── models/                        # Trained Edge AI Model Directory
│   ├── keras_model.h5             # Google Teachable Machine Keras H5 Model
│   ├── labels.txt                 # Class labels (Low, Medium, High)
│   └── labels1.txt                # Label metadata
├── backend/                       # FastAPI Edge Server
│   ├── app/
│   │   ├── api/                   # REST & MJPEG streaming endpoints
│   │   │   └── router.py
│   │   ├── core/                  # Core configuration & logging
│   │   │   ├── config.py
│   │   │   └── logging.py
│   │   ├── schemas/               # Pydantic data schemas
│   │   │   └── payload.py
│   │   ├── services/              # AI Inference & Business Logic
│   │   │   ├── ac_service.py
│   │   │   ├── occupancy_service.py
│   │   │   ├── statistics_service.py
│   │   │   ├── tflite_service.py
│   │   │   └── video_processor.py
│   │   └── main.py                # FastAPI entry point
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                      # Next.js 14 Glassmorphic Dashboard
│   ├── src/
│   │   ├── app/                   # App Router pages (Dashboard, Video, Stats, Logs, Settings)
│   │   ├── components/            # UI & Layout components
│   │   ├── services/              # Axios API client
│   │   └── types/                 # TypeScript type definitions
│   ├── Dockerfile
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
├── uploads/                       # Uploaded video storage (.gitkeep preserved)
├── logs/                          # System log files (.gitkeep preserved)
├── .gitignore                     # Git ignore rules
├── docker-compose.yml              # Docker Compose orchestration
├── README.md                      # Comprehensive project documentation
└── run_project.bat                # 1-Click Windows Launcher Script
```

---

## 🚀 Step-by-Step Instructions to Run

### Method 1: Docker Compose (Recommended for Production)

Build and start both backend and frontend containers with healthchecks:

```bash
docker-compose up --build -d
```

- **Frontend Dashboard**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000`
- **API Documentation**: `http://localhost:8000/docs`

---

### Method 2: 1-Click Windows Launcher

Double-click `run_project.bat` in the root directory to launch backend and frontend servers automatically.

---

### Method 3: Manual Terminal Setup

#### 1. Start FastAPI Backend:
```bash
pip install -r backend/requirements.txt
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```

#### 2. Start Next.js Frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## 🛠️ API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/stream` | `GET` | Live HTTP MJPEG video stream with telemetry HUD overlay |
| `/api/dashboard` | `GET` | Real-time telemetry state (Occupancy, AC status, FPS, Memory/CPU) |
| `/api/statistics` | `GET` | Aggregated analytics & cumulative occupancy distributions |
| `/api/upload` | `POST` | Upload custom classroom video files |
| `/api/control` | `POST` | Control playback state (`pause`, `resume`, `stop`, `remove`) |
| `/api/settings` | `POST` | Dynamically update classroom thresholds & AC rules |
| `/api/logs` | `GET` | Stream live system log lines |

---

## 📄 License

This project was developed for educational and research purposes.

---

## 👨‍💻 Author

**Mohomed Ajmal**  
Computer Science Undergraduate  
*Edge AI • Computer Vision • FastAPI • Next.js • Docker*