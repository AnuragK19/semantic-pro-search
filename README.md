# Pro Semantic Command Palette

AI-powered natural language command palette for enterprise SaaS workflows.

## Quick Start

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Copy environment template and add your OpenRouter API key
copy .env.example .env
# Edit .env and add your OPENROUTER_API_KEY

# Run server
uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies (already done if you cloned fresh)
npm install

# Run dev server
npm run dev
```

Open http://localhost:5173 in your browser.

## Features

### 10 Power User Commands

| Command | Description |
|---------|-------------|
| `FILTER_SEGMENT` | Filter data table by segment, location, time |
| `COMPARE_METRICS` | Compare metrics across time periods |
| `BULK_TAG` | Tag multiple records based on criteria |
| `REVOKE_ACCESS` | Revoke user access (with confirmation) |
| `SIMULATE_PROJECTION` | Run what-if revenue simulations |
| `SCAN_ANOMALIES` | Scan for security anomalies |
| `SCHEDULE_JOB` | Schedule recurring exports/reports |
| `TRIGGER_WEBHOOK` | Sync data to external services |
| `DATA_TRANSFORMATION` | Normalize data formats |
| `MERGE_DUPLICATES` | Deduplicate records |

### Rate Limiting

- 10 commands per day per IP address
- Resets at midnight UTC

## Tech Stack

- **Backend:** FastAPI + OpenRouter AI
- **Frontend:** React + Vite + Tailwind CSS + Zustand
- **Charts:** Recharts
- **Icons:** Lucide React
