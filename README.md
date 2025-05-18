# FocusFlow* - Productivity App for Students

<div align="center">
  <img src="/FocusFlow-FE/public/book.svg" alt="FocusFlow Logo" width="100" />
  <h3>Your Complete Productivity Solution</h3>
  <p><i>Manage notes, time, and learning efficiently</i></p>
</div>

## 👥 Team Members

| No | Name |
|----|------|
| 1 | Jesie Tenardi |
| 2 | Putri Kiara Salsabila Arief | 
| 3 | Nugroho Ulli Abshar | 
| 4 | Deandro Najwan Ahmad Syahbanna |

## 📝 About FocusFlow

FocusFlow adalah *productivity app* berbasis web yang dirancang khusus untuk mahasiswa, dengan tujuan membantu mereka mengelola catatan, waktu belajar, dan pengeluaran secara efektif. Hadir dengan desain yang menarik menggunakan library modern untuk pengalaman pengguna yang optimal.

## 🌟 Features

- ✅ **Note Management**: Create, edit, and organize your tasks and notes
- ⏱️ **Pomodoro Timer**: Stay focused with customizable pomodoro technique timer
- 📚 **Flashcards**: Create and study flashcards for better learning
- 👤 **User Authentication**: Secure login and registration system
- 🔄 **Real-time Updates**: Changes reflect immediately across the application

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js with Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: React Hooks
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **UI Components**: Custom components with Tailwind
- **Notifications**: SweetAlert2

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon Database)
- **Authentication**: Custom auth with bcrypt
- **Cloud Storage**: Cloudinary
- **Security**: CORS enabled

## 📁 Project Structure

The project is organized into two main directories:

```
FocusFlow/
├── FocusFlow-FE/        # Frontend application
└── FocusFlow-BE/        # Backend API server
```

### Frontend (FocusFlow-FE)

The frontend is built with React and Vite, organized with a clean component structure:

- `src/components/`: Reusable UI components
- `src/pages/`: Application pages and views
- `src/assets/`: Static assets and resources

### Backend (FocusFlow-BE)

The backend follows an MVC-like pattern:

- `src/controllers/`: Request handlers
- `src/routes/`: API endpoint definitions
- `src/repositories/`: Database interactions
- `src/database/`: Database connection and configuration
- `src/utils/`: Utility functions and helpers

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- PostgreSQL database

### Installation

**Clone the repository:**
```bash
git clone https://github.com/yourusername/focusflow.git
cd focusflow
```

**Setting up the backend:**
```bash
cd FocusFlow-BE
npm install
# Create .env file with your database credentials and other configurations
npm start
```

**Setting up the frontend:**
```bash
cd FocusFlow-FE
npm install
npm run dev
```

The application will be available at ``.

## 📱 Screenshots

![Tampilan](https://hackmd.io/_uploads/By5Z_EP-ee.png)


## 🔄 API Endpoints

### User Management
- `POST /user/register` - Register new user
- `POST /user/login` - User login
- `GET /user/:id` - Get user details
- `DELETE /user/:id` - Delete user

### Card/Note Management
- `POST /card` - Create new card/note
- `GET /card/user/:user_id` - Get all cards for a user
- `GET /card/:id` - Get card details
- `PUT /card/:id` - Update card
- `DELETE /card/:id` - Delete card

## 🔐 Authentication Flow

1. User registers with name, email, and password
2. Password is hashed using bcrypt before storage
3. On login, password is verified against stored hash
4. User data is stored in localStorage for session management

## 🎨 UI/UX Design

FocusFlow features a pixelated focus app and soothing blue color palette with glassmorphism UI elements, fluid animations powered by Framer Motion, and a responsive design that works across devices. The interface is intuitive with clear task organization and visual feedback.

## 📊 Database Schema

The application uses a PostgreSQL database with the following main tables:

- `users`: User account information
- `cards`: Notes/tasks with status trackin


## 🔗 Deployment

- Frontend: Deployed on Vercel
- Backend: Deployed on Vercel
- Database: Hosted on Neon Database (PostgreSQL)

## 📜 License

© 2025 FocusFlow. All rights reserved.

---

<div align="center">
  <p>Made with ❤️ by Group 6</p>
</div>
