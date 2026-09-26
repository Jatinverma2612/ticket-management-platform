# 🎫 Ticket Management Platform

A full-stack, role-based ticket management platform built using React, Node.js, Express.js and MongoDB.

The platform allows users to raise and track support tickets, administrators to review and assign tickets, and engineers to manage, comment on and resolve assigned tickets.

---

## 🌐 Live Demo

**Frontend:** https://ticket-management-platform-lake.vercel.app

**Backend API:** https://ticket-management-platform.onrender.com

**GitHub Repository:** https://github.com/Jatinverma2612/ticket-management-platform

---

## 📌 Project Overview

Ticket Management Platform is a role-based support ticket management system designed around three main user roles:

- **User** — Creates and tracks support tickets.
- **Admin** — Manages tickets, assigns engineers and oversees the platform.
- **Engineer** — Handles assigned tickets, communicates with users and resolves tickets.

The application implements:

- Authentication
- Role-based authorization
- Ticket creation and management
- Ticket assignment
- Ticket status lifecycle
- Priority management
- Comments and conversations
- Activity history
- Role-specific dashboards
- Search and filtering
- Engineer management
- Responsive UI
- Error and validation handling

---

## ✨ Features

### 👤 User Features

- Secure user registration
- Secure login
- Create support tickets
- Add ticket title
- Add issue description
- Select ticket category
- Select ticket priority
- View own tickets
- Search and filter tickets
- View complete ticket details
- Track ticket status
- View assigned engineer
- View comments
- Add comments
- View ticket activity/history
- Responsive user dashboard
- User profile

### 👨‍💼 Admin Features

- Secure admin login
- Admin dashboard
- View all tickets
- Search tickets
- Filter tickets by:
  - Status
  - Priority
  - Category
  - Assignee
- View complete ticket details
- Assign tickets to engineers
- Reassign tickets
- Update ticket priority
- Update ticket status where permitted
- View engineer directory
- View engineer availability
- View users
- Monitor ticket activity
- View incoming user comments
- Dashboard statistics
- Ticket status metrics
- Team workload information

### 👨‍💻 Engineer Features

- Secure engineer login
- Engineer dashboard
- View assigned tickets
- View ticket details
- View ticket history
- Update assigned ticket status
- Add technical comments
- Add resolution notes
- Mark tickets as resolved
- View incoming user comments
- View engineer profile
- Manage availability information

---

## 🔄 Ticket Lifecycle

The primary ticket lifecycle is:

```text
Open
  ↓
Assigned
  ↓
In Progress
  ↓
Resolved
  ↓
Closed
```

The backend validates status transitions according to the user's role and the current ticket state.

---

## 🔐 Authentication & Authorization

The application uses:

- JWT-based authentication
- bcrypt password hashing
- Protected frontend routes
- Role-based route protection
- Backend authentication middleware
- Backend role authorization middleware

### Authentication Flow

```text
User enters email + password
            ↓
       POST /auth/login
            ↓
Backend validates credentials
            ↓
     JWT token generated
            ↓
JWT stored in localStorage
            ↓
User state updated
            ↓
Role-specific dashboard
```

The frontend sends the JWT with protected API requests using:

```
Authorization: Bearer <token>
```

The backend verifies the token before allowing access to protected APIs.

Users are prevented from accessing admin and engineer-only screens and APIs.

Unauthorized role access attempts are redirected to the appropriate dashboard.

### 🔁 Session Restoration

When the application loads:

```text
Application starts
       ↓
Check localStorage for JWT
       ↓
Token exists?
   ↙          ↘
 Yes           No
  ↓             ↓
/auth/me      Login page
  ↓
Validate token
  ↓
Restore user session
```

If the token is invalid or expired, the authentication state is cleared and the user is redirected to login.

### 🚪 Logout Flow

When the user logs out:

```text
Logout
  ↓
Remove JWT from localStorage
  ↓
Reset authentication state
  ↓
Redirect to /login
```

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Tailwind CSS
- Axios
- Lucide React
- React Hot Toast
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

### Deployment
- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database

---

## 🗂️ Project Structure

