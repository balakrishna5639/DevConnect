# 🚀 DevConnect Deployment Guide

This guide will help you deploy DevConnect to production with best practices.

## 📋 Pre-Deployment Checklist

### ✅ Code Quality
- [ ] All features working locally
- [ ] No console errors or warnings
- [ ] Responsive design tested on multiple devices
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Form validation working

### ✅ Security
- [ ] Environment variables secured
- [ ] JWT secret is strong and unique
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Password hashing working

### ✅ Performance
- [ ] Images optimized
- [ ] Bundle size optimized
- [ ] Database queries optimized
- [ ] Caching implemented where needed
- [ ] Compression enabled

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare for Deployment
1. **Build the project locally to test**
   ```bash
   npm run build
   ```

2. **Update API base URL for production**
   ```javascript
   // src/services/api.js
   const API_BASE_URL = process.env.NODE_ENV === 'production' 
     ? 'https://your-backend-url.railway.app/api'
     : 'http://localhost:5000/api';
   ```

### Step 2: Deploy to Vercel
1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Step 3: Configure Environment Variables
In Vercel Dashboard:
```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

## 🖥️ Backend Deployment (Railway)

### Step 1: Prepare Backend
1. **Create production start script**
   ```json
   // package.json
   {
     "scripts": {
       "start": "node server/server.js",
       "dev": "concurrently \"npm run server\" \"npm run client\"",
       "server": "nodemon server/server.js"
     }
   }
   ```

2. **Add PORT configuration**
   ```javascript
   // server/server.js
   const PORT = process.env.PORT || 5000;
   ```

### Step 2: Deploy to Railway
1. **Create Railway account** at [railway.app](https://railway.app)

2. **Connect GitHub repository**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your DevConnect repository

3. **Configure Environment Variables**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/devconnect
   JWT_SECRET=your_super_secure_jwt_secret_for_production
   NODE_ENV=production
   CLIENT_URL=https://your-frontend-domain.vercel.app
   ```

4. **Deploy automatically** - Railway will build and deploy on every push

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free account
3. Create new cluster

### Step 2: Configure Database
1. **Create database user**
   - Database Access → Add New Database User
   - Choose password authentication
   - Give read/write access

2. **Configure network access**
   - Network Access → Add IP Address
   - Add `0.0.0.0/0` for all IPs (or specific IPs for security)

3. **Get connection string**
   - Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database password

## 🔧 Environment Variables Reference

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

### Backend (.env)
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/devconnect

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_characters

# Server
PORT=5000
NODE_ENV=production

# CORS
CLIENT_URL=https://your-frontend-domain.vercel.app

# Optional: File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🚀 Deployment Commands

### Quick Deploy Script
Create `deploy.sh`:
```bash
#!/bin/bash
echo "🚀 Deploying DevConnect..."

# Build frontend
echo "📦 Building frontend..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

# Push to GitHub (triggers Railway deployment)
echo "🚂 Triggering backend deployment..."
git add .
git commit -m "deploy: production deployment"
git push origin main

echo "✅ Deployment complete!"
echo "Frontend: Check Vercel dashboard"
echo "Backend: Check Railway dashboard"
```

Make executable and run:
```bash
chmod +x deploy.sh
./deploy.sh
```

## 📊 Post-Deployment Testing

### ✅ Frontend Tests
- [ ] All pages load correctly
- [ ] Authentication works
- [ ] API calls successful
- [ ] Responsive design working
- [ ] Images loading properly

### ✅ Backend Tests
- [ ] All API endpoints responding
- [ ] Database connections working
- [ ] Authentication middleware working
- [ ] File uploads working (if implemented)
- [ ] CORS configured correctly

### ✅ Integration Tests
- [ ] Login/signup flow
- [ ] Create/edit/delete posts
- [ ] Like/comment functionality
- [ ] Follow/unfollow system
- [ ] GitHub API integration
- [ ] Profile updates

## 🔍 Monitoring & Maintenance

### Performance Monitoring
- Use Vercel Analytics for frontend
- Monitor Railway metrics for backend
- Set up MongoDB Atlas monitoring

### Error Tracking
- Implement error logging
- Set up alerts for critical errors
- Monitor API response times

### Regular Maintenance
- Update dependencies monthly
- Monitor security vulnerabilities
- Backup database regularly
- Review and rotate secrets

## 🆘 Troubleshooting

### Common Issues

**CORS Errors**
```javascript
// server/server.js
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
```

**Environment Variables Not Loading**
- Check variable names (no typos)
- Restart deployment after changes
- Verify in platform dashboard

**Database Connection Issues**
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Test connection locally first

**Build Failures**
- Check all dependencies installed
- Verify Node.js version compatibility
- Review build logs for specific errors

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review deployment platform documentation
3. Check GitHub issues for similar problems
4. Create detailed issue report with logs

---

**Happy Deploying! 🚀**