# ColonyGames Production Deployment Guide

## Prerequisites
- Node.js 18.18+ or 20+
- MongoDB Atlas cluster (M0 or dedicated)
- Gmail SMTP App Password or SendGrid API key

## Environment Setup
Create `.env.local` based on `.env.example`:

```bash
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/colonygames?retryWrites=true&w=majority"
JWT_SECRET="your-high-entropy-jwt-secret-key-32-chars-minimum"
NEXT_PUBLIC_APP_URL="https://colonygames.internal"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="aniket.singh07vs@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="ColonyGames Sports Committee <aniket.singh07vs@gmail.com>"
```

## Vercel Deployment
1. Connect GitHub repository to Vercel.
2. Select Next.js framework preset.
3. Configure the environment variables in the Vercel project settings dashboard.
4. Trigger production deployment.

## Docker Deployment
```dockerfile
FROM node:20-alpine AS runner
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Database Seeding
After initial deployment, populate sports and committee accounts by calling:
```bash
curl -X POST https://your-domain.com/api/seed
```
Default Administrator:
- Email: `admin@colonygames.internal`
- Password: `adminpassword`