```text
Ticket-Management-Platform/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   └── tickets/
│   │   │
│   │   ├── context/
│   │   │
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── engineer/
│   │   │   ├── public/
│   │   │   └── user/
│   │   │
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── vercel.json
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── ticketController.js
│   │   │   ├── commentController.js
│   │   │   └── userController.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── roleMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Ticket.js
│   │   │   ├── Comment.js
│   │   │   └── TicketActivity.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── ticketRoutes.js
│   │   │   ├── commentRoutes.js
│   │   │   └── userRoutes.js
│   │   │
│   │   ├── utils/
│   │   │   ├── generateToken.js
│   │   │   └── seed.js
│   │   │
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## 🗄️ Database Design

MongoDB is used as the primary database with Mongoose for data modeling.

### User
Stores: Name, Email, Password hash, Role, Availability status, Created/updated timestamps.

Supported roles: `user`, `admin`, `engineer`

### Ticket
Stores: Title, Description, Category, Priority, Status, Created by, Assigned engineer, Created/updated timestamps.

Supported priorities: `Low`, `Medium`, `High`

Supported statuses: `Open`, `Assigned`, `In Progress`, `Resolved`, `Closed`

### Comment
Stores: Ticket reference, User reference, Message, Created/updated timestamps.

Comments allow users, engineers and administrators to communicate around a ticket.

### Ticket Activity
Stores ticket history including actions such as:

- Ticket creation
- Assignment
- Reassignment
- Status changes
- Priority changes
- Other ticket updates

This provides an audit-style activity timeline for tickets.

---

## 👤 User Workflow

```text
User Login
    ↓
User Dashboard
    ↓
Create Ticket
    ↓
Enter Ticket Details
    ↓
Ticket Created
    ↓
Ticket Status = Open
    ↓
Admin Reviews Ticket
    ↓
Admin Assigns Engineer
    ↓
Ticket Status = Assigned
    ↓
Engineer Works on Ticket
    ↓
Ticket Status = In Progress
    ↓
Engineer Adds Resolution
    ↓
Ticket Status = Resolved
    ↓
Admin Closes Ticket
    ↓
Ticket Status = Closed
```

### Detailed User Flow

1. User logs in using their credentials.
2. User is redirected to the User Dashboard.
3. Dashboard displays ticket metrics such as: Total, Open, In Progress, Resolved.
4. User clicks Create Ticket.
5. User enters: Title, Category, Priority, Description.
6. Ticket is submitted and persisted in MongoDB.
7. The newly created ticket starts with the Open status.
8. User is redirected to the ticket details page.
9. User can view: Ticket information, Current status, Assigned engineer, Comments, Activity history.
10. User can add comments to communicate about the issue.
11. User can track the ticket until it is resolved and closed.

---

## 👨‍💼 Admin Workflow

```text
Admin Login
     ↓
Admin Dashboard
     ↓
View All Tickets
     ↓
Search / Filter
     ↓
Open Ticket Details
     ↓
Assign Engineer
     ↓
Ticket Status = Assigned
     ↓
Monitor Progress
     ↓
Ticket Status = Resolved
     ↓
Close Ticket
     ↓
Ticket Status = Closed
```

### Detailed Admin Flow

1. Admin logs in using the admin account.
2. Admin is redirected to the Admin Dashboard.
3. Dashboard displays ticket metrics across: Open, Assigned, In Progress, Resolved, Closed.
4. Admin opens the ticket management queue.
5. Admin can search and filter tickets by: Status, Priority, Category, Assignee.
6. Admin opens a ticket to view complete details.
7. Admin selects an available engineer.
8. Engineer assignment is saved to the ticket.
9. Ticket moves from Open to Assigned.
10. Assignment activity is recorded.
11. Admin can update ticket priority.
12. Admin can monitor comments and ticket activity.
13. Once the engineer resolves the ticket, admin can close it.
14. Ticket moves from Resolved to Closed.

---

## 👨‍💻 Engineer Workflow

```text
Engineer Login
      ↓
Engineer Dashboard
      ↓
View Assigned Tickets
      ↓
Open Ticket
      ↓
Review Details & History
      ↓
Start Investigation
      ↓
Status = In Progress
      ↓
Add Technical Comments
      ↓
Add Resolution Notes
      ↓
Mark as Resolved
      ↓
