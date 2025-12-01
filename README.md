# SkillSwap - MERN Stack Skill Exchange Platform

A production-quality full-stack application for exchanging skills between users. Built with MongoDB, Express, React, and Node.js (MERN stack) with real-time chat functionality.

## Features

- 🔐 **JWT Authentication** - Secure user registration and login with bcrypt password hashing
- 👤 **User Profiles** - Manage personal information, skills, and bio
- 🎯 **Skill Management** - Create, browse, and search skills with tags and difficulty levels
- 📅 **Session Booking** - Schedule learning sessions with other users
- 💬 **Real-time Chat** - Socket.IO powered chat rooms for session participants
- 🎨 **Responsive UI** - Beautiful Tailwind CSS interface for mobile and desktop
- 🐳 **Docker Support** - Full containerization for easy deployment
- ☁️ **Render Ready** - Pre-configured for Render.com deployment

## Tech Stack

### Backend
- Node.js 20
- Express.js
- MongoDB with Mongoose
- Socket.IO for real-time chat
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation

### Frontend
- React 19 with Vite
- Tailwind CSS
- React Router v6
- Axios for API calls
- Socket.IO client
- Context API for state management

## Project Structure

```
SkillSwap-App/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── skillController.js
│   │   │   └── sessionController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Skill.js
│   │   │   └── Session.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── skills.js
│   │   │   └── sessions.js
│   │   ├── sockets/
│   │   │   └── chat.js
│   │   ├── scripts/
│   │   │   └── seed.js
│   │   └── index.js
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── SkillDetail.jsx
│   │   │   ├── NewSkill.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Chat.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── Dockerfile
├── docker-compose.yml
├── render.yaml
├── LICENSE
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20 or higher
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Environment Variables

#### Backend (.env)

Create a `backend/.env` file based on `backend/.env.example`:

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas connection string
# Get this from your MongoDB Atlas dashboard
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/skillswap?retryWrites=true&w=majority

# Generate a secure random string for JWT secret
# You can use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_secure_jwt_secret_here

# Frontend URL for CORS
CORS_ORIGIN=http://localhost:5173
```

**IMPORTANT:** Replace the following placeholders:
- `<username>` - Your MongoDB Atlas username
- `<password>` - Your MongoDB Atlas password
- `<cluster>` - Your MongoDB Atlas cluster name
- `your_secure_jwt_secret_here` - Generate using the command above

#### Frontend (.env)

Create a `frontend/.env` file based on `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:5000
```

### Local Development Setup

#### Option 1: Manual Setup (Recommended for Development)

1. **Clone and navigate to the project:**
   ```cmd
   cd c:\Users\SWARAJ\Projects\SkillSwap-App
   ```

2. **Set up Backend:**
   ```cmd
   cd backend
   copy .env.example .env
   ```
   Edit `backend\.env` and add your MongoDB URI and JWT secret.

   ```cmd
   npm install
   npm run dev
   ```
   Backend will run on http://localhost:5000

3. **Set up Frontend (in a new terminal):**
   ```cmd
   cd c:\Users\SWARAJ\Projects\SkillSwap-App\frontend
   copy .env.example .env
   npm install
   npm run dev
   ```
   Frontend will run on http://localhost:5173

4. **Seed the database (optional but recommended):**
   ```cmd
   cd c:\Users\SWARAJ\Projects\SkillSwap-App\backend
   npm run seed
   ```
   This creates demo users (all with password: `password123`):
   - alice@example.com
   - bob@example.com
   - carol@example.com

#### Option 2: Docker Compose

1. **Create environment files as described above**

2. **Run with Docker Compose:**
   ```cmd
   docker-compose up --build
   ```
   - Backend: http://localhost:5000
   - Frontend: http://localhost:5173
   - MongoDB: localhost:27017

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Users
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `GET /api/users/:id` - Get user by ID (protected)

### Skills
- `GET /api/skills` - Get all skills (with optional filters)
- `POST /api/skills` - Create new skill (protected)
- `GET /api/skills/:id` - Get skill by ID (protected)
- `PUT /api/skills/:id` - Update skill (protected, owner only)
- `DELETE /api/skills/:id` - Delete skill (protected, owner only)
- `GET /api/skills/match?tags=tag1,tag2` - Match skills by tags (protected)

### Sessions
- `GET /api/sessions` - Get user's sessions (protected)
- `POST /api/sessions` - Create new session (protected)
- `GET /api/sessions/:id` - Get session by ID (protected)
- `PATCH /api/sessions/:id/status` - Update session status (protected)

### Socket.IO Events
- `join_room` - Join a chat room
- `leave_room` - Leave a chat room
- `chat_message` - Send a message to a room
- `user_joined` - Notification when user joins
- `user_left` - Notification when user leaves

## Testing the Application

### Quick Test Script

1. **Register a new user:**
   ```cmd
   curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\",\"skills\":[\"Testing\"]}"
   ```

2. **Login:**
   ```cmd
   curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
   ```
   Copy the token from the response.

3. **Get skills (replace YOUR_TOKEN):**
   ```cmd
   curl http://localhost:5000/api/skills -H "Authorization: Bearer YOUR_TOKEN"
   ```

### Manual Testing Flow

1. Open http://localhost:5173
2. Click "Sign Up" and create an account
3. Login with your credentials
4. Browse skills on the Dashboard
5. Click "+ Add Skill" to create your own skill
6. Click on a skill to view details and book a session
7. Go to Profile to see your booked sessions
8. Go to Chat and enter a room ID (e.g., "session-123") to test real-time chat

## Deployment to Render

### Prerequisites
- GitHub account
- Render account (free tier available)
- MongoDB Atlas account

### Steps

1. **Push your code to GitHub:**
   ```cmd
   git remote add origin https://github.com/yourusername/skillswap-app.git
   git push -u origin master
   ```

2. **Set up MongoDB Atlas:**
   - Create a cluster at https://cloud.mongodb.com
   - Create a database user
   - Whitelist all IPs (0.0.0.0/0) for Render access
   - Copy your connection string

3. **Deploy on Render:**
   - Go to https://render.com
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will detect `render.yaml` and create services

4. **Configure Environment Variables:**
   
   **Backend Service:**
   - `MONGO_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - Generate a secure random string
   - `CORS_ORIGIN` - Your frontend URL (e.g., https://skillswap-frontend.onrender.com)
   - `NODE_ENV` - production
   - `PORT` - 5000

   **Frontend Static Site:**
   - `VITE_API_URL` - Your backend URL (e.g., https://skillswap-backend.onrender.com)

5. **Deploy:**
   - Render will automatically build and deploy both services
   - Wait for deployment to complete
   - Visit your frontend URL to access the app

### Post-Deployment

1. **Seed the production database:**
   - SSH into your backend service or use Render shell
   - Run: `npm run seed`

2. **Test the deployment:**
   - Register a new user
   - Create a skill
   - Book a session
   - Test the chat functionality

## Development Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with demo data

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Security Notes

⚠️ **IMPORTANT:** This repository contains NO real secrets. All credentials use placeholders.

Before running:
1. Create `.env` files from `.env.example` templates
2. Replace ALL placeholder values with real credentials
3. Never commit `.env` files to version control
4. Use strong, randomly generated values for `JWT_SECRET`

## License

MIT License - see LICENSE file for details

## Support

For issues or questions:
1. Check the API endpoint documentation above
2. Review the code comments in source files
3. Ensure all environment variables are correctly set
4. Check MongoDB Atlas connection and IP whitelist

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

Built with ❤️ using the MERN stack
