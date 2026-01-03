# Deployment Checklist

Use this checklist to ensure you have everything ready before deploying.

## Pre-Deployment Checklist

### 1. Code Preparation
- [ ] Code is committed to Git
- [ ] Code is pushed to GitHub (or your Git provider)
- [ ] No sensitive data in code (no hardcoded passwords/secrets)
- [ ] `.env.local` is in `.gitignore` (should be already)

### 2. MongoDB Atlas Setup
- [ ] Created MongoDB Atlas account
- [ ] Created a free cluster
- [ ] Created database user with password
- [ ] Copied connection string
- [ ] Connection string format: `mongodb+srv://username:password@cluster.mongodb.net/hospital-management`
- [ ] Network Access configured (Allow from anywhere or specific IPs)

### 3. Environment Variables to Prepare

You'll need these values for your hosting platform:

#### MONGODB_URI
```
Format: mongodb+srv://username:password@cluster.mongodb.net/hospital-management
Example: mongodb+srv://admin:MyPassword123@cluster0.abc123.mongodb.net/hospital-management
```
- [ ] Username: _______________
- [ ] Password: _______________
- [ ] Cluster URL: _______________
- [ ] Full connection string ready

#### JWT_SECRET
```
Generate using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
- [ ] Generated secure random string: _______________

#### COOKIE_NAME
```
Value: auth-token
```
- [ ] Set to: `auth-token`

#### NODE_ENV
```
Value: production
```
- [ ] Set to: `production`

### 4. Hosting Platform Account
- [ ] Chosen platform (Vercel/Netlify/Railway/Render)
- [ ] Account created
- [ ] Connected to GitHub (if using Git-based deployment)

### 5. Post-Deployment
- [ ] Deployment successful
- [ ] App URL: _______________
- [ ] Tested registration
- [ ] Tested login
- [ ] Created admin user
- [ ] Tested admin dashboard
- [ ] All features working

---

## Quick Reference: Environment Variables

Copy this template and fill in your values:

```
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/hospital-management
JWT_SECRET=YOUR_GENERATED_SECRET_KEY_HERE
COOKIE_NAME=auth-token
NODE_ENV=production
```

---

## Generate JWT Secret Command

Run this in your terminal to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET`.

---

## MongoDB Atlas Connection String Format

1. Go to MongoDB Atlas → Connect → Connect your application
2. Copy the connection string
3. Replace `<password>` with your actual password
4. Add database name at the end: `...mongodb.net/hospital-management`

Example:
```
mongodb+srv://admin:MySecurePassword123@cluster0.abc123.mongodb.net/hospital-management?retryWrites=true&w=majority
```

---

## Common Issues & Solutions

### Issue: Build fails
- **Solution**: Check build logs, ensure all dependencies are in package.json

### Issue: Database connection fails
- **Solution**: 
  - Verify connection string is correct
  - Check MongoDB Atlas Network Access (allow from anywhere)
  - Verify database user password is correct

### Issue: Authentication not working
- **Solution**: 
  - Verify JWT_SECRET is set correctly
  - Check COOKIE_NAME matches
  - Clear browser cookies and try again

### Issue: 404 errors
- **Solution**: Verify Next.js routing is working, check if using static export

---

## Support

If you need help:
1. Check the deployment platform's logs
2. Check MongoDB Atlas connection status
3. Verify all environment variables are set correctly
4. Review the full DEPLOYMENT.md guide
