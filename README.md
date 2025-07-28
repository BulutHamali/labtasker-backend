# LabTasker – Research Project & Task Management Platform

LabTasker is a **full-stack MERN application** built for students, postdocs, and research teams to manage their academic or lab projects.  
It allows users to:
- Create projects
- Break them down into tasks
- Track deadlines
- View progress on a clean dashboard

While designed for research workflows, LabTasker can also be used as a general project tracker.

---

## Features

- **Secure Authentication** (JWT & bcrypt)
- **Projects API** with full CRUD operations
- **Tasks API** nested under projects
- **Protected Endpoints** (user-specific access)
- **Backend Deployment Ready** (Render-compatible)

---

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, React Router, Context API (for auth state)  
- **Backend:** Node.js, Express, MongoDB Atlas, Mongoose  
- **Auth:** JWT (JSON Web Tokens), bcrypt  
- **Deployment:** Render (or Netlify for frontend)  

---

## Setup

### Prerequisites
- Node.js v18+  
- MongoDB Atlas account (for `MONGO_URI`)  
- `jq` (for running test scripts) — install via Homebrew:  
  ```bash
  brew install jq
  ```


## Installation
Clone the repository:
```bash
git clone <your-repo-url>
cd labtasker/backend
```

Install dependencies:
```bash
npm install
```

Add a `.env` file:
```env
PORT=3001
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-random-secret
```

Start the server:
```bash
npm run dev
```

# API Endpoints

All endpoints require a **Bearer token** (returned by `/api/auth/login`) unless noted.

## Authentication

### Register – POST /api/auth/register
Body:
```json
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "mypassword123"
}
```

### Login – POST /api/auth/login
Body:
```json
{
  "email": "alice@example.com",
  "password": "mypassword123"
}
```
Response:
```json
{ "token": "<jwt_token>" }
```

## Projects

- List Projects – GET /api/projects
- Create Project – POST /api/projects
  ```json
  {
    "name": "Thesis Work",
    "description": "Experiments and analysis"
  }
  ```
- Update Project – PUT /api/projects/:id
- Delete Project – DELETE /api/projects/:id

## Tasks (Nested Under Projects)

- List Tasks – GET /api/projects/:projectId/tasks
- Create Task – POST /api/projects/:projectId/tasks
  ```json
  {
    "name": "Analyze RNA-seq Data",
    "dueDate": "2025-08-15"
  }
  ```
- Update Task – PUT /api/projects/tasks/:taskId
- Delete Task – DELETE /api/projects/tasks/:taskId

# Testing the API: Why curl is Preferred

While Postman is useful, `curl` is **safer and more transparent** for LabTasker because:
- It avoids Postman quirks (auto-overwriting headers or switching to form-data).
- You see the **exact request and response** with no abstraction.
- You can **script full workflows** (register → login → create project → create task → update/delete).
- Debugging is faster since nothing is hidden behind a UI.

## Quick Test Script

This project includes a `test-all.sh` script to test the full API flow:

```bash
chmod +x test-all.sh
./test-all.sh
```

It will:
1. Register (or log in) a test user
2. Create a project
3. Add a task to that project
4. List, update, and delete the task
5. Confirm everything works

Requires `jq` (install via `brew install jq`).

# Deployment

1. Push your backend to GitHub.
2. On Render (https://render.com), create a new Web Service.
3. Add environment variables from your `.env`.
4. Deploy.

# Future Improvements

- React frontend (dashboard and login UI)
- Project/task filtering and sorting
- Persistent sessions (refresh tokens)
- Optional email notifications

# License
MIT License.
