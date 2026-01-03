# Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory with the following content:

```env
MONGODB_URI=mongodb://localhost:27017/hospital-management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
COOKIE_NAME=auth-token
NODE_ENV=development
```

**Important Notes:**
- Replace `MONGODB_URI` with your MongoDB connection string
  - For local MongoDB: `mongodb://localhost:27017/hospital-management`
  - For MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/hospital-management`
- Replace `JWT_SECRET` with a strong, random string (at least 32 characters)
  - You can generate one using: `openssl rand -base64 32`
- The `.env.local` file is already in `.gitignore` and won't be committed

### 3. Start MongoDB

**Local MongoDB:**
- Make sure MongoDB is installed and running
- On Windows: Start MongoDB service or run `mongod.exe`
- On macOS/Linux: Run `mongod` in terminal

**MongoDB Atlas (Cloud):**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and get your connection string
- Update `MONGODB_URI` in `.env.local`

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Creating Test Users

### Option 1: Register via UI
1. Navigate to `/register`
2. Register a new account (defaults to "patient" role)

### Option 2: Create Admin/Doctor via MongoDB

You can manually create admin or doctor users in MongoDB:

```javascript
// In MongoDB shell or MongoDB Compass
use hospital-management

db.users.insertOne({
  name: "Admin User",
  email: "admin@hospital.com",
  password: "$2a$10$...", // bcrypt hash of password
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

To generate a bcrypt hash, you can use Node.js:

```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('your-password', 10);
console.log(hash);
```

## Default Roles

- **admin**: Full system access, can manage all patients
- **doctor**: Can view all patients, create appointments and medical records
- **patient**: Can view own information and medical records

## Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB is running: `mongosh` or `mongo`
- Check connection string format
- For Atlas: Ensure IP whitelist includes your IP (0.0.0.0/0 for development)

### Authentication Issues
- Clear browser cookies
- Verify JWT_SECRET is set correctly
- Check that cookies are being set (use browser DevTools)

### Build Errors
- Delete `node_modules` and `.next` folder
- Run `npm install` again
- Check Node.js version (requires 18+)

## Production Deployment

1. Set `NODE_ENV=production` in environment variables
2. Use a strong, unique `JWT_SECRET`
3. Ensure MongoDB connection uses SSL/TLS
4. Set secure cookie flags in production
5. Use environment variables from your hosting platform (Vercel, Heroku, etc.)

## Next Steps

- Review the [README.md](./README.md) for more information
- Check API routes in `app/api/` directory
- Customize models in `models/` directory
- Modify UI components in `components/` and `app/` directories

