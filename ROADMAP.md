# Roadmap

Ideas and planned improvements for BOE Found. Nothing here is committed to a timeline — it's a living list.

Items are loosely ordered by priority within each section.

---

## Near-term

- **Message retry logic** — if the Discord API call fails, queue the message and retry up to N times before returning a 500, so transient Discord outages don't silently drop notifications
- **Structured request logging** — log each incoming request (timestamp, status code, truncated content) to stdout in a consistent format for easier debugging on Railway/Render
- **Input sanitization** — strip or escape characters that could cause Discord formatting issues in unexpected ways

## Medium-term

- **Multiple channel routing** — accept an optional `channel` field in the POST body (mapped to a whitelist of channel IDs in env) so different form types can be routed to different Discord channels
- **Rich embed support** — allow the POST body to pass structured fields that get rendered as a Discord embed (title, color, fields) instead of plain text
- **Rate limiting** — add a per-IP or per-secret request rate limit to the `/send` endpoint to protect against accidental or intentional flooding
- **Docker support** — add a `Dockerfile` and `docker-compose.yml` so the bot can be run in any containerized environment

## Longer-term

- **Admin status page** — a simple password-protected web UI showing recent messages, uptime, and bot connection status
- **Multiple secrets / multi-tenant** — support multiple `SHARED_SECRET` values, each tied to a specific channel, so multiple independent Google Forms can share one deployment
- **Webhook fallback** — attempt a Discord webhook call first; fall back to the bot token only if the webhook is rate-limited, preserving the original motivation for this relay
- **Test suite** — unit tests for auth middleware and route handlers; integration test that spins up the Express server and asserts correct Discord API calls

---

## Completed

- Basic relay server with shared-secret auth (`v0.0.1`)
- `GET /health` endpoint for uptime monitoring (`v0.0.1`)
- Railway and Render deployment guides (`v0.0.1`)
