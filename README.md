# Smart Contact Manager Application

A complete full-stack contact management application built with React.js and Spring Boot.

## 🚀 Features

### User Features
- User Registration and Login
- Add, Update, Delete Contacts
- View All Contacts
- Search Contacts (by name, email, phone)
- Protected Routes with JWT Authentication

### Admin Features
- Admin Login
- View All Users
- Delete Users
- View Contacts of Any User

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- React Router DOM
- Axios
- Bootstrap 5
- React Bootstrap

### Backend
- Java Spring Boot 3.2.0
- Spring Security
- JWT Authentication
- Spring Data JPA
- MySQL Database

## 📁 Project Structure

```
majorScm/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/smartcontactmanager/
│   │   │   │   ├── entity/          # User, Contact entities
│   │   │   │   ├── repository/       # JPA repositories
│   │   │   │   ├── dto/              # Data Transfer Objects
│   │   │   │   ├── service/          # Business logic
│   │   │   │   ├── controller/       # REST controllers
│   │   │   │   ├── security/          # Security configuration
│   │   │   │   └── util/             # JWT utilities
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── schema.sql
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🗄️ Database Setup

### 1. Install MySQL
- Download and install MySQL from [mysql.com](https://dev.mysql.com/downloads/)
- Start MySQL service

### 2. Create Database
Run the SQL script provided in `backend/src/main/resources/schema.sql`:

```sql
CREATE DATABASE IF NOT EXISTS smart_contact_manager;
USE smart_contact_manager;
-- Tables will be created automatically by Hibernate
```

### 3. Default Admin Credentials
- **Email:** admin@admin.com
- **Password:** admin123

## ⚙️ Backend Setup

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

### Steps

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Update database credentials in `application.properties`:**
   ```properties
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   ```

3. **Build and run the application:**
   ```bash
   # Using Maven
   mvn clean install
   mvn spring-boot:run
   ```

   Or run the main class `SmartContactManagerApplication.java` from your IDE.

4. **Backend will run on:** `http://localhost:8080`

## 🎨 Frontend Setup

### Prerequisites
- Node.js 16+ and npm

### Steps

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Frontend will run on:** `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login

### Contacts (Protected - Requires JWT)
- `GET /api/contacts` - Get all contacts for current user
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/{id}` - Update contact
- `DELETE /api/contacts/{id}` - Delete contact
- `GET /api/contacts/search?keyword={keyword}` - Search contacts

### Admin (Protected - Requires Admin Role)
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/{id}` - Delete user
- `GET /api/admin/users/{userId}/contacts` - Get contacts of a user

## 🔐 Security

- JWT tokens are stored in localStorage
- Tokens expire after 24 hours
- Password encryption using BCrypt
- Role-based access control (ROLE_USER, ROLE_ADMIN)
- CORS enabled for frontend origins

## 🐛 Common Issues & Solutions

### Backend Issues

1. **Port 8080 already in use:**
   - Change port in `application.properties`: `server.port=8081`

2. **MySQL connection error:**
   - Check MySQL service is running
   - Verify credentials in `application.properties`
   - Ensure database exists

3. **JWT errors:**
   - Check `jwt.secret` in `application.properties`
   - Ensure secret key is at least 256 bits

### Frontend Issues

1. **CORS errors:**
   - Verify backend CORS configuration
   - Check API base URL in `.env` file

2. **API connection failed:**
   - Ensure backend is running on port 8080
   - Check `VITE_API_BASE_URL` in `.env`

3. **Module not found:**
   - Run `npm install` again
   - Delete `node_modules` and reinstall

## 🧪 Testing the Application

1. **Register a new user:**
   - Go to Register page
   - Fill in name, email, password
   - You'll be redirected to dashboard

2. **Add contacts:**
   - Click "Add Contact" button
   - Fill in contact details
   - Save and view in the table

3. **Search contacts:**
   - Use search bar to find contacts
   - Search by name, email, or phone

4. **Admin login:**
   - Use admin credentials: admin@admin.com / admin123
   - View all users and their contacts
   - Delete users if needed

## 📝 Notes

- JWT tokens are stored in browser localStorage
- Passwords are hashed using BCrypt
- Database tables are auto-created by Hibernate
- All API requests include JWT token in Authorization header

## 👨‍💻 Development

### Backend Development
- Use Spring Boot DevTools for hot reload
- Check logs in console for debugging
- Database changes are logged when `spring.jpa.show-sql=true`

### Frontend Development
- Vite provides fast HMR (Hot Module Replacement)
- Check browser console for errors
- Network tab shows API requests/responses

## 📄 License

This project is created for educational purposes.

## 🙏 Acknowledgments

- Spring Boot Team
- React Team
- Bootstrap Team

---

**Happy Coding! 🚀**
