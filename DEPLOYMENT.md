# MemberFlow Deployment Guide 🚀

Follow these steps to deploy the upgraded MemberFlow SaaS platform to production.

## 1. Supabase Setup
- Run the SQL scripts in `database/schema.sql` and then `database/upgrade.sql`.
- Enable Row Level Security (RLS) on your tables.

## 2. Whop Configuration
- Set your **Webhook URL** in the Whop Developer Dashboard to: `https://your-domain.vercel.app/api/webhooks/whop`
- Add the following events: `membership.created`, `membership.cancelled`, `membership.updated`, `membership.expired`.

## 3. Environment Variables
Configure these in Vercel or your `.env.local`:

```env
# Whop
WHOP_API_KEY=sk_live_xxx
WHOP_WEBHOOK_SECRET=whop_wh_secret
WHOP_COMPANY_ID=cmp_xxx

# Supabase
SUPABASE_URL=https://...
SUPABASE_KEY=...

# App Config
NEXT_PUBLIC_APP_URL=https://memberflow-eight.vercel.app

# AI
OPENAI_API_KEY=sk-...

# Security & Automation
CRON_SECRET=7b1bd2c4-8bb6-4bbd-be00-cc75853a8d8f
```

## 4. Deployment
Run:
```bash
vercel deploy --prod
```

## 5. Verify Automation
- The Vercel Cron is configured in `vercel.json` to run every hour.
- You can manually test it by hitting: `GET /api/cron/process-campaigns` with the `Authorization: Bearer your_cron_secret` header.
