# FocusFlow\* - Productivity App for Students

<div align="center">
  <img src="FocusFlow-FE/public/book.svg"alt="FocusFlow Logo" width="100" />
  <h3>Your Complete Productivity Solution</h3>
  <p><i>Manage notes, time, and learning efficiently</i></p>
</div>

## 👥 Team Members

| No  | Name                           |
| --- | ------------------------------ |
| 1   | Jesie Tenardi                  |
| 2   | Putri Kiara Salsabila Arief    |
| 3   | Nugroho Ulli Abshar            |
| 4   | Deandro Najwan Ahmad Syahbanna |

## 📝 About FocusFlow

FocusFlow adalah _productivity app_ berbasis web yang dirancang khusus untuk mahasiswa, dengan tujuan membantu mereka mengelola catatan, waktu belajar, dan pengeluaran secara efektif. Hadir dengan desain yang menarik menggunakan library modern untuk pengalaman pengguna yang optimal.

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

```
FocusFlow-FE/
├── public/                 # Aset statis: SVG, gambar
├── src/
│   ├── components/         # Komponen UI yang dapat digunakan kembali
│   │   ├── Cards.jsx       # Komponen kartu untuk notes
│   │   ├── StreakDisplay.jsx # Komponen untuk menampilkan daily streak
│   │   └── ...
│   ├── pages/              # Halaman aplikasi
│   │   ├── homepage.jsx    # Halaman utama
│   │   ├── login.jsx       # Halaman login
│   │   ├── register.jsx    # Halaman pendaftaran
│   │   ├── notes.jsx       # Halaman manajemen tugas
│   │   ├── pomodoro.jsx    # Timer pomodoro
│   │   ├── userProfile.jsx # Profil pengguna
│   │   ├── flashCardSet.jsx # Kumpulan flashcard
│   │   ├── flashCardDetail.jsx # Detail set flashcard
│   │   ├── studyFlashCard.jsx # Halaman belajar flashcard
│   │   ├── landingPage.jsx # Halaman landing setelah login
│   │   ├── errorPage.jsx   # Halaman error
│   │   └── ...
│   ├── App.jsx             # Komponen utama dengan konfigurasi routing
│   ├── App.css             # Stylesheet global
│   └── main.jsx            # Entry point aplikasi
```

### Backend (FocusFlow-BE)

The backend follows an MVC-like pattern:

```
FocusFlow-BE/
├── src/
│   ├── controllers/        # Pengendali request
│   │   ├── user.controller.js     # Autentikasi dan manajemen pengguna
│   │   ├── card.controller.js     # Manajemen tugas/catatan
│   │   ├── pomodoro.sessions.controller.js # Manajemen sesi pomodoro
│   │   ├── flashcard.controller.js # Manajemen flashcard
│   │   ├── daily.streak.controller.js # Manajemen streak harian
│   │   └── ...
│   ├── routes/             # Definisi API endpoint
│   │   ├── user.route.js          # Rute pengguna
│   │   ├── card.route.js          # Rute tugas/catatan
│   │   ├── pomodoro.route.js      # Rute pomodoro
│   │   ├── flashcard.route.js     # Rute flashcard
│   │   ├── daily.streak.route.js  # Rute streak harian
│   │   └── ...
│   ├── repositories/       # Interaksi database
│   │   ├── user.repository.js     # Akses data pengguna
│   │   ├── card.repositories.js   # Akses data tugas/catatan
│   │   ├── flashcard.repository.js # Akses data flashcard
│   │   ├── daily.streak.repository.js # Akses data streak harian
│   │   └── ...
│   ├── database/          # Konfigurasi dan koneksi database
│   │   ├── pg.database.js        # Koneksi PostgreSQL
│   │   └── ...
│   └── utils/             # Fungsi utilitas dan helper
│       ├── baseResponse.utill.js  # Format respons API standar
│       └── ...
├── index.js              # Entry point server
```

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

```
- `POST /user/register` - Mendaftarkan pengguna baru
- `POST /user/login` - Login pengguna
- `GET /user/:id` - Mendapatkan detail pengguna
- `PUT /user/update/name` - Memperbarui nama pengguna
- `PUT /user/update/email` - Memperbarui email pengguna
- `PUT /user/update/password` - Memperbarui password pengguna
- `DELETE /user/:id` - Menghapus pengguna
- `GET /user` - Mendapatkan semua pengguna
```

### Card/Note Management

```
- `POST /card` - Membuat catatan/tugas baru
- `GET /card/user/:user_id` - Mendapatkan semua catatan untuk pengguna
- `GET /card/:id` - Mendapatkan detail catatan
- `PUT /card/:id` - Memperbarui catatan (termasuk status: 'sudah selesai' atau 'belum selesai')
- `DELETE /card/:id` - Menghapus catatan
```

### Pomodoro Management

```
- `POST /pomodoro/sessions` - Membuat sesi pomodoro baru
- `GET /pomodoro/sessions/user/:user_id` - Mendapatkan sesi pomodoro untuk pengguna
- `PUT /pomodoro/sessions/:id/complete` - Menyelesaikan sesi pomodoro
- `POST /pomodoro/tasks` - Membuat tugas pomodoro baru
- `GET /pomodoro/tasks/user/:user_id` - Mendapatkan tugas pomodoro untuk pengguna
- `PUT /pomodoro/tasks/:id` - Memperbarui tugas pomodoro
- `PUT /pomodoro/tasks/:id/set-current` - Mengatur tugas sebagai tugas saat ini
- `DELETE /pomodoro/tasks/:id` - Menghapus tugas pomodoro
- `POST /pomodoro/settings` - Membuat pengaturan pomodoro
- `GET /pomodoro/settings/user/:user_id` - Mendapatkan pengaturan pomodoro untuk pengguna
- `PUT /pomodoro/settings/:id` - Memperbarui pengaturan pomodoro
```

### Flashcard Management

```
- `POST /flashcard/set` - Membuat set flashcard baru
- `GET /flashcard/set/user/:user_id` - Mendapatkan semua set flashcard untuk pengguna
- `GET /flashcard/set/:id` - Mendapatkan detail set flashcard
- `GET /flashcard/set/:id/cards` - Mendapatkan set flashcard dengan kartu
- `PUT /flashcard/set/:id` - Memperbarui set flashcard
- `DELETE /flashcard/set/:id` - Menghapus set flashcard
- `POST /flashcard/card` - Membuat kartu flashcard baru
- `GET /flashcard/cards/set/:set_id` - Mendapatkan kartu flashcard dari set
- `PUT /flashcard/card/:id` - Memperbarui kartu flashcard
- `DELETE /flashcard/card/:id` - Menghapus kartu flashcard
```

### Daily Streak Management

```
- `GET /api/streak/user/:user_id` - Mendapatkan streak pengguna
- `POST /api/streak/complete` - Memperbarui streak setelah menyelesaikan pomodoro
- `POST /api/streak/force-increment` - Menambah streak secara manual (untuk testing)
```

## 🔐 Authentication Flow

1. User registers with name, email, and password
2. Password is hashed using bcrypt before storage
3. On login, password is verified against stored hash
4. User data is stored in localStorage for session management

## 🎨 UI/UX Design

FocusFlow features a pixelated focus app and soothing blue color palette with glassmorphism UI elements, fluid animations powered by Framer Motion, and a responsive design that works across devices. The interface is intuitive with clear task organization and visual feedback.

## 📊 Database Schema

The application uses a PostgreSQL database with the following main tables:

![Imgur](https://imgur.com/sJekUi7.png)

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
