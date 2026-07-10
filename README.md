# Sprintly — Product Lifecycle Management System

> A full-stack PLM web application built with the MERN stack. Sprintly streamlines the entire product development lifecycle — from client requests to deployment — with role-based access control, automated status tracking, and a structured task assignment flow.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

---

## Features

- Role-based access control with 5 distinct roles
- Secure JWT authentication with OTP-based password reset
- Automated project status tracking across lifecycle stages
- Structured task assignment flow between team members
- Notification system triggered automatically on key actions
- Admin approval system for user registrations
- Client request submission without authentication

---

## Roles

| Role | Responsibilities |
|------|-----------------|
| Admin | Manages users, approves client requests, assigns Senior Developers |
| Senior Developer | Manages projects, creates tasks, approves deployments |
| Developer | Works on assigned tasks, submits to tester |
| Tester | Tests completed tasks, sends back or approves for deployment |
| Deployment Engineer | Deploys approved tasks, notifies Senior Developer |

---

## Project Lifecycle

```
Client submits request
        ↓
Admin approves → creates project
        ↓
Admin assigns Senior Developer → Planning
        ↓
Senior Dev creates task → assigns Developer → Development
        ↓
Developer completes → assigns Tester → Testing
        ↓
Tester finds bugs → sends back → Debugging
        ↓
Developer fixes → reassigns Tester → Testing
        ↓
Tester approves → notifies Senior Dev → Awaiting Deployment Approval
        ↓
Senior Dev approves → assigns Deployment Engineer → Deployment
        ↓
Deployment Engineer completes → notifies Senior Dev → Completed
```

---

## API Routes

### Auth — Public
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |
| POST | `/api/auth/forgot-password` | Send OTP to email |
| POST | `/api/auth/reset-password` | Verify OTP and reset password |

### Users
| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/users` | Admin |
| GET | `/api/users/pending` | Admin |
| PATCH | `/api/users/:id/approve` | Admin |
| PATCH | `/api/users/:id/reject` | Admin |
| PATCH | `/api/users/:id/role` | Admin |
| GET | `/api/users/profile` | All roles |
| PATCH | `/api/users/profile` | All roles |

### Client Requests
| Method | Route | Access |
|--------|-------|--------|
| POST | `/api/client-requests` | Public |
| GET | `/api/client-requests` | Admin |
| PATCH | `/api/client-requests/:id/approve` | Admin |
| PATCH | `/api/client-requests/:id/reject` | Admin |

### Projects
| Method | Route | Access |
|--------|-------|--------|
| POST | `/api/projects` | Admin |
| GET | `/api/projects` | All roles |
| GET | `/api/projects/:id` | All roles |
| PATCH | `/api/projects/:id/assign` | Admin |
| PATCH | `/api/projects/:id/cancel` | Admin |

### Tasks
| Method | Route | Access |
|--------|-------|--------|
| POST | `/api/tasks` | Senior Dev |
| GET | `/api/tasks` | Senior Dev |
| GET | `/api/tasks/:id` | All roles |
| GET | `/api/tasks/my-tasks` | All roles |
| PATCH | `/api/tasks/:id/assign-tester` | Developer |
| PATCH | `/api/tasks/:id/assign-back-to-developer` | Tester |
| PATCH | `/api/tasks/:id/assign-back-to-tester` | Developer |
| PATCH | `/api/tasks/:id/request-deployment-approval` | Tester |
| POST | `/api/tasks/approve-deployment` | Senior Dev |
| PATCH | `/api/tasks/:id/complete-deployment` | Deployment Engineer |

### Notifications
| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/notifications` | All roles |
| GET | `/api/notifications/:id` | All roles |
| PATCH | `/api/notifications/:id/read` | All roles |

---

## Project Structure

```
server/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── projectController.js
│   ├── taskController.js
│   ├── notificationController.js
│   └── clientRequestController.js
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
├── models/
│   ├── User.js
│   ├── Project.js
│   ├── Task.js
│   ├── Notification.js
│   └── ClientRequest.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── projectRoutes.js
│   ├── taskRoutes.js
│   ├── notificationRoutes.js
│   └── clientRequestRoutes.js
├── utils/
│   └── seedAdmin.js
├── .env
├── .gitignore
└── index.js
```

---

## Getting Started

### Prerequisites
- Node.js
- MongoDB Atlas account
- Gmail account for Nodemailer

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/parthdeokate26/sprintly.git
cd sprintly/server
```

**2. Install dependencies**
```bash
npm install
```

**3. Create `.env` file**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL=your_gmail
EMAIL_PASSWORD=your_gmail_app_password
```

**4. Seed admin account**
```bash
node utils/seedAdmin.js
```

**5. Start the server**
```bash
node index.js
```

Server runs on `http://localhost:5000`

---

## Security

- Passwords hashed with bcrypt
- JWT based authentication on all protected routes
- Role based access control on every protected route
- Admin role blocked from public registration
- OTP expires after 10 minutes
- CORS enabled for frontend connection

---

## Author

**Parth Deokate**

[![GitHub](https://img.shields.io/badge/GitHub-parthdeokate26-181717?style=flat&logo=github)](https://github.com/parthdeokate26)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-parthdeokate-0077B5?style=flat&logo=linkedin)](https://linkedin.com/in/parthdeokate)
