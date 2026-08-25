# BOE Found — Discord Relay Bot

A tiny Express + discord.js server that receives POST requests from Google Apps Script and forwards the message to a Discord channel. This sidesteps Cloudflare's rate-limiting (error 1015) that blocks Discord webhook calls made from shared Google Apps Script IPs.

---

## How it works

```
Google Form → Apps Script → POST /send → this bot → Discord channel
```

The Apps Script sends a JSON body `{ "content": "..." }` with an `x-secret` header. The bot verifies the secret, then uses the Discord bot token to post the message to the configured channel.

---

## Setup

### 1. Create a Discord bot

1. Go to [discord.com/developers/applications](https://discord.com/developers/applications) and click **New Application**.
2. Name it (e.g. *BOE Notifier*) and save.
3. Go to **Bot** in the left sidebar.
4. Click **Reset Token**, copy the token — this is your `BOT_TOKEN`.
5. Under **Privileged Gateway Intents**, no extra intents are needed for this bot.

### 2. Invite the bot to your server

1. In the Developer Portal, go to **OAuth2 → URL Generator**.
2. Under **Scopes**, select `bot`.
3. Under **Bot Permissions**, select **Send Messages** (and optionally **Read Message History**).
4. Copy the generated URL, open it in a browser, and invite the bot to your guild.
5. Make sure the bot has **Send Messages** permission in the specific channel you want it to post to.

### 3. Get the channel ID

1. In Discord, go to **User Settings → Advanced** and enable **Developer Mode**.
2. Right-click the target channel and select **Copy Channel ID**.
3. This is your `CHANNEL_ID`.

### 4. Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```
BOT_TOKEN=your-discord-bot-token-here
CHANNEL_ID=your-target-channel-id-here
SHARED_SECRET=pick-a-long-random-secret-string-here
```

Generate a strong `SHARED_SECRET` with something like:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Install dependencies and run locally

```bash
npm install
npm start
```

The server listens on port 3000 by default (or `$PORT` if set).

---

## API

### `POST /send`

Forwards a message to the configured Discord channel.

**Headers:**

| Header     | Required | Description                        |
|------------|----------|------------------------------------|
| x-secret   | Yes      | Must match `SHARED_SECRET` in .env |
| Content-Type | Yes    | `application/json`                 |

**Body:**

```json
{ "content": "**Fieryjawn-Dalaran** of Team Wrathless found \\Hero- Raging Storm Sash" }
```

**Responses:**

| Code | Meaning                                   |
|------|-------------------------------------------|
| 200  | Message posted successfully               |
| 400  | Missing or empty `content` field          |
| 401  | `x-secret` header missing or wrong        |
| 500  | Discord API error or channel not found    |

### `GET /health`

Returns `{ "status": "ok" }`. Used by Railway/Render to confirm the process is alive.

---

## Deploying

**Current production deployment** runs on an Oracle Cloud Always Free VM under pm2 — see [DEPLOYMENT.md](./DEPLOYMENT.md) for the server details, SSH access, and update process.

The bot previously ran on Render and Railway; it no longer does, but the steps below still work if you want to self-host on either.

### Deploying to Railway

1. Push this repo to GitHub.
2. Go to [railway.app](https://railway.app), create a new project, and select **Deploy from GitHub repo**.
3. Select your repo.
4. In **Variables**, add `BOT_TOKEN`, `CHANNEL_ID`, and `SHARED_SECRET` (Railway sets `PORT` automatically — do not override it).
5. Railway will build and deploy. Copy the public URL from the **Settings → Domains** tab.

### Deploying to Render

1. Push this repo to GitHub.
2. Go to [render.com](https://render.com) and create a new **Web Service**.
3. Connect your GitHub repo. Set **Build Command** to `npm install` and **Start Command** to `npm start`.
4. Under **Environment**, add `BOT_TOKEN`, `CHANNEL_ID`, and `SHARED_SECRET`.
5. Deploy. Copy the public URL from the service dashboard.

> **Note for Render free tier:** the service sleeps after 15 minutes of inactivity. The first request after a sleep takes ~30 seconds (cold start). Google Apps Script's default timeout is 30 seconds, so you may occasionally see timeout errors on the first submission of the day. Upgrade to a paid instance or use Railway's hobby tier to avoid this.
>
> **Free workaround — keep it awake with a cron pinger:** Go to [console.cron-job.org/jobs](https://console.cron-job.org/jobs), create a free account, and add a new cron job pointing to `https://your-render-url.onrender.com/health` on a **10-minute interval**. This pings the `/health` endpoint often enough to prevent the service from sleeping, at no cost.

---

## Updating the Apps Script

In your Google Apps Script, replace the webhook `UrlFetchApp.fetch()` call with:

```javascript
function postToDiscord(message) {
  var url = 'http://129.80.178.227:3002/send'; // or your own deployment's URL
  var options = {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-secret': 'your-shared-secret-here' },
    payload: JSON.stringify({ content: message }),
    muteHttpExceptions: true
  };
  var response = UrlFetchApp.fetch(url, options);
  Logger.log(response.getResponseCode() + ' ' + response.getContentText());
}
```
