# 🚀 Quick Vercel Deployment - Fill This Out

Use this as a reference while deploying. Fill in your values below.

---

## 📋 Your Information

### MongoDB Atlas Connection String
```
mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER].mongodb.net/hospital-management
```

**Your value:** `_________________________________________________`

### JWT Secret (Generate it now)
Run: `npm run generate-secret`

**Your JWT Secret:** `_________________________________` (64 characters)

---

## ✅ Vercel Environment Variables

Copy these EXACTLY into Vercel:

### 1. MONGODB_URI
```
Key: MONGODB_URI
Value: [Your MongoDB connection string from above]
Environments: ☑ Production ☑ Preview ☑ Development
```

### 2. JWT_SECRET
```
Key: JWT_SECRET
Value: [Your generated secret from above]
Environments: ☑ Production ☑ Preview ☑ Development
```

### 3. COOKIE_NAME
```
Key: COOKIE_NAME
Value: auth-token
Environments: ☑ Production ☑ Preview ☑ Development
```

### 4. NODE_ENV
```
Key: NODE_ENV
Value: production
Environments: ☑ Production only
```

---

## 🔗 Your Deployment URLs

After deployment, fill these in:

**Production URL:** `https://_____________________.vercel.app`

**GitHub Repository:** `https://github.com/_________________/_________________`

---

## ✅ Pre-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] MongoDB connection string copied
- [ ] JWT secret generated
- [ ] MongoDB Network Access set to "Allow from anywhere"
- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] All 4 environment variables added
- [ ] Deployment successful
- [ ] App tested and working
- [ ] Admin user created

---

## 🆘 Quick Troubleshooting

**Build fails?**
→ Check Vercel logs, ensure all dependencies are in package.json

**Can't connect to database?**
→ Check MongoDB Atlas Network Access (must allow 0.0.0.0/0)

**Authentication not working?**
→ Verify JWT_SECRET is set correctly, clear browser cookies

---

## 📞 Need Help?

1. Check `VERCEL_DEPLOYMENT.md` for detailed steps
2. Check Vercel deployment logs
3. Verify all environment variables are set correctly
