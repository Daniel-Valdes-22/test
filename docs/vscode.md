# VS Code / Cursor workspace setup

Open the **repo root** (not `backend/` or `frontend/` alone) in VS Code or Cursor so the shared `.vscode` config applies.

## One-time setup

1. Install recommended extensions when prompted (Python, Pylance, Prettier, etc.).
2. **Terminal → Run Task… → `Setup: create venv & install all`**

That creates `backend/.venv`, installs Python deps, and runs `npm install` in `frontend/`.

You do **not** need to run `source backend/.venv/bin/activate` for day-to-day work. The workspace interpreter is already set to `backend/.venv`, and new integrated terminals auto-activate it.

## Day-to-day run / debug

**Option A — Run and Debug (F5)**

- `Backend: FastAPI` → API on http://127.0.0.1:8000  
- `Frontend: Vite` → app on http://127.0.0.1:5173  
- `Full stack: API + Vite` → both

**Option B — Tasks**

- `Run: backend (uvicorn)` (with `--reload`)
- `Run: frontend (Vite)`
- `Run: full stack`

## Manual terminal (optional)

If you open an external shell:

```bash
cd backend
source .venv/bin/activate   # only needed outside VS Code/Cursor
```

Inside the editor, pick the `backend/.venv` interpreter from the status bar if it is not selected yet (Command Palette → **Python: Select Interpreter**).
