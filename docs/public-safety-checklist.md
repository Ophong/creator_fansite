# Public Safety Checklist

This checklist defines when the 팬사이트 demo is safe to publish as a public repository.

## Runtime

- [x] Static GitHub Pages export.
- [x] No backend server required for the public demo.
- [x] No scheduled jobs.
- [x] No DigitalOcean Droplet, reserved IP, volume, load balancer, or database dependency.
- [x] No Supabase connection or service-role key.
- [x] Google OAuth is disabled in the public demo.

## Frontend Fidelity

- [x] Home, clips, recap, and member pages are generated from the original Next.js frontend.
- [x] Earlier alternate static prototypes are not used as the visible demo surface.
- [x] Client interactions remain: dashboard/schedule tabs, feed filters, clip sorting, member page navigation, and motion.

## Data

- [x] Static fixture rows only.
- [x] No production API dumps.
- [x] No access tokens, cookies, server IPs, private admin identifiers, or write-capable endpoints.
- [x] Schedule auth fixture returns logged-out/read-only state.
- [x] The public export does not expose working SOOP, YouTube, X, or SOOP VOD links.

## Repository Safety

- [x] `.env` and `.env.*` are ignored.
- [x] No GitHub Actions workflows are included.
- [x] No package install is required to view the published demo.
- [x] No service-role key placeholder is included.
- [x] No DigitalOcean token placeholder is included.

After creating a new static export, run `node scripts/sanitize-external-links.mjs` before publishing so external platform links are removed again.

## If Live Data Is Added Later

Do not put live credentials in this repository. Use a separate private backend or a read-only public API with rate limits, no privileged keys, and an explicit privacy review.
