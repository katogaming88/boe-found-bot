# Changelog

All notable changes to this project will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).  
This project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- CI check that fails if `CHANGELOG.md` was not updated in a PR
- ESLint (v10, flat config) with Node.js globals and `eslint:recommended` rules
- `npm run lint` script
- GitHub Actions CI workflow — runs `npm ci`, `npm run lint`, and `npm audit --audit-level=high` on every PR targeting `master`

## [0.0.1] - 2026-05-20

### Added
- Express relay server (`POST /send`) that forwards messages from Google Apps Script to a Discord channel
- Shared-secret authentication via `x-secret` header
- `GET /health` endpoint for uptime monitoring and cron pingers
- discord.js bot integration using bot token + channel ID
- `.env.example` with all required environment variables
- Deployment guides for Railway and Render (including free-tier cron-pinger workaround)
- Apps Script code snippet for wiring up the relay

[Unreleased]: https://github.com/Katorri/boe-found/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/Katorri/boe-found/releases/tag/v0.0.1
