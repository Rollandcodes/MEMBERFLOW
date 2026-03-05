# MemberFlow Deployment Guide 🚀

Follow these steps to deploy the upgraded MemberFlow SaaS platform to production.

## 1. Supabase Setup
- Run the SQL scripts in `database/schema.sql` and then `database/upgrade.sql`.
- Enable Row Level Security (RLS) on your tables.

## 2. Whop Configuration
- Set your **Webhook URL** in the Whop Developer Dashboard to: `https://your-domain.vercel.app/api/webhooks/whop`
- Add the following events: `membership.created`, `membership.cancelled`, `membership.updated`, `membership.expired`.

## 3. Environment Variables
Configure these in Vercel:

```env
# Whop
WHOP_API_KEY=your_api_key
WHOP_COMPANY_ID=your_company_id
WHOP_WEBHOOK_SECRET=your_webhook_secret

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key

# Security
CRON_SECRET=your_random_secret_string
```

## 4. Deployment
Run:
```bash
vercel deploy --prod
```

## 5. Verify Automation
- The Vercel Cron is configured in `vercel.json` to run every hour.
- You can manually test it by hitting: `GET /api/cron/process-campaigns` with the `Authorization: Bearer your_cron_secret` header.
