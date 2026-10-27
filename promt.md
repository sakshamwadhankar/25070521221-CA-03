Build a complete full-stack web application called “FLEXI – Student Skill Exchange Platform”.

The application must be fully functional, not just a static design. Every form, button, page, API endpoint, and database operation must work properly.

TECHNOLOGY STACK:

- Frontend: React.js with Vite, JSX, HTML, and plain CSS
- Backend: Node.js with Express.js
- Database: MongoDB using Mongoose
- Database tool: MongoDB Compass
- Authentication: JWT and bcryptjs
- API communication: Axios
- Routing: React Router
- Do not use TypeScript.
- Do not use Firebase, Supabase, or any external database.
- Do not require Cloudinary, Google OAuth, or paid APIs.

PROJECT STRUCTURE:
Create this structure:

FLEXI/
├── client/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── context/
│ │ ├── services/
│ │ ├── styles/
│ │ ├── App.jsx
│ │ └── main.jsx
│ └── package.json
├── server/
│ ├── src/
│ │ ├── config/
│ │ ├── models/
│ │ ├── controllers/
│ │ ├── routes/
│ │ ├── middleware/
│ │ ├── utils/
│ │ └── server.js
│ ├── .env.example
│ └── package.json
├── README.md
└── package.json

APPLICATION IDEA:
FLEXI allows students to exchange skills with each other. One student can offer to teach a skill, while another student can request to learn it. Students can also create projects and find classmates for collaboration.

BRAND STYLE:

- Modern, attractive, student-focused interface
- Professional but colorful design
- Responsive on mobile, tablet, and desktop
- Use a clean white background with purple, blue, and gradient accents
- Add cards, badges, icons, hover effects, loading animations, and toast messages
- Create a strong landing page with the tagline:
  “Learn together. Build together. Grow together.”
- Use initials or gradient avatars instead of external image uploads.

CREATE THESE 8 MAIN PAGES:

1. LANDING PAGE `/`
   Include:

- FLEXI logo and navigation
- Hero section explaining the platform
- “I can teach” and “I want to learn” explanation
- How FLEXI works in 3 steps
- Featured skills
- Benefits for students
- Call-to-action buttons for Login and Sign Up
- Footer

2. LOGIN PAGE `/login`
   Include:

- Email input
- Password input
- Show/hide password button
- Login button
- Link to Sign Up
- Form validation
- Loading state
- Error messages
- JWT authentication
- Redirect to Dashboard after successful login

3. SIGNUP PAGE `/signup`
   Include:

- Full name
- Email
- Password
- Confirm password
- Department
- Year of study
- Short bio
- Optional initial skills
- Validation for all fields
- Password hashing with bcrypt
- Automatically log the user in after successful registration
- Redirect to Dashboard

4. DASHBOARD PAGE `/dashboard`
   Display:

- Welcome message with the student’s name
- Total skills offered
- Total skills wanted
- Pending received requests
- Pending sent requests
- Active projects
- Recommended skills
- Recent requests
- Quick action buttons:
  - Add Skill
  - Find a Skill
  - Create Project
  - View Requests
- Dashboard data must come from MongoDB through API calls

5. EXPLORE SKILLS PAGE `/skills`
   Include:

- Search bar
- Category filter
- Skill level filter
- Cards showing:
  - Student name
  - Skill offered
  - Skill wanted in exchange
  - Category
  - Skill level
  - Short description
  - Request button
  - View profile button
- Add Skill form
- Edit own skill
- Delete own skill
- Pagination or load-more functionality
- Empty-state message
- All skills must be retrieved from MongoDB

6. PROFILE PAGE `/profile`
   Include:

- Student avatar using initials
- Full name
- Department and year
- Bio
- Skills the student can teach
- Skills the student wants to learn
- Projects joined
- Rating or completed exchange count
- Edit profile button for the logged-in student
- Add/remove offered skills
- Add/remove wanted skills
- Public profile view for other students
- Profile data must be stored and retrieved from MongoDB

7. REQUESTS PAGE `/requests`
   Include separate tabs:

- Received Requests
- Sent Requests
- Accepted Requests
- Rejected Requests
- Completed Requests

Each request must show:

- Sender name
- Receiver name
- Offered skill
- Wanted skill
- Message
- Request type
- Date
- Status badge

Actions:

- Send request
- Accept request
- Reject request
- Cancel request
- Mark as completed
- Prevent duplicate requests
- Update request status in MongoDB
- Create a notification when a request is sent or updated

8. PROJECTS PAGE `/projects`
   Include:

- Browse all student projects
- Search projects
- Filter by category and status
- Project cards with title, description, owner, required skills, deadline, and members
- Create project
- Edit own project
- Delete own project
- View project details
- Request to join project
- Accept or reject project join requests
- Add and remove members
- Project status:
  - Open
  - In Progress
  - Completed
- Project categories:
  - Academic
  - Hackathon
  - Research
  - Technical
  - Creative
  - Social
- Project details can open as a modal or separate dynamic page

DATABASE COLLECTIONS:

1. USERS COLLECTION:
   Fields:

- \_id
- name
- email
- passwordHash
- department
- year
- bio
- avatarInitials
- offeredSkills: array of skill IDs
- wantedSkills: array of skill IDs
- completedExchanges
- createdAt
- updatedAt

2. SKILLS COLLECTION:
   Fields:

- \_id
- name
- category
- level
- description
- offeredBy: user ID
- wantedSkill
- availability
- createdAt
- updatedAt

Skill categories:

- Programming
- Design
- Business
- Communication
- Languages
- Music
- Sports
- Academics
- Other

