# ColonyGames 🏆 – Society Sports Fest Platform

[![Live on Vercel](https://img.shields.io/badge/Live-skills--zone.vercel.app-blue?style=for-the-badge&logo=vercel)](https://skills-zone.vercel.app)
[![Next.js 15](https://img.shields.io/badge/Next.js-15_(App_Router)-000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

A full-stack, enterprise-grade sports tournament management and resident registration web application built for residential societies and housing colonies (50+ households, 250+ athletes).

🌐 **Live Demo / Deployment**: [https://skills-zone.vercel.app](https://skills-zone.vercel.app)

---

## ✨ Features

- 🏃‍♂️ **Comprehensive Sports Catalog**: Cricket, Football, Badminton, Table Tennis, 100m Dash, Slow Cycling, and custom society games with real-time capacity progress indicators.
- 📋 **7-Step Registration Wizard**: Head of family contact, society block/flat selection, family roster with t-shirt sizing, sport category allocation with age validation, waiver consent, and instant ticket pass generation.
- 🎫 **Instant Printable Pass & QR Badges**: On-demand vector PDF entry passes rendered via jsPDF with embedded high-contrast QR codes and committee verification watermarks.
- 📱 **Live Gate Check-in Scanner**: Camera-based and manual barcode scanner in `/admin` with audio/haptic feedback, instant household lookup, and check-in timestamp tracking.
- 🏅 **Podium Results & Society Standings**: Real-time 3D medal podium (Gold, Silver, Bronze) with tower/block point aggregations.
- 📬 **Automated Email Dispatch**: Nodemailer with Gmail SMTP delivering HTML confirmation summaries and PDF pass attachments to residents.
- 📊 **Admin Command Center**: Real-time check-in percentage, event capacity manager, CSV/Excel export, and announcements bulletin board.
- 🎨 **Oceanic Athletic Theme**: High-contrast white background with royal blue, cyan, and electric cobalt accents — clean, modern, and accessible.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion
- **Backend**: Next.js Server Components & Route Handlers (`/api/*`)
- **Database**: MongoDB Atlas with Mongoose ODM & connection pooling
- **Authentication**: JWT stored in secure HttpOnly cookies + Bcrypt password hashing
- **Pass Generation**: jsPDF + Canvas QR Code Generator
- **Email Service**: Nodemailer with Gmail SMTP integration

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/sin-07/SkillsZone.git
cd SkillsZone
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your MongoDB Atlas connection string, JWT Secret, and Gmail SMTP credentials.

### 3. Initialize Database with Default Sports & Admin
```bash
# Start development server
npm run dev

# In another terminal, trigger the database seeder:
curl -X POST http://localhost:3000/api/seed
```
*Default Admin Account*: `admin@colonygames.internal` / `adminpassword`

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📖 Documentation
- [Architecture & Design](docs/ARCHITECTURE.md)
- [API Reference](docs/API_DOCUMENTATION.md)
- [Sports Rules & Eligibility](docs/SPORTS_RULES.md)
- [User & Admin Guide](docs/USER_GUIDE.md)
- [Production Deployment](docs/DEPLOYMENT.md)

---

## 📄 License
MIT License © 2026 ColonyGames Sports Committee.
