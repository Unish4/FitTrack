#  FitTrack — Modern Fitness Platform

FitTrack is a production-grade full-stack fitness tracking web application built with **React 19**, **Tailwind CSS v4**, **Node.js**, **Express v5**, and **MongoDB**. 

It empowers users to log workouts, track exercise sets & volume, manage fitness goals, monitor training streaks, unlock achievements, visualize performance charts via **Recharts**, and customize profile avatars powered by **Cloudinary**.

---

##  Feature Highlights

###  1. Authentication & Security
- **JWT Bearer Token Authentication**: Secure token transmission via `Authorization: Bearer <token>` headers.
- **Session Rehydration**: Automatic session validation on page refresh.
- **Role-Based Access Control**:
  - `Member`: Log workouts, create goals, track PRs, update profile.
  - `Admin`: Full access + Exercise Library management (create, update, delete exercises & upload thumbnail images).
- **Arcjet Rate Limiting**: Protection against brute-force attacks on authentication routes.

###  2. Interactive Dashboard
- **Streak Tracker & 7-Day Activity Matrix**: Live streak counter (`🔥 X Day Streak`) with past 7-day workout checkmarks.
- **Key Metric StatCards**: Total workouts, total duration, calories burned, and average session length.
- **Recent Workouts Feed**: Latest logged sessions with mood emojis, duration, and calories burned.
- **Active Goals Widget**: Active goal progress bars and upcoming deadlines.
- **Achievements Grid**: Gamified badges (*First Workout*, *10 Workouts*, *50 Workouts*, *100 Workouts*, *7-Day Streak*, *30-Day Streak*).

###  3. Exercise Library
- **Multi-Criteria Search & Filtering**: Filter by category (*Strength*, *Cardio*, *Flexibility*, *Balance*), muscle group (*Chest*, *Back*, *Legs*, *Core*, *Arms*, *Shoulders*), and difficulty level.
- **Step-by-Step Instructions & Pro Tips**: View execution steps and tips in a detailed modal.
- **Admin Management**: Admin controls for adding exercises, editing metadata, multi-select equipment tagging, and uploading Cloudinary exercise photos.

###  4. Workout Logger & Calendar
- **Interactive Set Builder**: Add multiple exercises, configure sets (reps, weight, rest time), mark set completion, and calculate total volume (kg).
- **Session Metadata**: Log duration, calories burned, workout type, intensity, mood emoji, and session notes.
- **Monthly Activity Calendar**: Interactive matrix view grouping workouts by day of the month with monthly aggregate statistics.

###  5. Fitness Goals Management
- **Goal Targets**: Set goals for weight loss, muscle gain, endurance, strength, flexibility, workout count, or custom metrics.
- **Progress Tracking**: Set exact values or increment amounts. Auto-detects target completion and marks goals as **Completed**.
- **Milestones Showcase**: Dedicated completed goals showcase with trophy badges.

###  6. Progress Analytics & Personal Records (PRs)
- **30-Day Activity Trend (Recharts AreaChart)**: Plotted daily workout duration and frequency.
- **Muscle Group Distribution (Recharts BarChart)**: Visual breakdown of targeted sets across muscle groups.
- **Workout Category Split (Recharts Donut PieChart)**: Training category distribution.
- **Personal Records (PR) Table**: Exercise leaderboard tracking max weight lifted (kg), max reps, and date achieved.

###  7. User Profile & Settings
- **Cloudinary Avatar Upload**: Upload or remove profile pictures with immediate session synchronization across the navigation shell.
- **Physical Attributes**: Update height (cm), weight (kg), age, gender, and experience level (*Beginner*, *Intermediate*, *Advanced*).
- **Security Form**: Change account password safely with form validation.

---

##  Technology Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React `v19.2` | Core UI rendering engine |
| **Build Tool** | Vite `v8.2` | Fast HMR & production bundler |
| **Styling** | Tailwind CSS `v4.3` | Utility-first responsive design system |
| **State Management** | Zustand `v5.0` | Global application stores (`authStore`, `workoutStore`, `exerciseStore`, `goalStore`) |
| **API Client** | Axios `v1.2` | Centralized API client with request/response interceptors |
| **Routing** | React Router DOM `v7.1` | Client-side routing with `ProtectedRoute`, `PublicRoute`, and `AdminRoute` |
| **Charts** | Recharts `v3.10` | Responsive data visualization charts |
| **Icons & Notifications** | Lucide React & React Hot Toast | UI icons and toast notifications |
| **Backend Framework** | Node.js & Express `v5.2` | RESTful API server |
| **Database** | MongoDB & Mongoose `v9.9` | NoSQL document database |
| **File Storage** | Multer & Cloudinary `v2.11` | In-memory buffer upload to Cloudinary cloud storage |
| **Security & Utilities** | Helmet, CORS, Morgan, Arcjet | API security headers, rate limiting, and dev logging |

---

##  Repository Directory Structure

