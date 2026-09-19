# ColonyGames Architecture & System Design

## Overview
ColonyGames is a full-stack, enterprise-grade sports fest tournament registration and management platform built specifically for residential societies and housing colonies. It automates resident registration, team allocations, QR pass generation, live gate check-in, and real-time scoreboards.

## Architecture Stack
- **Framework**: Next.js 15 (App Router with Server & Client Components)
- **Language**: TypeScript (Strict typing across models, routes, and components)
- **Styling**: Tailwind CSS + Custom CSS Variables (Oceanic White, Royal Blue, Sky Cyan)
- **Database**: MongoDB Atlas with Mongoose ODM (Connection pooling and SRV fallback)
- **Authentication**: JWT HttpOnly Cookies + Bcrypt password hashing + Role-Based Access (Resident & Admin)
- **Validation**: Zod schema validation on all client forms and server endpoints
- **Document Generation**: jsPDF (Vector badges and physical entry passes)
- **QR Code Engine**: qrcode library generating high-contrast, fault-tolerant barcodes
- **Email Dispatch**: Nodemailer with Gmail SMTP and PDF attachments

## Entity Relationship Model

```
+----------------+          +-------------------+
|     User       | 1      1 |      Family       |
|  (Auth/Role)   +----------+ (House/Block/Name)|
+-------+--------+          +---------+---------+
        |                             |
        |                             | 1
        |                             |
        |                             | N
        |                   +---------v---------+
        |                   |    Participant    |
        |                   | (Name/Age/Size)   |
        |                   +---------+---------+
        |                             |
        |                             | N
        v N                           v
+-------+--------+          +---------+---------+
|  Registration  | N      1 |       Event       |
|  (Pass/Status) +----------> (Rules/Capacity)  |
+-------+--------+          +---------+---------+
        |                             |
        | 1                           | 1
        v N                           v N
+-------+--------+          +---------+---------+
|  CheckIn Log   |          |      Result       |
|  (Gate/Time)   |          |  (Gold/Silver/Br) |
+----------------+          +-------------------+
```

## Security & Privacy
1. Passwords hashed using bcrypt with salt rounds = 10.
2. JWT tokens signed with HS256 and stored in secure HttpOnly cookies.
3. Gate check-ins verified cryptographically against registration IDs.
4. `.env.local` excluded from version control with `.env.example` template provided.
