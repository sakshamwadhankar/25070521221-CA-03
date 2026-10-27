<div align="center">

<img src="./client/public/favicon.svg" alt="Edu Exchange logo" width="100" height="100" />

# Edu Exchange
### Student Skill Exchange & Project Collaboration Platform

**Share Skills. Build Connections. Grow Together.**

A full-stack web application connecting students through peer learning, skill exchange, and collaborative projects.

[Live Demo](https://eduexchange-five.vercel.app/) · [Source Code](https://github.com/sakshamwadhankar/25070521221-CA-03) · [Local Setup](#installation-and-local-setup) · [API Reference](#api-reference)

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

</div>

---

## Project Information

| Item | Details |
|---|---|
| Project | Edu Exchange |
| Developed by | Saksham Wadhankar |
| Submission repository | `25070521221-CA-03` |
| Architecture | MERN: MongoDB, Express, React, Node.js |
| Language | JavaScript / JSX |
| Database inspection | MongoDB Compass |
| Deployment | Vercel frontend and Node.js function |
| Live demo | https://eduexchange-five.vercel.app/ |

## Table of Contents

1. [Overview and Problem Statement](#overview-and-problem-statement)
2. [Objectives](#objectives)
3. [Features](#features)
4. [Application Pages](#application-pages)
5. [Technology Stack](#technology-stack)
6. [System Architecture](#system-architecture)
7. [Project Structure](#project-structure)
8. [Database Design](#database-design)
9. [Installation and Local Setup](#installation-and-local-setup)
10. [MongoDB Compass](#mongodb-compass)
11. [Demo Accounts and Seed Data](#demo-accounts-and-seed-data)
12. [Available Commands](#available-commands)
13. [API Reference](#api-reference)
14. [Authentication and Authorization](#authentication-and-authorization)
15. [Design System](#design-system)
16. [Vercel Deployment](#vercel-deployment)
17. [Demonstration Walkthrough](#demonstration-walkthrough)
18. [Verification](#verification)
19. [Troubleshooting](#troubleshooting)
20. [Current Scope and Future Improvements](#current-scope-and-future-improvements)
21. [Learning Outcomes](#learning-outcomes)

## Overview and Problem Statement

Students have useful skills but often lack a structured way to discover peers who can teach complementary skills or collaborate on projects. Group chats make it difficult to find suitable partners, track learning requests, and organize team participation.

**Edu Exchange** provides searchable skill listings, student profiles, exchange requests, and project collaboration in one application. Data is stored in MongoDB and retrieved through an Express REST API.

### Example use case

A student who knows **React.js** wants to learn **Figma**. Another student can teach Figma and wants help with frontend development. They can discover each other, view profiles, send an exchange request, accept it, and record completion. They can also collaborate on a project.

## Objectives

- Encourage peer-to-peer learning and knowledge sharing.
- Help students showcase skills and describe learning interests.
- Provide a clear request and response workflow.
- Connect students with academic, hackathon, and creative project teams.
- Demonstrate frontend-backend integration and persistent CRUD operations.
- Build a responsive interface with a consistent visual identity.

## Features

| Module | Implemented capabilities |
|---|---|
| Authentication | Signup, login, password visibility, validation, JWT authentication, logout |
| Student profiles | Name, department, year, bio, initials avatar, offered skills, associated projects, exchange count |
| Skill marketplace | Create, browse, update, delete, search, category/level filters, pagination |
| Teaching and learning | Each listing describes a skill offered and a skill wanted in exchange |
| Learning requests | Send, receive, accept, reject, cancel, complete, and remove requests |
| Projects | Create/edit/delete owned projects, discover teams, apply to join, approve or reject applicants |
| Dashboard | Skill counts, pending request counts, active project count, recent requests and peer listings |
| Notifications | Notification history, unread indicators, mark one/all as read, periodic refresh |
| Interface | Sidebar, mobile layouts, modal forms, toast messages, loading and empty states |

**Skill categories:** Programming, Design, Business, Communication, Languages, Music, Sports, Academics, Other.

**Skill levels:** Beginner, Intermediate, Advanced, Expert.

**Project categories:** Academic, Hackathon, Research, Technical, Creative, Social.

**Project statuses:** Open, In Progress, Completed.

**Request statuses:** pending, accepted, rejected, cancelled, completed.

## Application Pages

| Route | Purpose | Frontend access |
|---|---|---|
| `/` | Branded authentication entry screen | Public; redirects after login |
| `/login` | Shared sign-in/register screen | Public-only |
| `/signup` | Shared sign-in/register screen | Public-only |
| `/dashboard` | Personal statistics and recent activity | Login required |
| `/skills` | Skill discovery and listing management | Login required |
| `/profile` | Current student's profile | Login required |
| `/profile/:id` | Another student's profile | Login required |
| `/requests` | Learning and collaboration requests | Login required |
| `/projects` | Project discovery and team formation | Login required |
| `/notifications` | Notification history | Login required |

Login and registration use a shared component with **Sign In** and **Register** tabs. Project details and editing workflows use modals. `App.jsx` defines the active routes; additional page components remain in the source tree.

Frontend navigation protection and backend API authorization are separate. Some read-only API routes are public, as listed below.

## Technology Stack

| Layer | Technologies and purpose |
|---|---|
| UI | React 18, JSX, HTML, plain CSS, responsive Flexbox/Grid |
| Routing and state | React Router 6, React Context |
| Frontend tooling | Vite 5, Axios |
| Backend | Node.js, Express 4 |
| Persistence | MongoDB, Mongoose 8 schemas and references |
| Authentication | bcryptjs password hashing, jsonwebtoken |
| Configuration | dotenv, CORS middleware |
| Development | Nodemon, Concurrently, Git |
| Database inspection | MongoDB Compass |
| Hosting | Vercel |

## System Architecture

```text
Student / Browser
       |
React pages, reusable components, and Context
       |
       | Axios HTTP requests / JSON
       v
Express -> Database readiness -> Routes / Authentication -> Controllers
       |
Mongoose schemas, validation, queries, and references
       |
MongoDB: users | skills | projects | requests | notifications
```

### Example: creating a skill

1. A student submits the React skill form.
2. Axios sends `POST /api/skills` with the JWT.
3. The backend waits for the shared MongoDB connection and verifies authentication.
4. The controller validates the required fields and creates the skill document.
5. The user's offered-skill references are updated.
6. The API returns JSON and React refreshes the displayed content.

Local development uses Vite's `/api` proxy to the Express server on port `5000`. On Vercel, `/api/*` is routed to `api/index.js`; static frontend assets and React pages are served from `client/dist`.

## Project Structure

```text
25070521221-CA-03/
├── client/
│   ├── public/favicon.svg
│   ├── src/
│   │   ├── components/    # App shell, sidebar, cards, forms, modals
│   │   ├── context/       # Authentication and toast state
│   │   ├── pages/         # Authentication, dashboard, skills, profiles, etc.
│   │   ├── services/      # Axios instance and feature-specific API calls
│   │   ├── styles/        # Theme and component styles
│   │   ├── App.jsx        # Active application routes
│   │   └── main.jsx       # React entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/db.js   # Shared MongoDB connection
│   │   ├── controllers/  # Feature-specific application logic
│   │   ├── middleware/   # Authentication and error handling
│   │   ├── models/       # User, Skill, Project, Request, Notification
│   │   ├── routes/       # REST endpoint definitions
│   │   ├── utils/        # Token generation, avatars, and seed data
│   │   └── server.js     # Express app and local startup
│   ├── test/             # Deployment regression tests
│   └── package.json
├── api/index.js           # Vercel function entry point
├── vercel.json            # Build, function, and SPA routing configuration
├── package.json           # Root development/build/test commands
└── README.md
```

## Database Design

Mongoose defines five collections with document references and `createdAt`/`updatedAt` timestamps.

| Collection | Main fields | Purpose |
|---|---|---|
| `users` | `name`, `email`, `passwordHash`, `department`, `year`, `bio`, `avatarInitials`, `offeredSkills`, `wantedSkills`, `completedExchanges` | Accounts and student profiles |
| `skills` | `name`, `category`, `level`, `description`, `offeredBy`, `wantedSkill`, `availability` | Teaching offers and learning interests |
| `projects` | `title`, `description`, `category`, `owner`, `requiredSkills`, `members`, `maxMembers`, `deadline`, `status` | Collaboration opportunities and teams |
| `requests` | `sender`, `receiver`, `requestType`, `skillId`, `projectId`, `offeredSkill`, `wantedSkill`, `message`, `status` | Skill exchanges and project applications |
| `notifications` | `user`, `title`, `message`, `type`, `relatedRequest`, `isRead` | Activity alerts |

### Relationships

```text
User -> offers many Skills
User -> owns and joins Projects
Request -> connects sender and receiver Users
Request -> references a Skill or Project
Notification -> belongs to a User and may reference a Request
```

- `users.email` has a unique index.
- Skill and project schemas define text indexes; current listing controllers use case-insensitive pattern matching.
- `offeredSkills`, `wantedSkills`, `owner`, `members`, and request participants use ObjectId references.
- `skills.wantedSkill` is a text description, distinct from the `users.wantedSkills` reference array.
- Request types are `skill-exchange` and `project-join`.
- Notification types are `skill-exchange`, `project-join`, `status-update`, and `info`.

## Installation and Local Setup

### Prerequisites

- A supported Node.js LTS release with npm
- Git
- MongoDB Community Server or a MongoDB Atlas database
- MongoDB Compass for inspecting records
- A modern browser

**Compass is a database management GUI, not the MongoDB server.** The application needs a running local server or a reachable hosted database.

### 1. Clone and install

```bash
git clone https://github.com/sakshamwadhankar/25070521221-CA-03.git
cd 25070521221-CA-03
npm run install:all
```

### 2. Configure the backend

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/flexi
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

Generate a secret with:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

For Atlas, use your own connection string:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-host>/flexi
```

The database name `flexi` is retained from the original configuration and does not affect Edu Exchange branding. Keep credentials and `.env` files outside version control.

### 3. Configure the frontend

Create `client/.env`:

```env
VITE_API_URL=/api
```

The local Vite proxy forwards `/api` requests to port `5000`. The deployed application uses same-origin API requests.

### 4. Start MongoDB and the application

Start the local MongoDB service, or ensure Atlas credentials and network access are configured. Then run:

```bash
npm run dev
```

| Service | Address |
|---|---|
| Frontend | http://localhost:5173 |
| Backend base URL | http://localhost:5000/api |
| Process health | http://localhost:5000/api/health |

Local startup attempts to initialize sample data if the users collection is empty. Use a dedicated development database. Importing the deployed function does not run this initialization.

### 5. Build and test

```bash
npm run build
npm test
```

The frontend build is generated in `client/dist/`. Tests cover deployment routing expectations and server/database readiness behavior; they do not replace the end-to-end checklist below.

## MongoDB Compass

1. Open Compass and connect using the backend's MongoDB URI.
2. For a local database, use `mongodb://127.0.0.1:27017/flexi`.
3. Open `flexi` and inspect the five collections.
4. Perform an operation in Edu Exchange.
5. Refresh Compass to see the corresponding document or status update.

For a demonstration, register a student, create a skill, send a request, and create a project. Show the related documents and ObjectId references in Compass, then refresh the browser to demonstrate persistence.

## Demo Accounts and Seed Data

| Student | Email | Password |
|---|---|---|
| Alex Rivera | `alex@flexi.com` | `Demo123` |
| Riya Sharma | `riya@flexi.com` | `Demo123` |

These credentials work when the provided seed data exists in the connected database. Demo buttons fill the authentication form; submit the form to sign in. The sample email addresses retain their original naming.

To reset and populate a **disposable development database**:

```bash
npm run seed
```

**The seed script deletes existing users, skills, projects, requests, and notifications before inserting sample data.** Do not run it against a database containing records you need to keep. The application requires a real MongoDB connection; do not rely on an in-memory fallback.

## Available Commands

Run from the repository root:

| Command | Purpose |
|---|---|
| `npm install` | Install root dependencies |
| `npm run install:all` | Install root, server, and client dependencies |
| `npm run install:server` | Install server dependencies |
| `npm run install:client` | Install client dependencies |
| `npm run dev` | Start frontend and backend together |
| `npm run server` | Start backend with Nodemon |
| `npm run client` | Start Vite development server |
| `npm run build` | Build production frontend |
| `npm test` | Run deployment regression tests |
| `npm run seed` | Reset and populate the configured database |
| `npm --prefix server start` | Start backend without Nodemon |

## API Reference

**Local base:** `http://localhost:5000/api`

**Deployment base:** `https://eduexchange-five.vercel.app/api`

Protected endpoints require `Authorization: Bearer <JWT_TOKEN>`. JSON requests use `Content-Type: application/json`.

### Health and authentication

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/health` | Public | Check that the API process responds; does not prove database availability |
| POST | `/api/auth/signup` | Public | Register a student |
| POST | `/api/auth/login` | Public | Authenticate and issue JWT |
| GET | `/api/auth/me` | Authenticated | Current user |
| POST | `/api/auth/logout` | Public | Logout acknowledgement |

### Users

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/users` | Public | Browse/filter students |
| GET | `/api/users/search?q=alex` | Public | Search names and departments |
| GET | `/api/users/:id` | Public | Student profile |
| GET | `/api/users/dashboard/stats` | Authenticated | Dashboard metrics and recent items |
| PUT | `/api/users/profile` | Authenticated | Update own profile |

### Skills

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/skills` | Public | Search/filter/paginate listings |
| GET | `/api/skills/:id` | Public | Skill details |
| POST | `/api/skills` | Authenticated | Create listing |
| PUT | `/api/skills/:id` | Owner | Edit listing |
| DELETE | `/api/skills/:id` | Owner | Delete listing |

Listing parameters: `search`, `category`, `level`, `page`, `limit`.

Example: `/api/skills?search=react&category=Programming&page=1&limit=12`

### Requests

All request routes require authentication. Action-specific participant checks also apply.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/requests/sent` | Sent requests |
| GET | `/api/requests/received` | Received requests |
| POST | `/api/requests` | Create request |
| PUT | `/api/requests/:id/accept` | Recipient accepts |
| PUT | `/api/requests/:id/reject` | Recipient rejects |
| PUT | `/api/requests/:id/cancel` | Sender cancels |
| PUT | `/api/requests/:id/complete` | Participant completes accepted exchange |
| DELETE | `/api/requests/:id` | Participant removes request |

### Projects

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/projects` | Public | Search/filter projects |
| GET | `/api/projects/:id` | Optional authentication | Project details; owner token adds pending-applicant information |
| POST | `/api/projects` | Authenticated | Create project |
| PUT | `/api/projects/:id` | Owner | Edit project |
| DELETE | `/api/projects/:id` | Owner | Delete project |
| POST | `/api/projects/:id/join` | Authenticated | Apply to join |
| PUT | `/api/projects/:id/members/:requestId/accept` | Owner | Accept applicant |
| PUT | `/api/projects/:id/members/:requestId/reject` | Owner | Reject applicant |

Project listing parameters: `search`, `category`, `status`.

### Notifications

All notification routes require authentication.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/notifications` | Own notifications |
| PUT | `/api/notifications/:id/read` | Mark one as read |
| PUT | `/api/notifications/read-all` | Mark all as read |

### Example skill creation body

```json
{
  "name": "React.js",
  "category": "Programming",
  "level": "Intermediate",
  "description": "Learn components, hooks, routing, and API integration.",
  "wantedSkill": "Figma UI/UX Design",
  "availability": "Weekend evenings"
}
```

### Example error response

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

Database connection failures return a JSON `503` response so the frontend can display a useful error instead of receiving a platform crash page.

## Authentication and Authorization

1. The frontend submits the student's credentials.
2. Express looks up the user and bcrypt compares the password hash.
3. The server issues a JWT.
4. AuthContext maintains user state and stores the token in browser `localStorage`.
5. Axios attaches it to API requests.
6. Backend middleware verifies tokens on protected operations.

Implemented controls include password hashing, omitted password hashes in normal responses, required-field/schema validation, unique emails, protected routes, ownership checks for edits/deletion, and participant checks for request actions.

Tokens currently expire after 30 days. Logout clears the browser token and user state; there is no server-side token revocation list.

## Design System

The interface uses a **retro-modern, neo-brutalist** design: black borders, hard offset shadows, pastel panels, editorial headings, compact badges, and responsive grids.

| Color | Hex | Typical use |
|---|---|---|
| Sky blue | `#5EC0F0` | Outer background |
| Mint green | `#B7DDBD` | Navigation and panels |
| Cream | `#FFF6E4` | Content surfaces |
| Warm yellow | `#FFD447` | Feature cards and branding |
| Soft pink | `#F4B6E6` | Accent panels |
| Peach | `#FFA983` | Decorative shapes |
| Black | `#111111` | Borders, typography, buttons |

The actual SVG favicon is embedded at the top of this README. Its yellow card and `</>` symbol represent learning and technical collaboration.

**Logo asset:** [`client/public/favicon.svg`](./client/public/favicon.svg)

## Vercel Deployment

**Website:** https://eduexchange-five.vercel.app/

The repository uses a standard static frontend plus a Node.js function. `vercel.json` explicitly installs all package dependencies, runs the frontend build, and publishes `client/dist`.

### Routing order

1. `/api` and `/api/*` go to `api/index.js` with the original request path.
2. Existing frontend files (JavaScript, CSS, SVG) are served directly.
3. Other paths, including `/` and `/login`, serve `/index.html` for React Router.

The function imports the Express app without starting a second HTTP listener or auto-seeding data. Database-dependent requests await a shared connection attempt. Failed attempts can be retried on subsequent requests.

### Vercel project settings

| Setting | Value |
|---|---|
| Root Directory | Repository root, not `client` or `server` |
| Framework Preset | Other (`framework: null` in configuration) |
| Install Command | Defined by `vercel.json` |
| Build Command | `npm run build` |
| Output Directory | `client/dist` |

Set production environment variables:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-host>/flexi
JWT_SECRET=<generated-random-secret>
CLIENT_URL=https://eduexchange-five.vercel.app
NODE_ENV=production
VITE_API_URL=/api
```

Use a reachable hosted MongoDB database. Vercel cannot reach MongoDB on your personal computer through `127.0.0.1`. Never expose the database URI or JWT secret through `VITE_` variables.

Deploy the commit containing the current configuration. A redeployment of an older commit retains the old behavior. On the first deployment after configuration changes, disable reuse of the existing build cache.

After deployment, check `/`, `/login`, `/favicon.svg`, `/api/health`, and `/api/skills?limit=1`. Then verify signup/login and a database write. Vercel's “Ready” status and the health endpoint alone do not prove database-backed workflows work.

## Demonstration Walkthrough

1. **Authentication:** Register a student, show the dashboard redirect, log out, and sign back in.
2. **Profile:** Update the student's bio or department and refresh to show persistence.
3. **Skills:** Publish a listing, explain “I can teach” and “I want to learn”, search/filter it, and edit it.
4. **Exchange:** Use two accounts in separate browser profiles. Send, accept, and complete a skill exchange; show the resulting notification and count.
5. **Projects:** Create a project, apply from the other account, and accept the applicant as the owner.
6. **Database:** Show corresponding records and ObjectId relationships in MongoDB Compass.
7. **Code:** Explain a React service call, its Express route/controller, and the associated Mongoose model.

## Verification

### Automated checks

```bash
npm run build
npm test
```

The regression tests check that importing the serverless entry does not start database work, health checks respond independently, data requests wait for MongoDB, failed connections return JSON and can be retried, concurrent connections share an attempt, and deployment routing distinguishes APIs, assets, and frontend pages. Database behavior in these tests is mocked; no existing database records are changed.

### End-to-end checklist

Run against the final submission. These are verification steps, not a claim that every scenario has already passed.

- [ ] Signup creates a record; duplicate email is rejected.
- [ ] Login accepts valid credentials and rejects invalid ones.
- [ ] Logout clears the session; protected routes require authentication.
- [ ] Profile changes survive refresh.
- [ ] Skill create, edit, delete, search, filters, and pagination work.
- [ ] Skill edits and deletion require ownership.
- [ ] Requests appear in sent/received lists and update after actions.
- [ ] Duplicate pending requests are rejected.
- [ ] Accepted exchanges can be completed.
- [ ] Project creation, editing, deletion, join applications, and approval work.
- [ ] Notification read actions update the interface and database.
- [ ] Mobile and desktop layouts remain usable.
- [ ] Homepage and deep links load directly on Vercel.
- [ ] Deployed data APIs return JSON and MongoDB writes persist.

## Troubleshooting

| Problem | What to check |
|---|---|
| Homepage/deep link returns 404 | Deploy the latest root `vercel.json`, use repository Root Directory, and verify SPA fallback. |
| `FUNCTION_INVOCATION_FAILED` | Inspect Vercel runtime logs and confirm the new serverless entry and backend dependencies were deployed. |
| API returns JSON 503 | Check `MONGO_URI`, Atlas credentials/network access, and database reachability. |
| Health works but skills do not | Health tests the API process, not MongoDB. Test `/api/skills?limit=1`. |
| Compass opens but connection fails | Compass is a GUI; MongoDB Server must run or Atlas must be reachable. |
| Demo login fails | Confirm sample accounts exist in the connected database. |
| Live site calls localhost | Use frontend `VITE_API_URL=/api`, then rebuild/redeploy. |
| Port 5000 is occupied | Stop the conflicting process or update both backend port and Vite proxy target. |
| Old interface/config remains online | Check deployed commit, environment, domain assignment, and build cache. |

## Current Scope and Future Improvements

### Current scope

- REST API integration with MongoDB persistence.
- Student accounts, skill listings, requests, projects, and notifications.
- Notification refresh approximately every 15 seconds through polling.
- Dashboard recommendations based on recent listings from other students.
- Learning interests recorded in skill listings; user wanted-skill references are displayed when present.

### Future improvements

- Dedicated wanted-skills management.
- Real-time messaging and notification delivery.
- Session scheduling and calendar integration.
- Ratings and reviews after completed exchanges.
- Personalized skill recommendations.
- Email verification and password recovery.
- End-to-end browser tests.
- Stronger request-state transitions and concurrent team-capacity validation.

## Learning Outcomes

- Designing reusable React components and responsive CSS layouts.
- Managing authentication and UI feedback through Context.
- Building REST endpoints using Express.
- Connecting frontend forms to backend controllers.
- Modeling and querying MongoDB documents with Mongoose.
- Implementing CRUD, search, filtering, pagination, and document references.
- Understanding password hashing, JWT authentication, and ownership checks.
- Configuring environment variables, static hosting, SPA routing, and serverless entry points.
- Inspecting persistent records using MongoDB Compass.

## GitHub About

**Description:** A MERN-stack student platform for exchanging skills, finding learning partners, and collaborating on college projects.

**Website:** https://eduexchange-five.vercel.app/

**Suggested topics:** `react`, `nodejs`, `express`, `mongodb`, `mern-stack`, `skill-exchange`, `student-project`, `vite`.

## Author

**Saksham Wadhankar**

GitHub: [@sakshamwadhankar](https://github.com/sakshamwadhankar)

Repository: [25070521221-CA-03](https://github.com/sakshamwadhankar/25070521221-CA-03)

---

<div align="center">

**Edu Exchange**

*Share Skills. Build Connections. Grow Together.*

</div>