Status = Resolved
```

### Detailed Engineer Flow

1. Engineer logs in using engineer credentials.
2. Engineer is redirected to the Engineer Dashboard.
3. Dashboard displays tickets assigned to that engineer.
4. Engineer can view counters for: Assigned, In Progress, Resolved.
5. Engineer opens an assigned ticket.
6. Engineer reviews: Ticket details, Priority, User information, Ticket history, Existing comments.
7. If the ticket is Assigned, engineer can start investigation.
8. Status changes to In Progress.
9. Engineer can add technical comments.
10. Engineer can add resolution notes.
11. Engineer marks the ticket as resolved.
12. Status changes to Resolved.

---

## 💬 Comments & Activity

The platform maintains both ticket conversations and activity history.

### Comments

Users, admins and engineers can communicate through ticket comments according to their access permissions.

Comments include: Author, Ticket, Message, Timestamp.

### Activity Timeline

Ticket activity records important ticket changes such as:

- Ticket creation
- Engineer assignment
- Engineer reassignment
- Priority changes
- Status changes
- Other ticket updates

This provides an audit-style timeline for each ticket.

### 🔎 Comments Inbox

The platform also provides a role-specific comments inbox.

- **Admin** — can view incoming user comments across the platform.
- **Engineer** — can view incoming user comments on tickets assigned to them.

Only user comments are counted as incoming comments for the inbox notification.

---

## 🛣️ Application Routes

### Public Routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Platform landing page |
| `/login` | Public | Login page |
| `/register` | Public | User registration |

### User Routes

| Path | Access | Description |
|------|--------|-------------|
| `/user/dashboard` | User | User dashboard |
| `/user/tickets` | User | User's tickets |
| `/user/tickets/new` | User | Create ticket |
| `/user/tickets/:id` | User | Ticket details |
| `/user/profile` | User | User profile |

### Admin Routes

| Path | Access | Description |
|------|--------|-------------|
| `/admin/dashboard` | Admin | Admin dashboard |
| `/admin/tickets` | Admin | All tickets |
| `/admin/tickets/:id` | Admin | Ticket administration |
| `/admin/engineers` | Admin | Engineer directory |
| `/admin/users` | Admin | User management |
| `/admin/comments` | Admin | Incoming comments |

### Engineer Routes

| Path | Access | Description |
|------|--------|-------------|
| `/engineer/dashboard` | Engineer | Engineer dashboard |
| `/engineer/tickets/:id` | Engineer | Assigned ticket details |
| `/engineer/profile` | Engineer | Engineer profile |
| `/engineer/comments` | Engineer | Incoming comments |

Unauthorized users are redirected away from role-specific routes.

---

## 🔌 API Endpoints

The backend API is available under `/api`

### Health Check
```
GET /api/health
```

### Authentication
```
POST /api/auth/register     # Register
POST /api/auth/login        # Login
GET  /api/auth/me           # Current User
```

### Tickets
```
GET   /api/tickets                        # Get Tickets
GET   /api/tickets/:id                    # Get Ticket
POST  /api/tickets                        # Create Ticket
PATCH /api/tickets/:id/assign             # Assign Ticket
PATCH /api/tickets/:id/status             # Update Status
PATCH /api/tickets/:id/priority           # Update Priority
GET   /api/tickets/:ticketId/activities   # Get Ticket Activities
GET   /api/tickets/:ticketId/comments     # Get Ticket Comments
POST  /api/tickets/:ticketId/comments     # Add Comment
GET   /api/tickets/comments/inbox         # Comments Inbox
```

The backend automatically scopes the returned tickets according to the authenticated user's role.

### Engineers
```
GET /api/users/engineers    # Get Engineers
```

---

## ⚙️ Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Jatinverma2612/ticket-management-platform.git
cd ticket-management-platform
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm start
```

Backend will run on: `http://localhost:5000`

API base URL: `http://localhost:5000/api`

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 🌱 Database Seeding

The project includes a development seed script for creating demo users and sample data.

From the backend directory:

```bash
node src/utils/seed.js
```

The seed script creates demo accounts for: Admin, Engineers, User. It also creates sample ticket/activity data.

> ⚠️ **Warning:** The seed script clears existing application data before recreating the demo dataset. Do not run it against a database containing data that you want to keep.

---

## 🔑 Demo Credentials

### Admin
- **Email:** admin@example.com
- **Password:** AdminPassword123!

### Engineer 1
- **Email:** engineer1@example.com
- **Password:** EngineerPassword123!

### Engineer 2
- **Email:** engineer2@example.com
- **Password:** EngineerPassword123!

### User
- **Email:** user@example.com
- **Password:** UserPassword123!

These accounts are intended for evaluation/demo purposes.

---

## 🔐 Environment Variables

### Backend

Create `backend/.env`:

```env
PORT=
MONGO_URI=
JWT_SECRET=
FRONTEND_URL=
```

| Variable | Description |
|----------|-------------|
| `PORT` | Port used by the Express server |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used to sign and verify JWT tokens |
| `FRONTEND_URL` | Production frontend URL used for CORS |

### Frontend

Create `frontend/.env`:

```env
VITE_API_URL=
```

Example:

```env
VITE_API_URL=https://ticket-management-platform.onrender.com/api
```

