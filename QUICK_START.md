# ⚡ Quick Start Guide

## 🚀 Running the Project (Quick Steps)

### Prerequisites Check
- ✅ Java 17+ installed (`java -version`)
- ✅ Maven installed (`mvn --version`)
- ✅ Node.js 16+ installed (`node --version`)
- ✅ MySQL 8.0+ running

### Step 1: Start MySQL (if not running)
```powershell
# Windows PowerShell (as Administrator)
Start-Service MySQL80

# Or check in Services
Win + R → services.msc → Find "MySQL80" → Start
```

### Step 2: Start Backend Server

**Option A: Using VS Code**
1. Open `backend` folder in VS Code
2. Press `F5` or Run → Start Debugging
3. Wait for: `Started SmartContactManagerApplication`

**Option B: Using Terminal**
```bash
cd backend
mvn spring-boot:run
```

**Backend runs on:** `http://localhost:8080`

### Step 3: Start Frontend Server

**Option A: Using VS Code Terminal**
1. Press `` Ctrl + ` `` to open terminal
2. New Terminal: `Ctrl + Shift + ` ``
3. Run:
```bash
cd frontend
npm run dev
```

**Option B: Using Command Prompt/PowerShell**
```bash
cd frontend
npm install  # Only first time or after package.json changes
npm run dev
```

**Frontend runs on:** `http://localhost:5173`

### Step 4: Open in Browser

Once both servers are running:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080/api/auth/register`

**Chrome will open automatically when frontend starts!**

## 🎯 Default Login Credentials

**Admin Account:**
- Email: `admin@admin.com`
- Password: `admin123`

**Regular User:**
- Register a new account from the Register page

## ⚠️ Troubleshooting

### Port Already in Use

**Backend (8080):**
```properties
# Edit backend/src/main/resources/application.properties
server.port=8081
```

**Frontend (5173):**
```javascript
// Edit frontend/vite.config.js
server: {
  port: 5174
}
```

### MySQL Connection Error

1. Check MySQL is running:
```powershell
Get-Service MySQL80
```

2. Verify credentials in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

3. Test MySQL connection:
```bash
mysql -u root -p
```

### Backend Won't Start

1. Check Java version (need 17+):
```bash
java -version
```

2. Clean and rebuild:
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Won't Start

1. Clear cache and reinstall:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

2. Check Node.js version (need 16+):
```bash
node --version
```

## 📝 VS Code Tips

### Running Both Servers

**Method 1: Two Terminals**
- Terminal 1: `cd backend && mvn spring-boot:run`
- Terminal 2: `cd frontend && npm run dev`

**Method 2: Using Tasks**
- `Ctrl+Shift+P` → "Tasks: Run Task" → "Start All Servers"
- (See `VS_CODE_RUN_GUIDE.md` for setup)

**Method 3: Compound Launch**
- Press `F5` → Select "Launch Full Stack"
- (See `VS_CODE_RUN_GUIDE.md` for configuration)

### Useful VS Code Shortcuts
- Open Terminal: `` Ctrl + ` ``
- Run/Debug: `F5`
- Command Palette: `Ctrl+Shift+P`
- Quick Open: `Ctrl+P`

## ✅ Verification Checklist

Before opening the app, verify:

- [ ] MySQL service is running
- [ ] Database credentials are correct
- [ ] Backend terminal shows: "Started SmartContactManagerApplication"
- [ ] Frontend terminal shows: "Local: http://localhost:5173"
- [ ] No errors in either terminal
- [ ] Browser opens to `http://localhost:5173`

## 🔗 Useful Links

- Full VS Code Guide: `VS_CODE_RUN_GUIDE.md`
- Project README: `README.md`
- Setup Instructions: `SETUP.md`

---

**Need Help?** Check the terminal output for errors and browser console (F12) for frontend issues.
