# Admin Account Setup

## Default Admin Credentials

There are **no default admin credentials**. You need to create an admin account first.

## Method 1: Using the Script (Recommended)

1. Make sure your `.env.local` file has the `MONGODB_URI` set correctly
2. Run the following command:

```bash
npm run create-admin
```

This will create an admin user with:
- **Email:** `admin@hospital.com`
- **Password:** `admin123`

⚠️ **Important:** Change the password after first login!

## Method 2: Manual Creation via MongoDB

If the script doesn't work, you can create an admin user manually:

1. Open MongoDB shell or MongoDB Compass
2. Connect to your database
3. Run the following:

```javascript
use hospital-management

// First, generate a bcrypt hash for password "admin123"
// You can use this online tool: https://bcrypt-generator.com/
// Or use Node.js:
// const bcrypt = require('bcryptjs');
// const hash = bcrypt.hashSync('admin123', 10);
// console.log(hash);

db.users.insertOne({
  name: "Admin User",
  email: "admin@hospital.com",
  password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy", // This is bcrypt hash for "admin123"
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Method 3: Using Node.js REPL

1. Make sure MongoDB is running
2. Open terminal in the project directory
3. Run:

```bash
node
```

Then paste this code:

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/hospital-management')
  .then(async () => {
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String
    }));
    
    const hash = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin User',
      email: 'admin@hospital.com',
      password: hash,
      role: 'admin'
    });
    
    console.log('Admin created!');
    process.exit(0);
  });
```

## After Creating Admin

1. Go to the login page: `http://localhost:3000/login`
2. Use the credentials:
   - Email: `admin@hospital.com`
   - Password: `admin123`
3. Once logged in, you can:
   - Add more staff (doctors, pharmacists, lab technicians)
   - Add patients
   - Assign appointments
   - Manage the entire system

## Security Note

**Always change the default password** after first login. The default password is for initial setup only.

