import sgMail from './emailService.js'; // Reuse your emailService
import { DEVELOPER_EMAIL, FROM_EMAIL } from '../config/index.js';

// Send critical system alert to developer
export const sendDevAlert = async ({ subject, message, context }) => {
  try {
    const msg = {
      to: DEVELOPER_EMAIL,
      from: FROM_EMAIL,
      subject: `[ALERT] ${subject}`,
      html: `
        <h2>System Alert</h2>
        <p>${message}</p>
        <pre>${JSON.stringify(context || {}, null, 2)}</pre>
      `
    };
    await sgMail.send(msg);
  } catch (err) {
    console.error('Failed to send developer alert:', err.message);
  }
};
