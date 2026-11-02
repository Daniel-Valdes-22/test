# Simple Library App

Minimal FastAPI + React + SQLite library app: log in, browse books, buy a book.

## Stack

- **Backend:** FastAPI, SQLAlchemy, SQLite (`backend/`)
- **Frontend:** React (Vite) (`frontend/`)

## Demo users

| Username | Password     |
|----------|--------------|
| alice    | password123  |
| bob      | password123  |

## Run locally

### 1. Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API: http://127.0.0.1:8000  
Docs: http://127.0.0.1:8000/docs

SQLite DB file is created at `backend/library.db` on first start (seeded with demo users and books).

### 2. Frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

App: http://127.0.0.1:5173

The Vite dev server proxies `/api` to the backend on port 8000.

## Features

1. Username/password login (passwords hashed with bcrypt in SQLite)
2. Browse the book catalog after login
3. Buy a book (records a purchase for the logged-in user)