---

## 🚀 Deployment

### Frontend — Vercel

The React frontend is deployed using Vercel.

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Production environment variable:** `VITE_API_URL=https://ticket-management-platform.onrender.com/api`

The project includes a `vercel.json` rewrite configuration to support React Router routes after deployment.

### Backend — Render

The Node.js/Express backend is deployed using Render.

- **Backend root directory:** `backend`
- **Build command:** `npm install`
- **Start command:** `npm start`

Required environment variables:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
FRONTEND_URL=https://ticket-management-platform-lake.vercel.app
```

Render automatically provides the production `PORT`.

### Database — MongoDB Atlas

MongoDB Atlas is used as the production database.

The backend connects to MongoDB using `MONGO_URI`. The database connection is handled through the backend configuration layer.

---

## 🌍 Production Architecture

```text
                   ┌──────────────────────┐
                   │       User           │
                   │ Browser / Mobile     │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │       Vercel         │
                   │   React Frontend     │
                   └──────────┬───────────┘
                              │
                         HTTPS / API
                              │
                              ▼
                   ┌──────────────────────┐
                   │       Render         │
                   │ Node + Express API   │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │    MongoDB Atlas     │
                   │      Database        │
                   └──────────────────────┘
```

---

## 🛡️ Security Considerations

The project follows several security practices:

- Passwords are hashed using bcrypt.
- Authentication is handled using JWT.
- Protected APIs require authentication.
- Role-based middleware protects admin and engineer APIs.
- Users cannot access other users' ticket data.
- Engineers can only work with tickets assigned to them.
- Sensitive environment variables are not committed to Git.
- `.env` files are excluded using `.gitignore`.
- MongoDB credentials are stored through environment variables.
- CORS is configured using the frontend environment URL.

---

## ✅ Validation & Error Handling

The application includes:

- Form validation
- Authentication error handling
- API error handling
- Loading states
- Empty states
- Success notifications
- Error notifications
- Protected route handling
- Invalid/expired token handling
- Backend validation for ticket status transitions

---

## 📱 Responsive UI

The interface is designed to work across: Desktop, Laptop, Tablet, Mobile.

The application provides separate dashboard experiences for: User, Admin, Engineer.

The UI includes:

- Responsive navigation
- Sidebar navigation
- Status badges
- Dashboard cards
- Ticket tables
- Ticket detail views
- Activity timelines
- Comment sections
- Empty states
- Loading states
- Error feedback

---

## 📊 Dashboard Metrics

### User Dashboard
- Total tickets
- Open tickets
- In-progress tickets
- Resolved tickets

### Admin Dashboard
- Open
- Assigned
- In Progress
- Resolved
- Closed

### Engineer Dashboard
- Assigned
- In Progress
- Resolved

---

## 🧩 Code Organization

### Frontend
- Components
- Pages
- Context
- Routes
- Services
- Utilities

### Backend
- Routes
- Controllers
- Middleware
- Models
- Database configuration
- Utilities

This keeps frontend, backend and database responsibilities clearly separated and makes the application easier to maintain.

---

## 🧪 Verification

The application was verified through:

- Frontend production build
- Backend health check
- Authentication testing
- Protected API testing
- Role-based access testing
- Ticket creation
- Ticket assignment
- Status transitions
- Comment functionality
- Activity history
- Production deployment testing

Frontend production build:

```bash
npm run build
```

Backend health endpoint:

```
GET /api/health
```

Expected response: `200 OK`

---

## 📝 Assumptions

- The platform uses three roles: user, admin, and engineer.
- New public registrations create regular user accounts.
- Admin and engineer accounts are managed accounts.
- Engineers can update tickets assigned to them.
- Admins control ticket assignment and closing.
- The primary ticket lifecycle is: Open → Assigned → In Progress → Resolved → Closed.
- The seed script is intended for development/evaluation use and should not be run against production data that must be preserved.

---

## 🎯 Assignment Requirements Covered

The implementation covers the core requirements of the ticket management assignment:

- Authentication
- Role-based authorization
- User registration and login
- Ticket creation
- Ticket listing
- Ticket details
- Ticket assignment
- Engineer workflow
- Status management
- Priority management
- Comments
- Activity history
- Role-specific dashboards
- Search and filtering
- Validation
- Error handling
- Responsive interface
- Database persistence
- Deployment

---

## 👨‍💻 Author

**Jatin Verma**

GitHub: https://github.com/Jatinverma2612

---

## 📄 License

This project was developed as a full-stack development take-home assignment.
