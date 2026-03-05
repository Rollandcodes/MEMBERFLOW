# Alternative Scheduler Configuration 🕒

Since Vercel's native Cron Jobs are restricted on the Free tier, use this GitHub Action to trigger your automation engine every hour.

## GitHub Actions Setup

1. In your GitHub repository, go to **Settings** -> **Secrets and variables** -> **Actions**.
2. Add a new repository secret:
   - **Name**: `CRON_SECRET`
   - **Value**: `7b1bd2c4-8bb6-4bbd-be00-cc75853a8d8f` (Same as in your `.env`)
3. Create a file at `.github/workflows/cron.yml` with the following content:

```yaml
name: Hourly Campaign Processor

on:
  schedule:
    - cron: '0 * * * *' # Every hour
  workflow_dispatch: # Allow manual trigger

jobs:
  ping-cron:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger MemberFlow Engine
        run: |
          curl -X GET "https://memberflow-app.vercel.app/api/cron/process-campaigns" \
          -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

## Manual Trigger
You can also manually trigger the engine for testing:
```bash
curl -X GET "https://memberflow-app.vercel.app/api/cron/process-campaigns" \
-H "Authorization: Bearer 7b1bd2c4-8bb6-4bbd-be00-cc75853a8d8f"
```
