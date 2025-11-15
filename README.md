# Portfolio Backend API

Production-ready backend server for portfolio website with JWT authentication, MongoDB integration, and real-time metrics aggregation from GitHub, LinkedIn, and LeetCode.

## 🚀 Features

- **Secure Authentication**: JWT-based admin authentication with bcrypt password hashing
- **Content Management**: Full CRUD operations for projects and achievements
- **Metrics Aggregation**: Real-time fetching and caching of GitHub, LinkedIn, and LeetCode stats
- **Image Upload**: Multer-based image upload system with validation
- **Security Hardened**: Helmet, CORS, rate-limiting, and input validation
- **Production Ready**: Deployable to Render, Railway, or Vercel
- **Auto-caching**: 30-minute cache for metrics to reduce API calls

## 📦 Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer
- **Security**: Helmet, CORS, express-rate-limit
- **Validation**: express-validator

## 📁 Project Structure

```
portfolio-backend/
├── src/
│   ├── config/
│   │   └── database.js         # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Login & auth verification
│   │   ├── contentController.js # Content CRUD operations
│   │   ├── metricsController.js # Metrics endpoints
│   │   └── uploadController.js  # Image upload handler
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication middleware
│   │   └── validators.js       # Input validation rules
│   ├── models/
│   │   ├── User.js             # Admin user model
│   │   ├── Content.js          # Projects & achievements model
│   │   └── MetricsCache.js     # Metrics cache model
│   ├── routes/
│   │   ├── authRoutes.js       # Auth routes
│   │   ├── contentRoutes.js    # Content routes
│   │   ├── metricsRoutes.js    # Metrics routes
│   │   └── uploadRoutes.js     # Upload routes
│   ├── services/
│   │   ├── githubService.js    # GitHub API integration
│   │   ├── linkedinService.js  # LinkedIn service
│   │   └── leetcodeService.js  # LeetCode API integration
│   ├── utils/
│   │   ├── jwtUtils.js         # JWT token utilities
│   │   └── seedAdmin.js        # Admin seeding script
│   └── server.js               # Main application entry
├── uploads/                    # Uploaded images directory
├── .gitignore
├── env.example                 # Environment variables template
├── package.json
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js v18+ installed
- MongoDB Atlas account (or local MongoDB)
- GitHub Personal Access Token (for metrics)

### Step 1: Clone Repository

```bash
git clone https://github.com/Keerthanjakkarajucodes/keerthan.dev-bknd.git
cd keerthan.dev-bknd
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp env.example .env
```

Edit `.env` with your credentials:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Admin Credentials
ADMIN_EMAIL=admin@keerthan.dev
ADMIN_PASSWORD=your-secure-password

# GitHub API Token (for metrics)
GITHUB_TOKEN=ghp_your_github_personal_access_token
GITHUB_USERNAME=Keerthanjakkarajucodes

# LeetCode Username (optional)
LEETCODE_USERNAME=your_leetcode_username

# LinkedIn URL (static fallback)
LINKEDIN_URL=https://linkedin.com/in/your-profile

# CORS Configuration
ALLOWED_ORIGIN=https://keerthan.dev

# Server Port
PORT=3000

# Node Environment
NODE_ENV=production
```

### Step 4: Seed Admin User

```bash
npm run seed
```

### Step 5: Start Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run on `http://localhost:3000`

## 📚 API Documentation

### Public Endpoints (No Authentication Required)

#### Get All Content
```http
GET /api/public/content
```

**Response:**
```json
{
  "success": true,
  "data": {
    "about": "About me text...",
    "projects": [...],
    "achievements": [...]
  }
}
```

#### Get GitHub Metrics
```http
GET /api/metrics/github
```

**Response:**
```json
{
  "success": true,
  "data": {
    "followers": 150,
    "publicRepos": 42,
    "totalStars": 320,
    "totalForks": 85
  },
  "url": "https://github.com/username",
  "cached": false
}
```

#### Get LinkedIn Metrics
```http
GET /api/metrics/linkedin
```

#### Get LeetCode Metrics
```http
GET /api/metrics/leetcode
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSolved": 250,
    "easySolved": 100,
    "mediumSolved": 120,
    "hardSolved": 30,
    "ranking": 12345
  },
  "url": "https://leetcode.com/username",
  "cached": false
}
```

