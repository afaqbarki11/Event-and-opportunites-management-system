# EOMS - Events & Opportunities Management System

A modern, responsive university platform for managing academic events, internships, scholarships, jobs, registrations, and notifications. Built with React.js, Node.js, Express.js, and MySQL.

![EOMS](https://img.shields.io/badge/Version-1.0.0-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![Node](https://img.shields.io/badge/Node.js-18+-green) ![React](https://img.shields.io/badge/React-19-blue)

## Features

- **Role-based Access**: Admin and Student roles with different dashboards
- **Event Management**: Create, browse, search, filter, and register for events
- **Opportunity Management**: Jobs, internships, scholarships with application system
- **CV Upload**: Students can upload CV/documents when applying
- **Notifications**: Real-time notification system for registrations and applications
- **Search & Filter**: Full search and category/type filtering
- **Responsive Design**: Mobile-first, modern UI with Tailwind CSS
- **REST APIs**: Clean, secure API architecture with JWT authentication

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 19 + Vite |
| Styling | Tailwind CSS 4 |
| Backend | Node.js + Express.js |
| Database | MySQL (XAMPP compatible) |
| Auth | JWT (JSON Web Tokens) |
| File Upload | Multer |

## Project Structure

```
eoms/
├── client/                  # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components (Navbar, Cards)
│   │   ├── context/         # Auth context provider
│   │   ├── pages/           # Page components
│   │   ├── utils/           # API utility (Axios)
│   │   ├── App.jsx          # Main app with routing
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Tailwind imports
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                  # Express Backend
│   ├── config/              # Database configuration
│   ├── controllers/         # Route handlers
│   ├── middleware/           # Auth & upload middleware
│   ├── routes/              # API route definitions
│   ├── uploads/             # File uploads directory
│   ├── index.js             # Server entry point
│   ├── .env.example         # Environment variables template
│   └── package.json
├── database/
│   └── eoms_database.sql    # Complete MySQL schema + seed data
└── README.md
```

## Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **XAMPP** (with MySQL/Apache) - [Download](https://www.apachefriends.org/)
- **Git** - [Download](https://git-scm.com/)

## Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/afaqbarki11/Event-and-opportunites-management-system.git
cd Event-and-opportunites-management-system
```

### Step 2: Set Up the Database

1. Start **XAMPP** and ensure **Apache** and **MySQL** are running
2. Open **phpMyAdmin** at `http://localhost/phpmyadmin`
3. Click **Import** tab
4. Select the file `database/eoms_database.sql`
5. Click **Go** to import

This creates the `eoms_db` database with all tables and sample data.

### Step 3: Set Up the Backend

```bash
cd server

# Copy environment config
cp .env.example .env

# Install dependencies
npm install

# Start the server
npm run dev
```

The backend will run on `http://localhost:5000`

### Step 4: Set Up the Frontend

```bash
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### Step 5: Access the Application

Open your browser and go to `http://localhost:5173`

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@university.edu | admin123 |
| Student | ahmed@student.edu | student123 |
| Student | sara@student.edu | student123 |
| Student | fatima@student.edu | student123 |

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new student |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | Get profile (auth) |
| PUT | `/api/auth/profile` | Update profile (auth) |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | List events (search, filter, paginate) |
| GET | `/api/events/:id` | Get event details |
| POST | `/api/events` | Create event (admin) |
| PUT | `/api/events/:id` | Update event (admin) |
| DELETE | `/api/events/:id` | Delete event (admin) |

### Opportunities
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/opportunities` | List opportunities |
| GET | `/api/opportunities/:id` | Get opportunity details |
| POST | `/api/opportunities` | Create opportunity (admin) |
| PUT | `/api/opportunities/:id` | Update opportunity (admin) |
| DELETE | `/api/opportunities/:id` | Delete opportunity (admin) |

### Registrations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/registrations` | Register for event (auth) |
| DELETE | `/api/registrations/:event_id` | Cancel registration (auth) |
| GET | `/api/registrations/my` | My registrations (auth) |
| GET | `/api/registrations/check/:event_id` | Check if registered (auth) |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications` | Apply with CV upload (auth) |
| GET | `/api/applications/my` | My applications (auth) |
| PUT | `/api/applications/:id/status` | Update status (admin) |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get notifications (auth) |
| PUT | `/api/notifications/:id/read` | Mark as read (auth) |
| PUT | `/api/notifications/read-all` | Mark all as read (auth) |
| GET | `/api/notifications/dashboard` | Dashboard stats (auth) |

## Database Schema

The database includes the following tables:

- **users** - User accounts with roles (admin/student)
- **events** - Campus events with categories and status
- **opportunities** - Jobs, internships, scholarships
- **registrations** - Event registrations with waitlist support
- **applications** - Opportunity applications with CV upload
- **notifications** - User notifications

All tables include proper primary keys, foreign keys, constraints, and indexes.

## Environment Variables

Copy `server/.env.example` to `server/.env` and configure:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=eoms_db
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
```

## License

This project is licensed under the MIT License.
