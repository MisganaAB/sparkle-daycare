import { env } from '../config/env.js';

export async function sendTelegramMessage(message) {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = env;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram credentials not configured — skipping notification.');
    return false;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML',
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('Telegram API error:', body);
    return false;
  }

  return true;
}

export function formatContactMessage({ name, phone, email, subject, message }) {
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'Africa/Addis_Ababa',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    `🔔 <b>NEW WEBSITE MESSAGE</b>\n\n` +
    `👤 <b>Name:</b>\n${name}\n\n` +
    `📞 <b>Phone:</b>\n${phone || 'Not provided'}\n\n` +
    `📧 <b>Email:</b>\n${email || 'Not provided'}\n\n` +
    `📌 <b>Subject:</b>\n${subject || 'Not provided'}\n\n` +
    `💬 <b>Message:</b>\n${message}\n\n` +
    `🕐 <b>Received:</b>\n${timestamp}`
  );
}
