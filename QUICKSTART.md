# 🚀 Quick Start Guide

## Prerequisites Checklist
- ✅ Node.js v18+ installed
- ✅ MongoDB Atlas account set up
- ✅ GitHub Personal Access Token generated
- ✅ Git repository created and cloned

## Setup in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Create .env File
Copy `env.example` to `.env` and fill in your values:

```bash
cp env.example .env
```

**Required Variables:**
- `MONGO_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Random string (use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- `ADMIN_EMAIL` - Your admin email
- `ADMIN_PASSWORD` - Strong password (min 6 chars)
- `GITHUB_TOKEN` - Get from https://github.com/settings/tokens
- `GITHUB_USERNAME` - Your GitHub username
- `ALLOWED_ORIGIN` - Your frontend URL

### 3. Create Admin User
```bash
npm run seed
```

You should see: `✅ Admin user created successfully`

### 4. Start the Server
```bash
npm run dev
```

Server runs on `http://localhost:3000`

### 5. Test the API
```bash
# Health check
curl http://localhost:3000/health

# Get public content
curl http://localhost:3000/api/public/content

# Login as admin
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@keerthan.dev","password":"your-password"}'
```

## 🎯 Next Steps

### Local Development
1. Use the JWT token from login for authenticated requests
2. Test CRUD operations for projects and achievements
3. Upload test images to verify upload functionality
4. Check metrics endpoints to verify API integrations

### Deploy to Production
1. **Render**: Connect repo → Add env vars → Deploy
2. **Railway**: Create project → Add env vars → Auto-deploy
3. **Vercel**: Add `vercel.json` → `vercel` command

### Connect Frontend
In your frontend `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000
```

After deployment:
```env
VITE_API_BASE_URL=https://your-backend.onrender.com
```

## 🔍 Troubleshooting

### MongoDB Connection Error
- Check if IP is whitelisted in MongoDB Atlas (0.0.0.0/0 for all)
- Verify connection string format
- Ensure database user has read/write permissions

### "Admin user already exists"
- This is normal if you run `npm run seed` twice
- You can still login with existing credentials

### CORS Error from Frontend
- Add your frontend URL to `ALLOWED_ORIGIN` in `.env`
- Restart server after changing `.env`

### GitHub API Rate Limit
- Without token: 60 requests/hour
- With token: 5000 requests/hour
- Generate token at: https://github.com/settings/tokens
- Scopes needed: `public_repo` (read-only)

## 📚 Key Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/health` | GET | No | Health check |
| `/api/admin/login` | POST | No | Get JWT token |
| `/api/public/content` | GET | No | Get all content |
| `/api/metrics/github` | GET | No | GitHub stats |
| `/api/metrics/leetcode` | GET | No | LeetCode stats |
| `/api/content/projects` | POST | Yes | Create project |
| `/api/content/projects/:id` | PUT | Yes | Update project |
| `/api/content/projects/:id` | DELETE | Yes | Delete project |
| `/api/admin/upload` | POST | Yes | Upload image |

## 🛡️ Security Notes

- **Never commit `.env` file**
- Change `JWT_SECRET` in production
- Use strong admin password
- Keep `GITHUB_TOKEN` private
- Rate limits apply: 5 login attempts / 15 min
- File uploads limited to 5MB images only

## 💡 Pro Tips

1. **Cache Duration**: GitHub metrics cache for 30 min, LeetCode for 60 min
2. **Admin Access**: Only one admin user supported by default
3. **File Uploads**: Images saved to `/uploads` directory
4. **Database**: Content and MetricsCache use singleton pattern
5. **Tokens**: JWT expires in 7 days

## 🆘 Need Help?

Check the full README.md for:
- Complete API documentation
- Deployment guides
- Security details
- Frontend integration examples

---

**You're all set! 🎉**

Start building your portfolio admin panel and connect your frontend to these endpoints.

