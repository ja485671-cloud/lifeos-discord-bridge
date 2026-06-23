import { Client, GatewayIntentBits, Partials } from 'discord.js';

const N8N_WEBHOOK = process.env.N8N_WEBHOOK_URL;
const ALLOWED_CHANNEL = process.env.DISCORD_CHANNEL_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

client.once('ready', () => {
  console.log(`LifeOS bot online as ${client.user.tag}`);
});

client.on('messageCreate', async (msg) => {
  if (msg.author.bot) return;
  if (ALLOWED_CHANNEL && msg.channelId !== ALLOWED_CHANNEL) return;
  const text = msg.content?.trim();
  if (!text) return;

  try {
    await fetch(N8N_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: text,
        user_id: msg.author.id,
        channel_id: msg.channelId,
      }),
    });
  } catch (err) {
    console.error('Forward to n8n failed:', err);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
