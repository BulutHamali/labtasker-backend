# LabTasker — Research Lab Task Manager

A REST API backend for managing research projects and tasks, built with Node.js, Express, and MongoDB.
Designed for students, postdocs, and research teams who need a lightweight way to organize lab work into projects and trackable tasks.

> **Status:** Backend complete and deployed. A React frontend (Vite + Tailwind CSS) is in active development in a separate repository.

---

## Features

- JWT-based authentication (register, login, token-protected routes)
- Projects API — full CRUD, scoped to the authenticated user
- Tasks API — nested under projects, with Kanban-style status tracking (`To Do`, `In Progress`, `Done`)
- Drag-and-drop task reordering via a bulk-update endpoint
- Deployment-ready for Render

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+, Express 5 |
| Database | MongoDB Atlas, Mongoose 8 |
| Auth | JWT (jsonwebtoken), bcrypt |
| Deployment | Render |

---

## Getting Started

### Prerequisites

- Node.js v18+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account and connection URI
- `jq` — only needed to run the included test script

```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq
```

### Installation

```bash
git clone https://github.com/BulutHamali/labtasker-backend.git
cd labtasker-backend
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=3001
MONGO_URI=your-mongodb-atlas-uri
JWT_SECRET=a-long-random-secret-string
```

### Run in Development

```bash
npm run dev
```

The server starts on `http://localhost:3001` by default.

---

## API Reference

All endpoints except `/api/auth/*` require an `Authorization: Bearer <token>` header.

### Authentication

#### `POST /api/auth/register`

```json
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "mypassword123"
}
```

#### `POST /api/auth/login`

```json
{
  "email": "alice@example.com",
  "password": "mypassword123"
}
```

Response:

```json
{ "token": "<jwt>" }
```

Tokens expire after **1 hour**.

---

### Projects

All project routes are scoped to the authenticated user.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects` | List all projects |
| `POST` | `/api/projects` | Create a project |
| `GET` | `/api/projects/:id` | Get a single project |
| `PUT` | `/api/projects/:id` | Update a project |
| `DELETE` | `/api/projects/:id` | Delete a project |

**Create / update body:**

```json
{
  "name": "RNA-seq Analysis",
  "description": "Differential expression pipeline"
}
```

---

### Tasks

Tasks are nested under a project. All task routes require the parent `projectId`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects/:projectId/tasks` | List tasks for a project |
| `POST` | `/api/projects/:projectId/tasks` | Create a task |
| `PUT` | `/api/projects/:projectId/tasks/:taskId` | Update a task |
| `DELETE` | `/api/projects/:projectId/tasks/:taskId` | Delete a task |
| `PUT` | `/api/projects/:projectId/tasks/reorder` | Bulk reorder tasks |

**Create task body:**

```json
{
  "name": "Trim adapter sequences",
  "dueDate": "2025-09-01"
}
```

**Update task body** (all fields optional):

```json
{
  "name": "Trim adapter sequences",
  "status": "In Progress",
  "completed": false,
  "dueDate": "2025-09-01",
  "order": 2
}
```

`status` must be one of: `"To Do"`, `"In Progress"`, `"Done"`.

**Bulk reorder body:**

```json
{
  "updates": [
    { "taskId": "<id>", "status": "In Progress", "order": 0 },
    { "taskId": "<id>", "status": "To Do", "order": 1 }
  ]
}
```

---

## Testing the API

A shell script is included to exercise the full API flow end-to-end. Requires `jq`.

```bash
chmod +x test-all.sh
./test-all.sh
```

The script registers a test user, logs in, creates a project and task, updates and deletes the task, then confirms deletion.

---

## Deployment (Render)

1. Push this repository to GitHub.
2. In [Render](https://render.com), create a new **Web Service** pointing to the repo.
3. Set the following environment variables in the Render dashboard:
   - `MONGO_URI`
   - `JWT_SECRET`
4. Set the start command to `node server.js` for production.

---

## Roadmap

- [ ] React frontend (Vite + Tailwind CSS) — in progress, separate repo
- [ ] Task filtering and sorting by status or due date
- [ ] Refresh token support for persistent sessions
- [ ] Optional email reminders for approaching deadlines

---

## License

MIT
