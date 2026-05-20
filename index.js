require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');

const { BOT_TOKEN, CHANNEL_ID, SHARED_SECRET } = process.env;

if (!BOT_TOKEN || !CHANNEL_ID || !SHARED_SECRET) {
  console.error('Missing required environment variables: BOT_TOKEN, CHANNEL_ID, SHARED_SECRET');
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const app = express();
app.use(express.json());

app.post('/send', async (req, res) => {
  const secret = req.headers['x-secret'];
  if (secret !== SHARED_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { content } = req.body;
  if (!content || typeof content !== 'string' || content.trim() === '') {
    return res.status(400).json({ error: 'Missing or empty content field' });
  }

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel || !channel.isTextBased()) {
      return res.status(500).json({ error: 'Channel not found or not a text channel' });
    }

    await channel.send(content.trim());
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Failed to send message:', err);
    return res.status(500).json({ error: 'Failed to send message to Discord' });
  }
});

app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Express listening on port ${PORT}`));
});

client.login(BOT_TOKEN);