Skill levels:

- Beginner
- Intermediate
- Advanced
- Expert

3. PROJECTS COLLECTION:
   Fields:

- \_id
- title
- description
- category
- owner
- requiredSkills
- members
- maxMembers
- deadline
- status
- createdAt
- updatedAt

4. REQUESTS COLLECTION:
   Fields:

- \_id
- sender
- receiver
- requestType: “skill-exchange” or “project-join”
- skillId
- projectId
- offeredSkill
- wantedSkill
- message
- status: “pending”, “accepted”, “rejected”, “cancelled”, “completed”
- createdAt
- updatedAt

5. NOTIFICATIONS COLLECTION:
   Fields:

- \_id
- user
- title
- message
- type
- relatedRequest
- isRead
- createdAt

BACKEND API REQUIREMENTS:

Authentication:

- POST `/api/auth/signup`
- POST `/api/auth/login`
- GET `/api/auth/me`
- POST `/api/auth/logout`

Users:

- GET `/api/users/:id`
- PUT `/api/users/profile`
- GET `/api/users`
- GET `/api/users/search`

Skills:

- GET `/api/skills`
- GET `/api/skills/:id`
- POST `/api/skills`
- PUT `/api/skills/:id`
- DELETE `/api/skills/:id`

Requests:

- GET `/api/requests/sent`
- GET `/api/requests/received`
- POST `/api/requests`
- PUT `/api/requests/:id/accept`
- PUT `/api/requests/:id/reject`
- PUT `/api/requests/:id/cancel`
- PUT `/api/requests/:id/complete`
- DELETE `/api/requests/:id`

Projects:

- GET `/api/projects`
- GET `/api/projects/:id`
- POST `/api/projects`
- PUT `/api/projects/:id`
- DELETE `/api/projects/:id`
- POST `/api/projects/:id/join`
- PUT `/api/projects/:id/members/:requestId/accept`
- PUT `/api/projects/:id/members/:requestId/reject`

Notifications:

- GET `/api/notifications`
- PUT `/api/notifications/:id/read`
- PUT `/api/notifications/read-all`

BACKEND SECURITY:

- Hash passwords using bcryptjs
- Use JWT authentication
- Protect all private routes
- Never return passwordHash to the frontend
- Validate all request bodies
- Check ownership before edit/delete operations
- Prevent duplicate skill exchange requests
- Prevent duplicate project membership
- Use CORS correctly
- Use dotenv for environment variables
- Add proper error-handling middleware
- Return clean JSON responses

ENVIRONMENT VARIABLES:

Server `.env.example`:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/flexi
JWT_SECRET=replace_with_a_secure_secret
CLIENT_URL=http://localhost:5173

Frontend `.env.example`:

VITE_API_URL=http://localhost:5000/api

FRONTEND REQUIREMENTS:

- Create reusable Navbar, Sidebar, SkillCard, ProjectCard, RequestCard, Modal, Button, Input, Loader, EmptyState, Toast, and ProtectedRoute components.
- Store JWT securely for this student project.
- Maintain login state using AuthContext.
- Automatically redirect unauthenticated users to `/login`.
- Automatically redirect authenticated users away from login/signup.
- Show loading states during API requests.
- Show clear success and error messages.
- Refresh displayed data after create, update, delete, accept, or reject actions.
- Never leave buttons without functionality.
- Do not use hardcoded fake data after backend integration.
- All displayed skills, users, projects, and requests must come from MongoDB.

SEED DATA:
Create a seed script that inserts:

- 8 demo students
- 20 skills
- 6 projects
- 10 skill exchange requests
- 5 notifications

Create demo accounts such as:

Email: alex@flexi.com
Password: Demo123

Email: riya@flexi.com
Password: Demo123

Document how to run the seed script.

ROOT COMMANDS:
The project should support:

- `npm install`
- `npm run install:all`
- `npm run dev`
- `npm run server`
- `npm run client`
- `npm run seed`

Use concurrently so the frontend and backend can be started together with:

`npm run dev`

README REQUIREMENTS:
Create a clear README containing:

- Project description
- Features
- Technology stack
- Folder structure
- MongoDB setup using MongoDB Compass
- Environment variable setup
- Installation steps
- How to run frontend and backend
- API route list
- Demo login credentials
- Database collection details
- Common troubleshooting steps

IMPORTANT IMPLEMENTATION RULES:

- Build the complete working application, not only the UI.
- Connect every frontend form to the backend.
- Store and retrieve all data from MongoDB.
- Do not use placeholder buttons.
- Do not use fake JSON data after the API is created.
- Do not skip authentication.
- Do not skip validation.
- Do not delete existing useful files without checking them first.
- If the repository already contains files, inspect them and integrate safely.
- Keep the implementation simple enough to run locally on Windows.
- Avoid unnecessary external services.
- Use clean, readable, beginner-friendly code.

FINAL VERIFICATION:
After implementation:

1. Install all dependencies.
2. Start MongoDB connection.
3. Start the backend.
4. Start the frontend.
5. Test signup.
6. Test login.
7. Test profile update.
8. Test creating, editing, and deleting a skill.
9. Test searching and filtering skills.
10. Test sending and accepting a request.
11. Test creating and joining a project.
12. Test dashboard statistics.
13. Test logout and protected routes.
14. Fix all errors before finishing.

At the end, provide:

- Complete file structure
- Commands to run the project
- MongoDB Compass connection instructions
- Demo login credentials
- List of implemented pages
- List of implemented API endpoints
- Confirmation that frontend, backend, and MongoDB are connected.
