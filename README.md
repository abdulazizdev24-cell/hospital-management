# Hospital Management System

A comprehensive hospital management system built with Next.js, MongoDB, and Tailwind CSS. This system provides role-based access control for administrators, doctors, and patients.

## Features

- 🔐 **Secure Authentication** - JWT-based authentication with role-based access control
- 👨‍💼 **Admin Dashboard** - Full system control with patient management
- 👨‍⚕️ **Doctor Dashboard** - Patient records viewing and management
- 👤 **Patient Dashboard** - Personal medical information access
- 📋 **Patient Management** - Create, view, update, and delete patient records
- 📅 **Appointments System** - Schedule and manage appointments
- 📝 **Medical Records** - Store and manage medical records with diagnosis and prescriptions
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hospital-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/hospital-management
   # Or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/hospital-management
   
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   COOKIE_NAME=auth-token
   NODE_ENV=development
   ```

4. **Start MongoDB** (if using local MongoDB)
   ```bash
   # On macOS/Linux
   mongod
   
   # On Windows
   # Start MongoDB service or run mongod.exe
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Registration
1. Navigate to the registration page
2. Fill in your details (name, email, password)
3. New users are registered as "patient" role by default

### Login
1. Use your registered email and password to login
2. You'll be redirected to your role-specific dashboard

### Roles

#### Admin
- Create, view, update, and delete patient records
- Full system access

#### Doctor
- View all patient records
- Search and filter patients
- View patient details

#### Patient
- View personal account information
- View medical records (if available)
- Access personal dashboard

## Project Structure

```
hospital-management/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication routes
│   │   ├── patients/      # Patient management routes
│   │   ├── appointments/  # Appointment routes
│   │   └── medical-records/ # Medical record routes
│   ├── dashboard/
│   │   ├── admin/         # Admin dashboard
│   │   ├── doctor/        # Doctor dashboard
│   │   └── patient/       # Patient dashboard
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   └── page.js            # Landing page
├── components/
│   └── Navbar.js          # Navigation component
├── lib/
│   ├── db.js              # MongoDB connection
│   └── auth.js            # Authentication utilities
├── models/
│   ├── User.js            # User model
│   ├── Patient.js         # Patient model
│   ├── Appointment.js     # Appointment model
│   └── MedicalRecord.js   # Medical record model
└── package.json
```

## API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Patients
- `GET /api/patients` - Get all patients (admin/doctor only)
- `POST /api/patients` - Create patient (admin/doctor only)
- `GET /api/patients/[id]` - Get patient by ID
- `PUT /api/patients/[id]` - Update patient (admin/doctor only)
- `DELETE /api/patients/[id]` - Delete patient (admin only)

### Appointments
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Create appointment (admin/doctor only)

### Medical Records
- `GET /api/medical-records` - Get medical records
- `POST /api/medical-records` - Create medical record (admin/doctor only)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `COOKIE_NAME` | Name of the authentication cookie | Yes |
| `NODE_ENV` | Environment (development/production) | No |

## Testing

The project includes comprehensive tests for utilities and API routes.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

See [TESTING.md](./TESTING.md) for more information about testing.

## Building for Production

```bash
npm run build
npm start
```

## Deployment

This application can be deployed to various free hosting platforms. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Add environment variables:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - A secure random string
   - `COOKIE_NAME` - `auth-token`
   - `NODE_ENV` - `production`
4. Deploy!

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Optimizations

The codebase has been optimized for performance, security, and maintainability:

- **Authentication Middleware**: Centralized auth logic with role-based access control
- **Input Validation**: Comprehensive validation and sanitization utilities
- **Database Indexes**: Optimized queries with proper indexes
- **Pagination**: Efficient data retrieval with pagination support
- **Standardized Responses**: Consistent API response format
- **Connection Pooling**: Optimized database connections for serverless environments

See [OPTIMIZATIONS.md](./OPTIMIZATIONS.md) for detailed information about all optimizations.

## Security Notes

- Change `JWT_SECRET` to a strong, random string in production
- Use HTTPS in production
- Ensure MongoDB is properly secured
- Regularly update dependencies
- All inputs are validated and sanitized
- Password strength validation enforced

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue on the GitHub repository.
