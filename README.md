# YasReady Admin — Business 360 Build 5 — API-Ready Architecture

## DESTINATION
ADMIN GITHUB ONLY — `yasready-admin`

DO NOT upload to the customer YasReady GitHub.

## Purpose
Build 5 freezes the admin frontend architecture before real Cloudflare services are introduced.

## Added
- AdminAPI abstraction layer
- Major admin screens now pass through simulated API requests before rendering
- Network latency simulation
- Offline simulation
- Fail-next-request simulation
- Loading skeleton states
- Error states
- Retry workflow
- Empty-state component
- API Architecture admin screen
- UI → endpoint map
- Shared customer/admin/app data contract inspector
- Exportable shared data contract JSON
- Role/permission matrix
- UI permission simulation
- Stronger owner/admin/support/read-only separation
- API/backend architecture made explicit in-product

## Key design principle
The UI should not care whether data comes from:
- local mock data today
- Cloudflare Workers/D1 tomorrow
- iOS/Android clients later

All clients should target the same canonical YasReady API/data model.

## Shared-client architecture
Customer Web
Admin Web
iOS
Android
   ↓
YasReady API
   ↓
Cloudflare / billing / realtime / notification services

## Build 6
The next meaningful admin build should stop mocking the data layer and begin real shared backend infrastructure.

Recommended next phase:
- authentication
- account/business persistence
- shared API
- admin authorization
- migration strategy
- real support persistence
- billing/webhooks after identity/data foundation

Customer YasReady remains a separate repository/version line.
