# EDU EXCHANGE – Student Skill Exchange Platform

> **“Share Skills. Build Connections. Grow Together.”**

**Edu Exchange** is a full-stack student-to-student skill exchange and collaborative project platform designed specifically for college and university campuses. Featuring a retro-modern, neo-brutalist editorial design system inspired by academic design panels, Edu Exchange empowers students to trade knowledge 1-on-1 (e.g., swapping React coding skills for UI/UX Figma design) and form project teams for hackathons, capstones, and campus research.

---

## 📌 Repository Information
- **Repository Name**: `25070521221-CA-03`
- **Platform**: EDU EXCHANGE
- **Architecture**: MERN (React + Express + Node.js + MongoDB)
- **Design System**: Neo-Brutalist Editorial (Sky Blue, Mint Green, Cream, Warm Yellow, Soft Pink, Peach, Hard Black Shadows)
- **Deployment Ready**: Local (Windows/Mac/Linux) & Vercel Ready

---

## 🚀 Key Features

### 1. 🎓 Landing Page (`/`)
- Modern, vibrant hero section with the tagline: *“Learn together. Build together. Grow together.”*
- Interactive **“I Can Teach”** vs. **“I Want to Learn”** visual breakdown.
- 3-step explanation of how peer exchanges work.
- Live featured skills retrieved dynamically from MongoDB.
- Student benefits (Peer speed, hackathon squads, portfolio credibility, and campus network).
- Responsive navigation and call-to-actions.

### 2. 🔐 Student Authentication & Security (`/login`, `/signup`)
- Student registration with full name, university email, department, year of study, bio, and initial skill listing.
- Password hashing with **bcryptjs** (10 salt rounds).
- **JWT (JSON Web Token)** authentication stored securely on the client.
- Password visibility toggles (eye icons) and comprehensive field validation.
- **1-Click Demo Login** shortcuts for instant testing as demo students (*Alex Rivera* or *Riya Sharma*).
- Auto-redirect away from auth pages when logged in; auto-redirect to `/login` for protected pages.

### 3. 📊 Interactive Student Dashboard (`/dashboard`)
- Personalized welcome banner showing student name, department, year, and dynamic avatar initials.
- **6 Real-Time Metric Cards**:
  - Total Skills Offered
  - Total Skills Wanted
  - Pending Received Requests
  - Pending Sent Requests
  - Active Projects
  - Completed Peer Exchanges
- Quick Action Buttons: **Add Skill**, **Find a Skill**, **Create Project**, and **View Requests**.
- Recommended skills section tailored from other students.
- Recent exchange requests with one-click **Accept** and **Decline** actions.
- List of current active project teams.

### 4. 💡 Explore Skills Marketplace (`/skills`)
- Live search by skill name, description, or keyword.
- Category filters: *Programming, Design, Business, Communication, Languages, Music, Sports, Academics, Other*.
- Skill level filter: *Beginner, Intermediate, Advanced, Expert*.
- Informative cards displaying the teacher's profile, skill description, and what they want in exchange.
- **Request Exchange** modal to send custom proposals.
- **Add**, **Edit**, and **Delete** actions for own skills.
- Load-more pagination and friendly empty-state handling.

### 5. 👤 Comprehensive Student Profile (`/profile`, `/profile/:id`)
- Colorful initials avatar generated deterministically based on student name.
- Academic details (Department, Year of Study, Email, Bio).
- Counter for completed exchanges.
- Tabular display of skills the student can teach and projects joined.
- **Edit Profile** modal to update name, department, year, and bio.
- **Public Profile View**: Visiting `/profile/:id` allows any student to view classmates' skills and propose a trade.

### 6. 🤝 Exchange Requests Management (`/requests`)
- **5 Filterable Status Tabs**:
  1. *Received Requests* (with unread badge counter)
  2. *Sent Requests*
  3. *Accepted Requests*
  4. *Rejected Requests*
  5. *Completed Exchanges*
- Full request lifecycle: **Send**, **Accept**, **Decline**, **Cancel**, and **Mark as Completed**.
- Prevents duplicate pending requests between students.
- Automatically creates notifications when requests are sent or updated.

### 7. 🚀 Student Project Squads (`/projects`)
- Browse student collaboration projects (Hackathon teams, study groups, research, capstones).
- Filter by category (*Technical, Academic, Hackathon, Research, Creative, Social*) and status (*Open, In Progress, Completed*).
- Detailed project view modal displaying description, required skill tags, deadline, and member roster.
- **Join Project** workflow: students can apply with a custom intro note.
- **Project Lead Controls**: owners can review, accept, or decline applicant join requests.

