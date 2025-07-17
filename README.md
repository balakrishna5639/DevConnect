# 💼 DevConnect - Developer Social Network

---

## 📸 Screenshots & Demo

### 🎥 Demo Video

[Watch on Google Drive](https://drive.google.com/file/d/1CcgmPUWwrsu_o4dchGvIZVmBuqxvN-RA/view?usp=sharing)

### 📱 Mobile & Desktop Views

mobile_view: [https://drive.google.com/file/d/1dJMy2F4y6EnrrDqYXe9SCt5gsKoNTOuB/view?usp=drive_link](https://drive.google.com/file/d/1dJMy2F4y6EnrrDqYXe9SCt5gsKoNTOuB/view?usp=drive_link)

Desktop_view: [https://drive.google.com/file/d/18SSGU2fNE33vdM8DIdAhV_TM4izmiwkq/view?usp=drive_link](https://drive.google.com/file/d/18SSGU2fNE33vdM8DIdAhV_TM4izmiwkq/view?usp=drive_link)

---

## ✨ Key Features

### 🔐 **Authentication & Security**

- JWT-based secure authentication
- Password hashing with bcrypt
- Protected routes and middleware
- Rate limiting and security headers

### 👤 **Rich User Profiles**

- Customizable avatars and bios
- Skills and location display
- **GitHub Integration** - Auto-fetch top repositories with stars/forks
- Follower/Following system with real-time counts

### 📝 **Dynamic Posts System**

- **Text Posts** - Share thoughts and discussions
- **Image Posts** - Upload and share screenshots/photos
- **Code Snippets** - Syntax-highlighted code sharing with language selection
- Like and comment functionality
- Edit/Delete your own posts

### 🌐 **Social Features**

- Follow/Unfollow developers
- Personalized feed from followed users
- Discover new developers
- Real-time interaction updates

### 📱 **Responsive Design**

- Mobile-first approach
- Seamless experience across all devices
- Dark theme optimized for developers
- Smooth animations and micro-interactions

---

## 🛠️ Tech Stack

| Category        | Technologies                                     |
| --------------- | ------------------------------------------------ |
| **Frontend**    | React 18, TypeScript, Tailwind CSS, React Router |
| **Backend**     | Node.js, Express.js, JWT Authentication          |
| **Database**    | MongoDB with Mongoose ODM                        |
| **APIs**        | GitHub API for repository integration            |
| **Security**    | Helmet, CORS, bcrypt, Rate Limiting              |
| **File Upload** | Multer, Cloudinary (ready)                       |
| **Development** | Vite, ESLint, Concurrently                       |
| **Deployment**  | Vercel (Frontend), Railway/Render (Backend)      |

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/balakrishna5639/devconnect.git
   cd devconnect
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/devconnect

   # JWT Secret
   JWT_SECRET=your_super_secret_jwt_key_here

   # Server Configuration
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173

   # Optional: Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Start the application**

   ```bash
   npm run dev
   ```

   This runs both frontend (http://localhost:5173) and backend (http://localhost:5000) concurrently.

### Available Scripts

```bash
npm run dev        # Start both client and server
npm run client     # Start frontend only
npm run server     # Start backend only
npm run build      # Build for production
```

---

## 🌟 Advanced Features

### 📱 Responsive Design Highlights

- **Mobile-First**: Optimized for mobile devices
- **Flexible Layouts**: Adapts to any screen size
- **Touch-Friendly**: Proper button sizing and spacing
- **Performance**: Optimized images and lazy loading

### 🎨 UI/UX Excellence

- **Modern Design**: Clean, professional interface
- **Micro-Interactions**: Smooth hover effects and transitions
- **Loading States**: Proper feedback for all actions
- **Error Handling**: User-friendly error messages
- **Accessibility**: WCAG compliant design

---

## 📁 Project Structure

```
devconnect/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Route components
│   │   ├── contexts/         # React Context providers
│   │   ├── services/         # API service layer
│   │   ├── utils/           # Helper functions
│   │   └── types/           # TypeScript definitions
│   └── package.json
├── server/                    # Node.js backend
│   ├── controllers/          # Route handlers
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   └── server.js           # Server entry point
├── .env                     # Environment variables
├── README.md               # Project documentation
└── package.json           # Root package configuration
```

---

## 🚀 Deployment Guide

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Backend (Railway/Render)

1. Create account on Railway or Render
2. Connect GitHub repository
3. Set environment variables
4. Deploy with automatic builds

### Environment Variables for Production

```env
# Production Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/devconnect

# Secure JWT Secret
JWT_SECRET=your_production_jwt_secret

# Production URLs
CLIENT_URL=https://devconnect-social.vercel.app
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `style:` Code formatting
- `refactor:` Code refactoring
- `test:` Adding tests

---

## 📝 API Documentation

### Authentication Endpoints

```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
GET  /api/auth/me         # Get current user
```

### User Endpoints

```
GET    /api/users              # Get all users
GET    /api/users/:username    # Get user by username
PUT    /api/users/profile      # Update profile
POST   /api/users/:id/follow   # Follow user
DELETE /api/users/:id/follow   # Unfollow user
```

### Post Endpoints

```
GET    /api/posts         # Get all posts
GET    /api/posts/feed    # Get user feed
POST   /api/posts         # Create post
PUT    /api/posts/:id     # Update post
DELETE /api/posts/:id     # Delete post
POST   /api/posts/:id/like     # Like/unlike post
POST   /api/posts/:id/comments # Add comment
```

---

## 🌟 Future Enhancements

- [ ] Add project bookmarking feature
- [ ] Support for code collaboration with live editor
- [ ] Add user verification system for professional profiles