```text
Fitness-Tracker/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, Cloudinary, Multer & Env configs
│   │   ├── controllers/     # Express route handlers (auth, exercise, workout, goal)
│   │   ├── middleware/      # Auth protect, authorize & Arcjet rate limiters
│   │   ├── models/          # Mongoose schemas (User, Exercise, Workout, Goal)
│   │   ├── routes/          # Express route definitions
│   │   ├── utils/           # Response formatters, JWT sign/verify, Cloudinary helpers
│   │   └── server.js        # Main Express server entry point
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   │   └── logo.png         # FitTrack PNG Logo
│   ├── src/
│   │   ├── api/             # Centralized Axios instance & API client modules
│   │   ├── components/      # UI primitives, layout shell, and feature components
│   │   │   ├── ui/          # Reusable design system primitives
│   │   │   ├── layout/      # Navbar, Sidebar, MobileNav
│   │   │   ├── auth/        # Route guards (ProtectedRoute, PublicRoute, AdminRoute)
│   │   │   ├── dashboard/   # StatCard, StreakBanner, RecentWorkouts, ActiveGoals, Achievements
│   │   │   ├── exercises/   # ExerciseCard, FilterBar, DetailModal, FormModal, ImageUploadModal
│   │   │   ├── workouts/    # WorkoutCard, DetailModal, LoggerModal, CalendarView
│   │   │   ├── goals/       # GoalCard, FormModal, ProgressModal, CompletedGoalsTab
│   │   │   ├── analytics/   # Recharts trend, bar, pie charts & PR table
│   │   │   └── profile/     # ProfileHeader, BasicInfoForm, FitnessProfileForm, ChangePasswordForm
│   │   ├── layouts/         # MainLayout wrapper
│   │   ├── pages/           # Application views
│   │   ├── routes/          # AppRouter configuration
│   │   ├── store/           # Zustand state stores
│   │   ├── utils/           # Enums, constants, formatters
│   │   ├── App.jsx          # Root component
│   │   └── main.jsx         # DOM entry point
│   ├── index.html
│   ├── package.json
│   └── .env
│
└── README.md
```

---

##  Quick Start Guide

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas Connection URI
- **Cloudinary Account**: Cloud name, API Key, and API Secret for image uploads

---

### Step 1: Clone & Configure Backend

1. Navigate to `backend` directory:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside `backend/` with the following variables:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/fittrack
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ARCJET_KEY=ajkey_your_arcjet_key
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend API will run on `http://localhost:5000`.

---

### Step 2: Configure & Start Frontend

1. Open a new terminal and navigate to `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Ensure `frontend/.env` contains your backend API URL:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```
4. Start the frontend Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

---

##  Backend API Reference

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | Register new account |
| `/api/auth/login` | `POST` | Public | Login & receive JWT token |
| `/api/auth/me` | `GET` | Protected | Fetch current profile & recent workouts |
| `/api/auth/stats` | `GET` | Protected | Fetch user statistics, streak, & achievements |
| `/api/auth/me` | `PATCH` | Protected | Update basic info (name, email) |
| `/api/auth/fitness-profile` | `PATCH` | Protected | Update height, weight, age, fitness level |
| `/api/auth/change-password` | `PATCH` | Protected | Update account password |
| `/api/auth/avatar` | `POST` | Protected | Upload profile picture to Cloudinary |
| `/api/auth/avatar` | `DELETE` | Protected | Remove profile picture |
| `/api/exercises` | `GET` | Public | Paginated exercise library |
| `/api/exercises/search` | `GET` | Public | Text search exercise catalog |
| `/api/exercises` | `POST` | Admin | Create exercise item |
| `/api/exercises/:id/image` | `POST` | Admin | Upload exercise photo |
| `/api/workouts` | `POST` | Protected | Log a workout session with sets |
| `/api/workouts` | `GET` | Protected | Paginated user workout history |
| `/api/workouts/stats/advanced` | `GET` | Protected | Advanced metrics & 30-day activity trends |
| `/api/workouts/personal-records` | `GET` | Protected | Personal records leaderboard |
| `/api/workouts/calendar` | `GET` | Protected | Monthly calendar workout matrix |
| `/api/goals` | `POST` | Protected | Create fitness target goal |
| `/api/goals/stats/summary` | `GET` | Protected | Summary metrics for active/completed goals |
| `/api/goals/:id/progress` | `PATCH` | Protected | Update goal progress value |

---

##  Build for Production

To create an optimized production build of the frontend:

```bash
cd frontend
npm run build
```

The output files will be compiled into `frontend/dist/`.

---

##  Development Roadmap Branches

- `feature/frontend-foundation`: Dependencies, Vite configuration, `.env`.
- `feature/design-system`: Reusable UI primitives (`Button`, `Input`, `Card`, `Badge`, `Modal`, `Skeleton`).
- `feature/authentication`: Centralized Axios instance, Zustand `authStore`, login/register pages, route guards.
- `feature/layout-navigation`: Responsive layout shell, `Navbar`, `Sidebar`, `MobileNav`.
- `feature/dashboard`: Dashboard metrics, streak banner, recent workouts feed, active goals widget, achievements grid.
- `feature/exercise-management`: Exercise catalog, multi-filter search, detail modal, admin CRUD & image upload.
- `feature/workout-management`: Interactive workout logger, set builder, history feed, detail modal, monthly calendar matrix.
- `feature/goals-management`: Fitness goals, progress slider/update modal, target completion auto-detection, completed goals showcase.
- `feature/progress-analytics`: Recharts 30-day activity trend AreaChart, muscle group BarChart, category Donut chart, and PR leaderboard.
- `feature/profile-settings`: Profile header card, Cloudinary avatar upload, physical attributes form, and password security form.
- `feature/frontend-final-polish`: Favicon branding, logo updates, production audit, and README documentation.

---

##  License

This project is open-source under the [ISC License](LICENSE).
