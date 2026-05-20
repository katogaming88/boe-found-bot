# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the bot

```bash
npm install
npm start        # starts the Express server + Discord bot
```

The server starts only after the Discord client fires its `ready` event. Port defaults to `3000` unless `$PORT` is set (Railway and Render set it automatically).

## Architecture

Everything lives in `index.js`. There is no build step.

The startup sequence is:
1. Validate env vars (`BOT_TOKEN`, `CHANNEL_ID`, `SHARED_SECRET`) — hard exit if any are missing.
2. Create a discord.js `Client` and an Express `app`.
3. Register two routes (`POST /send`, `GET /health`).
4. Call `client.login(BOT_TOKEN)` — Express only begins listening inside the `client.once('ready')` callback, so the HTTP server is never up without a live Discord connection.

`POST /send` checks the `x-secret` header against `SHARED_SECRET`, then fetches the channel by ID on every request (discord.js caches this internally) and calls `channel.send()`.

## Branching and versioning rules

- `main` is always deployable. **No direct commits to `main`**, except for documentation-only changes (markdown files, comments).
- Branch naming: `feature/<name>`, `fix/<name>`, `hotfix/<name>`, `chore/<name>`.
- Squash-merge PRs into `main`.
- Versioning follows SemVer. While `0.x.x`, minor versions may include small breaking changes.
## Commit message format

```
<type>: <short description>
```

Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`.

## Changelog

Every PR must add a versioned changelog entry — **never under `[Unreleased]`**. Each PR bumps the version and includes today's date:

```
## [X.Y.Z] - YYYY-MM-DD
```

Also bump `package.json` to match. The CI `changelog` job enforces that:
- `CHANGELOG.md` was modified
- Every versioned entry follows `## [X.Y.Z] - YYYY-MM-DD`
- The latest changelog version matches `package.json`

Run checks locally with: `node scripts/check-changelog.js`
