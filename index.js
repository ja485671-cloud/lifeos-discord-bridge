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
    const res = await fetch(N8N_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: text,
        user_id: msg.author.id,
        channel_id: msg.channelId,
      }),
    });

    let replyText = '✅ 已記錄';
    try {
      const data = await res.json();
      if (data?.ai_reply) replyText = data.ai_reply;
    } catch (_) {}

    //await msg.reply(replyText);
  } catch (err) {
    console.error('Forward to n8n failed:', err);
    await msg.reply('⚠️ 系統忙線，稍後再試');
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