### 8. 🔔 Notification System
- Real-time notification bell dropdown in navigation bar.
- Shows alerts when classmates send requests or accept applications.
- Unread badge counter with *“Mark all as read”* functionality.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18 (Vite), React Router v6, Axios, Vanilla CSS (Flexbox & CSS Grid) |
| **Backend** | Node.js, Express.js, CORS, Dotenv |
| **Database** | MongoDB with Mongoose ODM |
| **Database Tool** | MongoDB Compass |
| **Authentication** | JWT (jsonwebtoken) & bcryptjs |
| **Deployment** | Vercel configuration (`vercel.json`) & Concurrently for local dev |

---

## 📂 Project Structure

```
25070521221-CA-03/
├── client/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Avatar.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── RequestCard.jsx
│   │   │   └── SkillCard.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ExploreSkills.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Requests.jsx
│   │   │   └── Signup.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── notificationService.js
│   │   │   ├── projectService.js
│   │   │   ├── requestService.js
│   │   │   ├── skillService.js
│   │   │   └── userService.js
│   │   ├── styles/
│   │   │   ├── components.css
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── notificationController.js
│   │   │   ├── projectController.js
│   │   │   ├── requestController.js
│   │   │   ├── skillController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── Notification.js
│   │   │   ├── Project.js
│   │   │   ├── Request.js
│   │   │   ├── Skill.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── notificationRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   ├── requestRoutes.js
│   │   │   ├── skillRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── utils/
│   │   │   ├── avatar.js
│   │   │   ├── generateToken.js
│   │   │   └── seed.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── api/
│   └── index.js
├── vercel.json
├── package.json
└── README.md
```

---

## 🗄️ Database Collections (MongoDB)

1. **`users`**:
   - `name`, `email`, `passwordHash`, `department`, `year`, `bio`, `avatarInitials`, `offeredSkills`, `wantedSkills`, `completedExchanges`, `createdAt`, `updatedAt`
2. **`skills`**:
   - `name`, `category`, `level`, `description`, `offeredBy` (ref: User), `wantedSkill`, `availability`, `createdAt`, `updatedAt`
3. **`projects`**:
   - `title`, `description`, `category`, `owner` (ref: User), `requiredSkills`, `members` ([ref: User]), `maxMembers`, `deadline`, `status`, `createdAt`, `updatedAt`
4. **`requests`**:
   - `sender` (ref: User), `receiver` (ref: User), `requestType` (`skill-exchange` | `project-join`), `skillId`, `projectId`, `offeredSkill`, `wantedSkill`, `message`, `status` (`pending`, `accepted`, `rejected`, `cancelled`, `completed`), `createdAt`, `updatedAt`
5. **`notifications`**:
   - `user` (ref: User), `title`, `message`, `type`, `relatedRequest`, `isRead`, `createdAt`

---

## 🧭 MongoDB Compass Connection Instructions

1. Open **MongoDB Compass**.
2. In the connection string field, paste:
   ```
   mongodb://127.0.0.1:27017
   ```
3. Click **Connect**.
4. You will see the database named `flexi` with the 5 collections (`users`, `skills`, `projects`, `requests`, `notifications`).
5. You can inspect documents, add queries, or modify data in real-time.

> **Zero-Setup Fallback**: If you run the project without MongoDB Compass active, the server automatically starts an in-memory database instance so that development and testing never crash!

---

## 🔑 Demo Login Credentials

The database seeder pre-populates **8 demo students** across multiple college majors. All demo accounts use the password: `Demo123`.

| Student Name | Email Address | Password | Major / Department | Role / Specialty |
|---|---|---|---|---|
| **Alex Rivera** | `alex@flexi.com` | `Demo123` | Computer Science (3rd Yr) | React.js & Node.js Mentor |
| **Riya Sharma** | `riya@flexi.com` | `Demo123` | Information Tech (2nd Yr) | Figma UI/UX Designer |
| **Marcus Chen** | `marcus@flexi.com` | `Demo123` | Computer Science (4th Yr) | Algorithms & C++ Tutor |
| **Priya Patel** | `priya@flexi.com` | `Demo123` | Electronics & Comm (3rd Yr) | Arduino & IoT Hardware |
| **David Kim** | `david@flexi.com` | `Demo123` | Business Admin (2nd Yr) | Pitch Decks & Finance |
| **Sarah Johnson** | `sarah@flexi.com` | `Demo123` | Linguistics (1st Yr) | Conversational Spanish |
| **Liam Wilson** | `liam@flexi.com` | `Demo123` | Mechanical Eng (3rd Yr) | 3D Modeling with Blender |
| **Ananya Gupta** | `ananya@flexi.com` | `Demo123` | Data Science (4th Yr) | Machine Learning & Python |

> **Pro-Tip**: On the `/login` page, you can click the quick-fill buttons (`Alex` or `Riya`) to sign in with a single click!

---

## ⚙️ Environment Variables

### Server (`server/.env`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/flexi
JWT_SECRET=flexi_secret_key_student_platform_2026_super_secure
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 💻 Installation & Setup

