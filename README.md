# Simple GA Viewer

A production-ready SaaS application for viewing Google Analytics 4 data with a clean dashboard, AI-powered insights, and caching.

## Features

- 🔐 Google OAuth authentication with GA4 read-only scope
- 📊 Real-time GA4 analytics dashboard
- 🤖 AI-powered insights (rule-based + optional OpenAI)
- ⚡ Redis caching with Upstash
- 📱 Responsive design with ShadCN UI

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + ShadCN UI
- **Auth**: NextAuth v5 (Auth.js) with Google OAuth
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Upstash Redis
- **Analytics**: Google Analytics Data API v1 (GA4)
- **Charts**: Recharts

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in values
3. Run `npm install`
4. Run `npx prisma generate && npx prisma db push`
5. Run `npm run dev`

## Environment Variables

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."
OPENAI_API_KEY="..."  # Optional
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google Analytics Data API and Google Analytics Admin API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/api/auth/callback/google` as authorized redirect URI

## License

MIT
