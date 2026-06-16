# Deployment Guide

## Server

- **Provider:** Oracle Cloud Always Free (VM.Standard.E2.1.Micro, Ubuntu 22.04)
- **Public IP:** 129.80.178.227
- **SSH:** `ssh -i C:\Users\kato8\.ssh\ssh-key-2026-06-16.key ubuntu@129.80.178.227`

## Port

The bot runs on port **3002**, set via `PORT=3002` in `.env`. Port is open in the Oracle VCN security list ingress rules and Ubuntu iptables.

## Process manager

The bot is managed by pm2 and auto-starts on reboot.

| Command | Description |
|---------|-------------|
| `pm2 list` | Check status of all bots |
| `pm2 logs boe-found` | View logs |
| `pm2 restart boe-found` | Restart the bot |
| `pm2 stop boe-found` | Stop the bot |

## Repo location on server

`~/boe-found-bot/`

## Deploying an update

No build step needed — plain JavaScript.

```bash
cd ~/boe-found-bot
git pull
pm2 restart boe-found
```

## Apps Script

The Google Form trigger (`onFormSubmit`) is set up inside the BOE Google Form's Apps Script (Extensions -> Apps Script). It posts to:

```
http://129.80.178.227:3002/send
```

The `BOT_URL` constant at the top of the script must match this.
