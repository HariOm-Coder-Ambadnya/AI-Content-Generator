# 🚀 Forge — AI Content Generator

Forge is a high-performance, full-stack AI content generation platform designed for creators and marketers. It leverages Spring Boot, React, and Groq to deliver instant content generation.

## 🌟 Features

- **Multi-Source AI**: Powered by Groq (LLama 3.3) for lightning-fast generation.
- **Secure Authentication**: Integrated with Firebase Auth (Google Sign-In).
- **Persistent Storage**: Uses Firestore for saving and managing generated content.
- **Premium UI**: Crafted with Vite, React, Framer Motion, and GSAP.
- **Microservices Ready**: Frontend and Backend are fully containerized.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, GSAP, Framer Motion.
- **Backend**: Spring Boot 3.3, Java 17, Spring Security.
- **AI/API**: Groq API, Firebase Admin SDK.
- **Deployment**: Docker, Vercel (Frontend), Render/AWS/GCP (Backend).

---

## 🚀 Quick Start (Local Development)

### 1. Backend Setup
```bash
cd backend
# Fill in your .env (refer to .env.example)
mvn spring-boot:run
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Fill in your .env (refer to .env.example)
npm run dev
```

---

## 📦 Deployment (Ready for Production)

### Using Docker Compose
The easiest way to deploy the entire stack locally or on a VPS:
```bash
docker-compose up --build
```
This will start:
- **Frontend** at `http://localhost`
- **Backend** at `http://localhost:8080`

### Manual Production Deployment

#### Frontend (Vercel/Netlify)
1. Push the `frontend` directory to a Git repo.
2. Connect to Vercel/Netlify.
3. Set environment variables from `.env.example`.
4. Build Command: `npm run build`
5. Output Directory: `dist`

#### Backend (Render/Heroku/AWS)
1. Push the `backend` directory to a Git repo.
2. Build Command: `mvn clean package -DskipTests`
3. Start Command: `java -jar target/forge-backend-*.jar`
4. Set required environment variables (Firebase Service Account JSON as a secret).

---

## 🔑 Environment Variables

Check `.env.example` in both `frontend` and `backend` directories for the required keys.

> [!IMPORTANT]
> Never commit actual `.env` files to version control. Use secrets management for production.

---

## 🛡️ License
MIT License. Created by **Rishikesh Pawar**.
