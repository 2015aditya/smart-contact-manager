# Quick Setup Guide

## Prerequisites

### Backend
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

### Frontend
- Node.js 16+ and npm

## Step-by-Step Setup

### 1. Database Setup

1. **Start MySQL Server**
   ```bash
   # Windows
   net start MySQL80
   
   # Linux/Mac
   sudo systemctl start mysql
   ```

2. **Create Database**
   - Open MySQL command line or MySQL Workbench
   - Run the SQL script: `backend/src/main/resources/schema.sql`
   - Or manually create:
     ```sql
     CREATE DATABASE smart_contact_manager;
     ```

3. **Update Database Credentials**
   - Edit `backend/src/main/resources/application.properties`
   - Update username and password:
     ```properties
     spring.datasource.username=root
     spring.datasource.password=YOUR_PASSWORD
     ```

### 2. Backend Setup

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Build the project**
   ```bash
   mvn clean install
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```
   
   Or run `SmartContactManagerApplication.java` from your IDE.

4. **Verify backend is running**
   - Open browser: `http://localhost:8080`
   - You should see a Whitelabel Error Page (this is normal, means server is running)

### 3. Frontend Setup

1. **Navigate to frontend folder**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Verify frontend is running**
   - Open browser: `http://localhost:5173`
   - You should see the Welcome page

## Default Admin Credentials

- **Email:** admin@admin.com
- **Password:** admin123

## Testing the Application

1. **Register a new user:**
   - Click "Register" or "Get Started"
   - Fill in name, email, password
   - You'll be automatically logged in

2. **Add contacts:**
   - Go to User Dashboard
   - Click "Add Contact"
   - Fill in contact details and save

3. **Search contacts:**
   - Use the search bar in User Dashboard
   - Search by name, email, or phone

4. **Admin features:**
   - Logout and go to Admin Login
   - Use admin credentials
   - View all users and their contacts
   - Delete users if needed

## Troubleshooting

### Backend won't start
- Check MySQL is running
- Verify database credentials
- Check port 8080 is not in use
- Look at console logs for errors

### Frontend won't start
- Run `npm install` again
- Delete `node_modules` and reinstall
- Check Node.js version (should be 16+)

### CORS errors
- Ensure backend is running on port 8080
- Check `VITE_API_BASE_URL` in frontend `.env` file
- Verify CORS configuration in `SecurityConfig.java`

### Database connection errors
- Verify MySQL service is running
- Check database name matches: `smart_contact_manager`
- Verify username and password in `application.properties`

## Project Structure

```
majorScm/
├── backend/              # Spring Boot backend
│   ├── src/main/java/   # Java source code
│   └── pom.xml          # Maven dependencies
├── frontend/            # React frontend
│   ├── src/             # React source code
│   └── package.json     # npm dependencies
└── README.md            # Full documentation
```

## Next Steps

- Customize the application
- Add more features
- Deploy to production
- Add unit tests

Happy coding! 🚀
