# PawSafe

Full-stack web app for pet adoption and lost/found tracking. Frontend uses Vite, React, TypeScript, Redux Toolkit, Tailwind. Backend uses Express, TypeScript, MongoDB, Multer for uploads, and Socket.IO for chat/notifications.

## Project Structure
- `client/` – Vite + React frontend
- `server/` – Express API, WebSocket server, and uploads
- `setup.bat`, `setup.sh` – helper scripts for first-time setup

## Folder Structure
```
PawSafe/
├─ client/                 # Frontend (Vite + React + TS)
│  ├─ src/
│  │  ├─ pages/            # Route pages (Home, MyPosts, AddPet, etc.)
│  │  ├─ components/       # Shared UI components
│  │  ├─ store/            # Redux slices/actions
│  │  ├─ context/          # Notification context
│  │  ├─ types/            # Shared TypeScript types
│  │  └─ assets/           # Static images
│  ├─ public/              # Static assets served as-is
│  ├─ index.html           # Vite entry HTML
│  └─ package.json
├─ server/                 # Backend (Express + TS)
│  ├─ src/
│  │  ├─ config/           # DB connection
│  │  ├─ middleware/       # Multer upload configs
│  │  ├─ models/           # Mongoose schemas (Pet, LostPet, User, etc.)
│  │  ├─ routes/           # REST endpoints
│  │  ├─ socket/           # Socket.IO handlers
│  │  └─ index.ts          # App entry
│  ├─ uploads/             # Stored uploads (petImages, avatars)
│  ├─ .env.example         # Backend env template
│  └─ package.json
├─ setup.bat / setup.sh    # Helper setup scripts
└─ README.md
```

## Requirements
- Node.js 18+ and npm
- MongoDB connection string (Atlas works)
- Default ports: API `5000`, frontend `5173`
- Uploads are stored under `server/uploads` and are served from `/uploads/...` by the API

## Setup

### Backend (server/)
```bash
cd server
npm install
cp .env.example .env  # fill MONGODB_URI (required), adjust PORT if needed
npm run dev           # starts http://localhost:5000
```

### Frontend (client/)
```bash
cd client
npm install
echo VITE_API_URL=http://localhost:5000/api > .env
npm run dev           # starts http://localhost:5173
```

### Static uploads
- Pet images: `POST /api/pets/upload-images` or `POST /api/lost-pets/upload-images` with form-data field `images`; files land in `server/uploads/petImages`.
- Avatars: `POST /api/users/:id/avatar` with form-data field `avatar`; files land in `server/uploads/avatars`.
- Served at `http://localhost:5000/uploads/<subfolder>/<filename>`.

## Scripts
- Backend: `npm run dev` (watch), `npm run build`, `npm start`
- Frontend: `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`

## Core Endpoints (base `/api`)
- Health: `GET /health`
- Auth: `POST /auth/signup`, `POST /auth/login`
- Users: `GET /users`, `GET/PUT/DELETE /users/:id`, `POST /users/:id/avatar`
- Pets: `GET /pets`, `GET /pets/:id`, `POST /pets`, `PUT /pets/:id`, `DELETE /pets/:id`, `POST /pets/upload-images`, `POST /pets/:id/save`, `POST /pets/:id/unsave`
- Lost Pets: `GET /lost-pets`, `GET /lost-pets/:id`, `POST /lost-pets`, `PUT /lost-pets/:id`, `DELETE /lost-pets/:id`, `POST /lost-pets/upload-images`
- Completed: `GET /completed-pets`, `GET /completed-pets/user/:userId`, `DELETE /completed-pets/:id`; `GET /completed-lost-pets`, `GET /completed-lost-pets/user/:userId`, `DELETE /completed-lost-pets/:id`
- Chat: `GET /chat?conversationId=...&since=...`, `POST /chat` (conversationId, senderId, text), `GET /chat/conversations`

## Troubleshooting
- API not reachable: confirm `MONGODB_URI` in `server/.env`, server logs, and that port 5000 is free.
- Frontend cannot call API: set `VITE_API_URL` in `client/.env` and restart `npm run dev`.
- Upload errors: files must be images; size limited by Multer; ensure `server/uploads` remains writable.
- CORS/WebSocket: set `CLIENT_URL` in `server/.env` if you serve the frontend from a non-default origin.
