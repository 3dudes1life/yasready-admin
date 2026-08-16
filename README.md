# YasReady Admin — Business 360 Build 2

## DESTINATION
ADMIN GITHUB ONLY — repo: `yasready-admin`

DO NOT upload to the customer YasReady GitHub.

## Build 2 adds
- Business segmentation filters + CSV export
- Business 360 with functional tabs:
  Overview / Workspace / KPIs / Financials / Activity / Support / Subscription
- Local admin notes persistence
- Business tags: VIP / Churn Risk / Connect Ready / Needs Follow-up
- Churn / opportunity / healthy signals on Overview
- Enhanced Support Inbox:
  reply, resolve, macro, Business 360 context
- Revenue transactions + CSV export
- Retention cohort analytics surface
- Feature flags
- Admin task list
- Local admin audit log
- Expanded conceptual role model
- More explicit backend/API contract surfaces

## Still mock/local by design
No real accounts, Cloudflare API, D1, Stripe, realtime chat, email, Google sync, or production analytics.

## Architecture target
Customer web + iOS + Android + Admin -> shared YasReady API -> Cloudflare backend services.

## Naming
This is ADMIN product numbering:
Business 360 Build 2

Customer YasReady remains a separate build/version line.
