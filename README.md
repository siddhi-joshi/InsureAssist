# InsureAssist

InsureAssist is a standalone insurance operations workspace. It opens directly without login, sign-in, registration, or links to any other project. It stores policy, claim, and support-ticket records in SQLite and provides Overview, My policies, Claims, and Support tabs.

Gemini is optional and only explains the current workspace records. It must not invent coverage, claim status, or payment results.

## Run the React UI

```powershell
cd C:\Users\athar\Desktop\Siddhi\InsureAssist
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
# Set GEMINI_API_KEY in .env if Gemini support is required
cd frontend
npm install
npm run build
cd ..
uvicorn app:app --reload
```

Open http://127.0.0.1:8000. The workspace is created automatically and data is saved to `INSUREASSIST_DB`.

For frontend development, run the backend in one terminal and `npm run dev` inside `frontend` in another terminal. Vite proxies `/api` requests to FastAPI at `http://127.0.0.1:8000`.

Use `npm run format` to format the frontend or `npm run format:check` in CI.

The frontend uses Vite, React, Tailwind CSS, Motion, Lucide icons, and local ReactBits-style components for aurora backgrounds, spotlight cards, blur fades, shiny text, and number tickers.

## Frontend structure

```text
frontend/src/
├── App.jsx                 # Application shell and route selection
├── main.jsx                # React entry point
├── components/
│   ├── layout/             # Sidebar and top-level navigation
│   ├── ui/                 # Reusable visual primitives
│   └── reactbits.jsx       # Motion/visual primitives
├── features/
│   ├── overview/           # Overview page and dashboard metrics
│   ├── policies/           # Policy list and policy cards
│   ├── claims/             # Claim table and claim states
│   ├── support/            # Service desk and tickets
│   └── records/            # Shared policy/claim/ticket form modal
├── hooks/                  # Workspace fetching and toast state
└── lib/                    # API client and shared constants
```

Feature pages own feature-specific behavior; shared components stay presentation-focused; API calls and workspace state are kept out of the page markup.

## API

`GET /api/health`, `GET /api/dashboard`, `GET/POST /api/policies`, `GET/POST /api/claims`, `GET/POST /api/tickets`, and `POST /api/chat`.

Payment processing, live claim status, and policy synchronization require the insurer's official APIs and credentials. The local workspace does not pretend those systems are connected.

Run tests with `pytest -q`.