### 1. Install All Dependencies
From the root folder, run:
```bash
npm run install:all
```
*(Or install individually: `npm install`, `cd server && npm install`, `cd client && npm install`)*

### 2. Seed Demo Data
Populate MongoDB with 8 students, 20 skills, 6 projects, 10 requests, and 5 notifications:
```bash
npm run seed
```

### 3. Start Frontend & Backend Simultaneously
```bash
npm run dev
```
- **Backend API**: `http://localhost:5000/api/health`
- **Frontend App**: `http://localhost:5173`

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/signup` - Register a student account
- `POST /api/auth/login` - Sign in and receive JWT token
- `GET /api/auth/me` - Get logged-in student profile (Protected)
- `POST /api/auth/logout` - Sign out

### Users (`/api/users`)
- `GET /api/users` - Get list of students (filter by department/year)
- `GET /api/users/search?q=` - Search students
- `GET /api/users/dashboard/stats` - Personalized metrics & recommended skills (Protected)
- `GET /api/users/:id` - Get public profile of a student
- `PUT /api/users/profile` - Update student profile (Protected)

### Skills (`/api/skills`)
- `GET /api/skills` - Browse skills (search, category, level, pagination)
- `GET /api/skills/:id` - Get skill by ID
- `POST /api/skills` - Add new skill listing (Protected)
- `PUT /api/skills/:id` - Edit own skill listing (Protected)
- `DELETE /api/skills/:id` - Delete own skill listing (Protected)

### Requests (`/api/requests`)
- `GET /api/requests/sent` - Get outgoing exchange requests (Protected)
- `GET /api/requests/received` - Get incoming exchange requests (Protected)
- `POST /api/requests` - Send new exchange request (Protected)
- `PUT /api/requests/:id/accept` - Accept incoming request (Protected)
- `PUT /api/requests/:id/reject` - Decline incoming request (Protected)
- `PUT /api/requests/:id/cancel` - Cancel sent request (Protected)
- `PUT /api/requests/:id/complete` - Mark exchange as completed (Protected)
- `DELETE /api/requests/:id` - Remove request (Protected)

### Projects (`/api/projects`)
- `GET /api/projects` - Browse projects (filter by category, status, search)
- `GET /api/projects/:id` - Get project details & pending applicants (Protected)
- `POST /api/projects` - Create project (Protected)
- `PUT /api/projects/:id` - Update project (Protected)
- `DELETE /api/projects/:id` - Delete project (Protected)
- `POST /api/projects/:id/join` - Apply to join project (Protected)
- `PUT /api/projects/:id/members/:requestId/accept` - Accept applicant (Protected)
- `PUT /api/projects/:id/members/:requestId/reject` - Decline applicant (Protected)

### Notifications (`/api/notifications`)
- `GET /api/notifications` - Get user notifications (Protected)
- `PUT /api/notifications/:id/read` - Mark single notification as read (Protected)
- `PUT /api/notifications/read-all` - Mark all notifications as read (Protected)

---

## ☁️ Deploying to Vercel

1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: FLEXI Student Skill Exchange Platform complete"
   git push -u origin master
   ```
2. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository (`25070521221-CA-03`).
4. Set the Environment Variables in the Vercel Dashboard:
   - `MONGO_URI`: Your MongoDB Atlas connection string (e.g. `mongodb+srv://<user>:<password>@cluster.mongodb.net/flexi`)
   - `JWT_SECRET`: Any secure random string
   - `CLIENT_URL`: Your Vercel production URL
5. Click **Deploy**! Vercel uses `vercel.json` to automatically build the client and serve the API.

### Homepage or refreshed pages return `404 NOT_FOUND`

If `/index.html` and `/api/health` load but `/` or `/login` return 404,
the frontend service needs a single-page application fallback. The `client`
service in `vercel.json` first serves existing files (JavaScript, CSS, and
images), then serves `/index.html` for React Router pages. `/api/*` is routed
separately to the server service.

Deploy the commit containing this configuration; redeploying an older commit
will retain the old routing. Keep Vercel's Root Directory at the repository
root, where `vercel.json`, `client`, and `server` are located. After deployment,
check `/`, `/login`, a refreshed `/skills` page, and `/api/health`.

---

## 🛠️ Common Troubleshooting

1. **Port 5000 Already in Use?**
   - Change `PORT=5001` in `server/.env` and `VITE_API_URL=http://localhost:5001/api` in `client/.env`.
2. **MongoDB Connection Warning?**
   - Make sure MongoDB Compass or `mongod` is running. If not, the application uses an automatic in-memory MongoDB fallback for testing.
3. **CORS Error?**
   - Ensure the server is running on port 5000 and client on 5173. The backend is configured to accept requests from localhost:5173 and Vite proxy.
