# 🐾 PawSafe - Login System

ฉันได้สร้างระบบ Login ทดสอบสำหรับ PawSafe โดยใช้ Vite + React + TypeScript สำหรับ Frontend และ Express + TypeScript สำหรับ Backend เชื่อมต่อกับ MongoDB Atlas

## 📁 ไฟล์ที่สร้างขึ้น

### Backend (server/)
```
server/
├── src/
│   ├── index.ts                 # Main Server Entry
│   ├── config/
│   │   └── database.ts          # MongoDB Connection
│   ├── models/
│   │   └── User.ts              # User Schema
│   └── routes/
│       └── auth.ts              # Login & Signup Routes
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript Config
└── .env.example                 # Environment Template
```

### Frontend (client/)
```
client/
├── src/
│   ├── pages/
│   │   ├── LoginPage.tsx        # Login Page UI
│   │   └── DashboardPage.tsx    # Dashboard Page
│   ├── store/
│   │   ├── store.ts             # Redux Store
│   │   ├── authSlice.ts         # Auth Reducer
│   │   └── authActions.ts       # Login/Signup Actions
│   ├── App.tsx                  # Main App with Router
│   └── main.tsx                 # Entry Point with Redux
├── .env                         # API URL Config
├── tailwind.config.js           # Tailwind CSS Config
├── postcss.config.js            # PostCSS Config
└── package.json                 # Dependencies
```

## 🚀 การติดตั้งและรันแอปพลิเคชัน

### ขั้นตอนที่ 1: เตรียม Backend

```bash
cd server
npm install
```

สร้างไฟล์ `.env` จาก `.env.example`:
```bash
cp .env.example .env
```

อัปเดตไฟล์ `.env` ด้วย MongoDB Connection String:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

รัน Backend Server:
```bash
npm run dev
```

### ขั้นตอนที่ 2: เตรียม Frontend

เปิด Terminal ใหม่:

```bash
cd client
npm install
npm run dev
```

Frontend จะ run ที่ `http://localhost:5173`
Backend จะ run ที่ `http://localhost:5000`

## 📝 ทดสอบระบบ Login

### 1. สร้างบัญชีผู้ใช้ใหม่ (Signup)

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "navapan",
    "email": "navapan@example.com",
    "password": "SecurePassword123!",
    "phone": "0812345678",
    "address": "Bangkok, Thailand"
  }'
```

### 2. เข้าสู่ระบบผ่าน Frontend UI

- ไปที่ http://localhost:5173
- กรอก Email: `navapan@example.com`
- กรอก Password: `SecurePassword123!`
- คลิก Login

### 3. Dashboard

หลังจากเข้าสู่ระบบสำเร็จ คุณจะเห็นหน้า Dashboard ที่แสดง:
- ข้อมูลผู้ใช้ (Email, Username, Role, Status)
- ปุ่ม Logout

## 🔧 Features

✅ **Frontend**
- React 19 with Hooks
- TypeScript for type safety
- Redux Toolkit for state management
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- Responsive Design

✅ **Backend**
- Express.js with TypeScript
- MongoDB with Mongoose
- Bcryptjs for password hashing (salt rounds: 10)
- CORS enabled
- Error handling
- Environment variables support

✅ **Authentication**
- User signup with validation
- User login with email/password
- Password hashing with bcryptjs
- User status check (active/inactive)
- Error messages

## 📊 API Endpoints

### Health Check
- `GET /api/health` - ตรวจสอบว่า server ทำงาน

### Authentication
- `POST /api/auth/signup` - สร้างบัญชีใหม่
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "phone": "string (optional)",
    "address": "string (optional)"
  }
  ```

- `POST /api/auth/login` - เข้าสู่ระบบ
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

## ⚠️ Security Notes

1. ✅ Passwords are hashed with bcryptjs (salt: 10)
2. ✅ Input validation on both frontend and backend
3. ✅ CORS enabled for cross-origin requests
4. ✅ MongoDB connection string in environment variables
5. ⚠️ In production: Use HTTPS, JWT tokens, and refresh tokens
6. ⚠️ Never commit `.env` files to version control

## 🔍 Troubleshooting

### Backend ไม่สามารถเชื่อมต่อ MongoDB
- ตรวจสอบ Connection String ใน `.env`
- ตรวจสอบ IP Whitelist ใน MongoDB Atlas
- ตรวจสอบชื่อ database ถูกต้อง

### Frontend ไม่สามารถเชื่อมต่อ Backend
- ตรวจสอบ Backend Server ทำงานบนพอร์ต 5000
- ตรวจสอบ `VITE_API_URL` ใน `client/.env`
- ตรวจสอบ browser console สำหรับ CORS errors

### Login ไม่สำเร็จ
- ตรวจสอบรหัสผ่านถูกต้อง
- ตรวจสอบผู้ใช้มี status "active" ใน MongoDB
- ตรวจสอบ Backend logs สำหรับข้อผิดพลาด

## 📚 Documentation Files

- `SETUP_GUIDE.md` - คำแนะนำการติดตั้งและตั้งค่า
- `QUICKSTART.md` - เริ่มต้นอย่างรวดเร็ว
- `setup.bat` - Script สำหรับ Windows
- `setup.sh` - Script สำหรับ macOS/Linux

## 🎯 ขั้นตอนต่อไป (Optional)

1. **JWT Authentication** - เพิ่ม JWT Tokens แทน Session
2. **Refresh Tokens** - เพิ่มความปลอดภัย
3. **Protected Routes** - ป้องกัน routes ที่ต้อง authentication
4. **User Profile** - ให้ผู้ใช้แก้ไขโปรไฟล์
5. **Password Reset** - ฟีเจอร์ลืมรหัสผ่าน
6. **Email Verification** - ยืนยันอีเมลก่อนใช้งาน

## 📞 Support

หากพบปัญหา:
1. ตรวจสอบ Backend/Frontend logs
2. ตรวจสอบ MongoDB Connection
3. ตรวจสอบ Environment Variables
4. ตรวจสอบ Port Availability (5000, 5173)

---

**Created:** November 21, 2025
**Tech Stack:** Vite, React, TypeScript, Redux Toolkit, Express, MongoDB
**Status:** ✅ Ready for Testing