#### Get All Metrics
```http
GET /api/metrics/all
```

### Admin Endpoints (Authentication Required)

All admin endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### Admin Login
```http
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@keerthan.dev",
  "password": "your-password"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@keerthan.dev",
    "role": "admin"
  }
}
```

#### Update About Section
```http
PUT /api/content/about
Authorization: Bearer <token>
Content-Type: application/json

{
  "about": "Updated about text..."
}
```

#### Create Project
```http
POST /api/content/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Project Name",
  "description": "Project description",
  "tags": ["React", "Node.js"],
  "repoUrl": "https://github.com/user/repo",
  "liveUrl": "https://example.com",
  "imageUrl": "https://example.com/image.jpg"
}
```

#### Update Project
```http
PUT /api/content/projects/:id
Authorization: Bearer <token>
```

#### Delete Project
```http
DELETE /api/content/projects/:id
Authorization: Bearer <token>
```

#### Create Achievement
```http
POST /api/content/achievements
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Achievement Title",
  "detail": "Achievement details",
  "date": "2024-01-15"
}
```

#### Update Achievement
```http
PUT /api/content/achievements/:id
Authorization: Bearer <token>
```

#### Delete Achievement
```http
DELETE /api/content/achievements/:id
Authorization: Bearer <token>
```

#### Upload Image
```http
POST /api/admin/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
  image: [file]
```

**Response:**
```json
{
  "success": true,
  "url": "http://localhost:3000/uploads/image-1234567890.jpg",
  "filename": "image-1234567890.jpg",
  "size": 245678,
  "mimetype": "image/jpeg"
}
```

## 🚀 Deployment

### Deploy to Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure build settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variables from `.env`
5. Deploy!

### Deploy to Railway

1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables
4. Railway will auto-detect and deploy Node.js app

### Deploy to Vercel (Serverless)

**Note**: For Vercel, create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ]
}
```

Then deploy:
```bash
npm install -g vercel
vercel
```

## 🔗 Frontend Integration

In your frontend (Lovable/Vite app), set the API base URL:

```env
VITE_API_BASE_URL=https://your-backend.onrender.com
```

Example API call:
```javascript
const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public/content`);
const data = await response.json();
```

For authenticated requests:
```javascript
const token = localStorage.getItem('authToken');

const response = await fetch(
  `${import.meta.env.VITE_API_BASE_URL}/api/content/projects`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(projectData)
  }
);
```

## 🔐 Security Features

- **JWT Authentication**: 7-day token expiration
- **Password Hashing**: bcrypt with 10 salt rounds
- **Rate Limiting**: 
  - API routes: 100 requests per 15 minutes
  - Login route: 5 attempts per 15 minutes
- **CORS**: Strict origin whitelist
- **Helmet**: Security headers
- **Input Validation**: express-validator on all inputs
- **File Upload**: 5MB limit, image types only

## 🧪 Testing Endpoints

Use the provided health check:
```bash
curl http://localhost:3000/health
```

Test login:
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@keerthan.dev","password":"your-password"}'
```

## 📊 Cache Strategy

- **GitHub Metrics**: 30-minute cache
- **LinkedIn Metrics**: 60-minute cache  
- **LeetCode Metrics**: 60-minute cache

Cached data is stored in MongoDB and served on subsequent requests until expiration.

## 🛠️ Troubleshooting

### MongoDB Connection Failed
- Verify `MONGO_URI` in `.env`
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for cloud deployment)
- Ensure database user has read/write permissions

### CORS Errors
- Add your frontend URL to `ALLOWED_ORIGIN` in `.env`
- Multiple origins: `ALLOWED_ORIGIN=https://domain1.com,https://domain2.com`

### GitHub API Rate Limiting
- Add `GITHUB_TOKEN` to increase rate limit from 60 to 5000 requests/hour
- Generate token at: https://github.com/settings/tokens

### Admin Login Fails
- Run `npm run seed` to recreate admin user
- Verify credentials in `.env` match login attempt

## 📝 License

MIT License - feel free to use this for your portfolio!

## 👨‍💻 Author

**Keerthan Jakkaraju**
- GitHub: [@Keerthanjakkarajucodes](https://github.com/Keerthanjakkarajucodes)
- Portfolio: [keerthan.dev](https://keerthan.dev)

---

**Built with ❤️ for developers by developers**

