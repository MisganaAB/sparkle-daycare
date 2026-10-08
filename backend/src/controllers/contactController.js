import { saveContactMessage, markTelegramSent } from '../services/supabaseService.js';
import { sendTelegramMessage, formatContactMessage } from '../services/telegramService.js';
import { validateContact } from '../validators/contactValidator.js';

export async function submitContact(req, res, next) {
  try {
    const { name, email, phone, subject, message } = req.body;

    const errors = validateContact({ name, email, phone, subject, message });
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors.join(' ') });
    }

    // Save to database first
    const record = await saveContactMessage({
      name: name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      subject: subject?.trim() || null,
      message: message.trim(),
      telegram_sent: false,
    });

    // Send Telegram notification (non-blocking)
    const text = formatContactMessage({ name, phone, email, subject, message });
    sendTelegramMessage(text)
      .then((sent) => sent && markTelegramSent(record.id))
      .catch((err) => console.error('Telegram notification failed:', err));

    res.status(201).json({
      success: true,
      message: 'Your message has been received. We will contact you shortly!',
    });
  } catch (err) {
    next(err);
  }
}
