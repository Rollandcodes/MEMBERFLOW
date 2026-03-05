# MemberFlow 🚀

MemberFlow is an automated onboarding, engagement, and retention platform for creators who run paid communities and memberships on Whop.

## Features

- **Whop Auth**: Seamless creator authentication using Whop SDK.
- **Campaign Builder**: Visual sequence builder for automated messaging.
- **Member Manager**: Track member lifecycle and activity.
- **Messaging Engine**: Automated DM delivery via Whop API.
- **Analytics**: Deep insights into campaign performance and member retention.
- **Subscription Billing**: Monetize your tool with Starter, Growth, and Pro plans.

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS, Shadcn UI
- **Backend**: Next.js API Routes (Serverless)
- **Database**: Supabase PostgreSQL
- **Auth/Payments**: Whop SDK
- **Charts**: Recharts

## Getting Started

### 1. Prerequisites

- [Whop Developer Account](https://whop.com/developers)
- [Supabase Project](https://supabase.com)
- [Vercel Account](https://vercel.com)

### 2. Environment Variables

Create a `.env.local` file with the following:

```env
# Whop Config
WHOP_API_KEY=your_whop_api_key
WHOP_COMPANY_ID=your_whop_company_id

# Supabase Config
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

### 3. Database Setup

Run the SQL provided in `database/schema.sql` in your Supabase SQL Editor.

### 4. Installation

```bash
npm install
npm run dev
```

## Deployment to Vercel

1. **GitHub**: Push your code to a GitHub repository.
2. **Vercel**: Connect your GitHub repo to Vercel.
3. **Environment Variables**: Configure the environment variables in the Vercel dashboard.
4. **Deploy**: Click "Deploy" and your SaaS is live!

## Messaging Engine (Cron Job)

The messaging engine is triggered via a GET request to `/api/messages/process`. You can set up a Vercel Cron Job to hit this endpoint every hour:

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/messages/process",
      "schedule": "0 * * * *"
    }
  ]
}
```

## Security

- **Rate Limiting**: API routes are designed for serverless execution.
- **Environment Variables**: Never commit `.env` files to version control.
- **API Authentication**: Protect the cron endpoint with a secret header in production.

---

Built by **MemberFlow Team** 🚀
