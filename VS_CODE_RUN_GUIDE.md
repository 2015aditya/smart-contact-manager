# 🚀 How to Run Smart Contact Manager in VS Code

This guide will help you run both the backend and frontend servers directly from VS Code.

## 📋 Prerequisites

Before running the project, ensure you have:

- ✅ **Java 17 or higher** (JDK 17+)
- ✅ **Maven 3.6+** (for backend)
- ✅ **Node.js 16+ and npm** (for frontend)
- ✅ **MySQL 8.0+** (database server)
- ✅ **VS Code** with recommended extensions

## 🔧 VS Code Extensions (Recommended)

Install these extensions for better development experience:

1. **Extension Pack for Java** (Microsoft)
   - Includes Java Language Support, Debugger, Maven, etc.

2. **Spring Boot Extension Pack** (VMware)
   - Spring Boot support and tools

3. **ES7+ React/Redux/React-Native snippets**
   - React code snippets

4. **Prettier - Code formatter**
   - Code formatting

5. **REST Client** (optional)
   - Test API endpoints directly from VS Code

## 🗄️ Step 1: Setup MySQL Database

### 1.1 Start MySQL Server

Make sure MySQL is running on your system:

**Windows (using Services):**
```
Win + R → services.msc → Find "MySQL" → Start service
```

**Windows (using Command Prompt as Administrator):**
```cmd
net start MySQL80
```

**PowerShell (as Administrator):**
```powershell
Start-Service MySQL80
```

### 1.2 Create Database

The database will be created automatically when you run the backend (if `createDatabaseIfNotExist=true` is set), OR manually run:

```sql
CREATE DATABASE IF NOT EXISTS smart_contact_manager;
```

### 1.3 Update Database Credentials

Open `backend/src/main/resources/application.properties` and update:

```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

**Default Admin Account:**
- Email: `admin@admin.com`
- Password: `admin123`

## 🔷 Step 2: Run Backend (Spring Boot)

### Method 1: Using VS Code Java Extension

1. **Open Backend Folder:**
   - Open VS Code
   - File → Open Folder → Select `backend` folder

2. **Wait for Java Project to Load:**
   - VS Code will automatically detect it's a Maven/Spring Boot project
   - Wait for dependencies to download (shown in bottom status bar)

3. **Run the Application:**
   - Press `F5` (or Debug → Start Debugging)
   - OR Click on the "Run and Debug" icon in sidebar (Ctrl+Shift+D)
   - Select "Java" configuration
   - Click the green play button

4. **Alternative: Run from Main Class:**
   - Navigate to `SmartContactManagerApplication.java`
   - Click "Run" button above `main` method
   - OR Right-click → "Run Java"

5. **Verify Backend is Running:**
   - Check terminal output for: `Started SmartContactManagerApplication`
   - Backend runs on: `http://localhost:8080`
   - Test: Open browser → `http://localhost:8080/api/auth/login` (should return error if not POST, but confirms server is running)

### Method 2: Using Integrated Terminal in VS Code

1. **Open Terminal in VS Code:**
   - Press `` Ctrl + ` `` (backtick) or View → Terminal
   - Navigate to backend directory:
   ```bash
   cd backend
   ```

2. **Run with Maven:**
   ```bash
   mvn spring-boot:run
   ```

3. **OR Build first then run:**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

### Method 3: Create Launch Configuration (Recommended)

Create `.vscode/launch.json` in the **root** directory:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "java",
            "name": "Launch Backend",
            "request": "launch",
            "mainClass": "com.smartcontactmanager.SmartContactManagerApplication",
            "projectName": "smart-contact-manager",
            "cwd": "${workspaceFolder}/backend",
            "env": {
                "SPRING_PROFILES_ACTIVE": "dev"
            }
        }
    ]
}
```

Then press `F5` to run!

## 🎨 Step 3: Run Frontend (React + Vite)

### Method 1: Using Integrated Terminal

1. **Open New Terminal in VS Code:**
   - Press `` Ctrl + Shift + ` `` for new terminal
   - OR Terminal → New Terminal

2. **Navigate to Frontend:**
   ```bash
   cd frontend
   ```

3. **Install Dependencies (if not already installed):**
   ```bash
   npm install
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

5. **Verify Frontend is Running:**
   - You'll see: `Local: http://localhost:5173`
   - Vite automatically opens browser, OR manually open:
   - `http://localhost:5173`

### Method 2: Create Task Configuration

