# MemberFlow - Whop App Manifest & Metadata 📄

Use this document to configure your Whop Developer Console.

## 1. App Store Metadata

| Field | Value |
|-------|-------|
| **App Name** | `MemberFlow` |
| **Short Tagline** | `Automate onboarding & retention for paid communities` |
| **One-line Description** | `Automated DM + onboarding sequences that increase member activation and reduce churn` |
| **Full Description** | `MemberFlow automates welcome messages, drip sequences, and retention flows for creators. Connect your community, pick or generate a campaign, and MemberFlow sends targeted lifecycle messages on triggers (join, inactivity, upgrade). Built as a lightweight SaaS to increase retention and revenue without manual outreach.` |

---

## 2. Permission Declarations (OAuth Scopes)

Declare these scopes in your developer console:

| Scope | Requirement | Justification |
|-------|-------------|---------------|
| `members:read` | **Required** | `List members so creators can target and segment their community` |
| `members:write` | **Required** | `Send DMs and apply tags/roles as part of onboarding sequences` |
| `billing:read` | **Optional** | `Show subscription status for members (optional analytics)` |
| `webhooks:manage` | **Required** | `Register webhook endpoints to receive real-time member events` |

---

## 3. Route Configuration (Vercel URL)

Ensure your **Base URL** (e.g., `https://memberflow-eight.vercel.app`) is set, then configure these paths:

| Path Name | Application Route | Purpose |
|-----------|-------------------|---------|
| **Experience Path** | `/experience/[experienceId]` | Returns the member experience UI for Whop embeds |
| **Discover Path** | `/app/discover` | Serves as the marketing/discovery landing page |
| **Dashboard Path** | `/app/dashboard` | Provides the post-authentication creator dashboard |

---

## 4. Quality Assurance Checklist

- [x] `/app/discover` loads without authentication (Public Landing Page)
- [x] `/app/dashboard` redirects to Whop Login if not authenticated
- [x] `/experience/[experienceId]` renders a specialized view for community members
- [x] All permission justifications are displayed correctly in the app listing
- [x] `/privacy` and `/terms` pages are implemented and linked in footers

## 5. Marketing & Support Assets

| Asset Type | Requirement | Implementation Note |
|------------|-------------|---------------------|
| **Support Email** | `support@memberflow.app` | Primary contact for creators and members |
| **Documentation** | `https://docs.memberflow.app` | (Placeholder) Detailed guides for setup |
| **Marketing Copy 1** | `Automate your community onboarding in seconds.` | High-impact value prop |
| **Marketing Copy 2** | `Reduce churn with targeted lifecycle messaging.` | Problem-solving statement |
| **CTA** | `Start your 14-day free trial today.` | Conversion-focused action |

---

## 6. Screenshot & Asset Guide (Production)

To generate the required assets for the Whop listing:

1. **App Icon**: Export the logo as a `1024x1024` PNG with a transparent background.
2. **Screenshots (1280x720)**:
   - **Campaign Builder**: Highlight the drag-and-drop step interface.
   - **Timeline View**: Show the scheduled message sequence for a member.
   - **Analytics Dashboard**: Display the engagement and sent message charts.
   - **Segmentation**: Show filtering members by tier and status.
3. **Workflow GIF**:
   - Capture: `Create Campaign` -> `Trigger Event (Join)` -> `Message Log Entry`.