Create `.vscode/tasks.json` in the **root** directory:

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Start Backend",
            "type": "shell",
            "command": "mvn spring-boot:run",
            "options": {
                "cwd": "${workspaceFolder}/backend"
            },
            "problemMatcher": [],
            "isBackground": true,
            "presentation": {
                "reveal": "always",
                "panel": "new"
            }
        },
        {
            "label": "Start Frontend",
            "type": "shell",
            "command": "npm run dev",
            "options": {
                "cwd": "${workspaceFolder}/frontend"
            },
            "problemMatcher": [],
            "isBackground": true,
            "presentation": {
                "reveal": "always",
                "panel": "new"
            }
        },
        {
            "label": "Start All Servers",
            "dependsOn": ["Start Backend", "Start Frontend"],
            "problemMatcher": []
        }
    ]
}
```

**To use tasks:**
- Press `Ctrl+Shift+P` (Command Palette)
- Type: "Tasks: Run Task"
- Select "Start All Servers" or individual tasks

## 🚀 Step 4: Running Both Servers Together

### Option 1: Two Terminals (Easiest)

1. **Terminal 1 (Backend):**
   ```
   cd backend
   mvn spring-boot:run
   ```

2. **Terminal 2 (Frontend):**
   ```
   cd frontend
   npm run dev
   ```

### Option 2: Using Compound Configuration

Update `.vscode/launch.json`:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "java",
            "name": "Backend (Spring Boot)",
            "request": "launch",
            "mainClass": "com.smartcontactmanager.SmartContactManagerApplication",
            "projectName": "smart-contact-manager",
            "cwd": "${workspaceFolder}/backend"
        },
        {
            "type": "node",
            "name": "Frontend (Vite)",
            "request": "launch",
            "runtimeExecutable": "npm",
            "runtimeArgs": ["run", "dev"],
            "cwd": "${workspaceFolder}/frontend",
            "serverReadyAction": {
                "pattern": "Local: (https?://localhost:[0-9]+)",
                "uriFormat": "%s",
                "action": "openExternally"
            }
        }
    ],
    "compounds": [
        {
            "name": "Launch Full Stack",
            "configurations": ["Backend (Spring Boot)", "Frontend (Vite)"]
        }
    ]
}
```

**To run both:**
- Press `F5`
- Select "Launch Full Stack" from dropdown
- Both servers will start!

## 🌐 Step 5: Open in Browser

Once both servers are running:

1. **Frontend:** `http://localhost:5173`
2. **Backend API:** `http://localhost:8080`
3. **Backend Health Check:** `http://localhost:8080/api/auth/register` (POST request)

### Default Credentials

**Admin:**
- Email: `admin@admin.com`
- Password: `admin123`

## 🐛 Troubleshooting

### Backend Issues

**Port 8080 already in use:**
```properties
# Change in application.properties
server.port=8081
```

**MySQL Connection Error:**
- Check MySQL is running: `mysql --version`
- Verify credentials in `application.properties`
- Test connection: `mysql -u root -p`

**Maven Build Fails:**
```bash
cd backend
mvn clean install -U
```

**Java Version Issues:**
- Check Java version: `java -version` (should be 17+)
- Set JAVA_HOME environment variable if needed

### Frontend Issues

**Port 5173 already in use:**
```javascript
// Update vite.config.js
server: {
  port: 5174  // Change port
}
```

**Module not found:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**API Connection Failed:**
- Ensure backend is running on port 8080
- Check CORS configuration in backend
- Verify `VITE_API_BASE_URL` in frontend (if using .env)

**npm command not found:**
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart VS Code after installation

### VS Code Specific Issues

**Java Extension not working:**
- Install "Extension Pack for Java" from Microsoft
- Reload VS Code window: `Ctrl+Shift+P` → "Developer: Reload Window"
- Check Java is in PATH: `java -version`

**Terminal not opening:**
- Use `` Ctrl + ` `` to toggle terminal
- Check View → Terminal is enabled

**Tasks not running:**
- Ensure `.vscode/tasks.json` is in root directory
- Check JSON syntax is valid
- Use `Ctrl+Shift+P` → "Tasks: Run Task"

## 📝 VS Code Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Terminal | `` Ctrl + ` `` |
| New Terminal | `Ctrl + Shift + ` `` |
| Run/Debug | `F5` |
| Command Palette | `Ctrl+Shift+P` |
| Quick Open File | `Ctrl+P` |
| Find in Files | `Ctrl+Shift+F` |
| Format Document | `Shift+Alt+F` |
| Toggle Sidebar | `Ctrl+B` |

## ✅ Verification Checklist

Before opening the application, verify:

- [ ] MySQL is running
- [ ] Database `smart_contact_manager` exists
- [ ] Database credentials in `application.properties` are correct
- [ ] Backend server started on port 8080 (check terminal)
- [ ] Frontend server started on port 5173 (check terminal)
- [ ] No errors in either terminal
- [ ] Browser opens to `http://localhost:5173`

## 🎯 Quick Start Commands Summary

```bash
# Terminal 1 - Backend
cd backend
mvn spring-boot:run

# Terminal 2 - Frontend  
cd frontend
npm run dev

# Open browser
# http://localhost:5173
```

## 📚 Additional Resources

- [VS Code Java Documentation](https://code.visualstudio.com/docs/languages/java)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

---

**Happy Coding! 🚀**

For issues or questions, check the terminal output and browser console for error messages.
