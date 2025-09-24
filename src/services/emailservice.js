import sgMail from '../config/email.js';
import { FROM_EMAIL, ADMIN_EMAILS, FRONTEND_URL } from '../config/index.js';

export const sendDonationReceipt = async ({ to, donorName, amount, currency, donationId }) => {
  await sgMail.send({
    to,
    from: FROM_EMAIL,
    subject: 'Thank you for your donation!',
    html: `<h2>Thank you, ${donorName || 'Donor'}!</h2>
           <p>Donation: <strong>${amount} ${currency}</strong></p>
           <p>Donation ID: <strong>${donationId}</strong></p>
           <p>View details: <a href="${FRONTEND_URL}/donation/${donationId}">Click Here</a></p>`
  });
};

export const sendAdminNotification = async ({ donationId, donorName, amount, currency, provider }) => {
  await sgMail.sendMultiple({
    to: ADMIN_EMAILS,
    from: FROM_EMAIL,
    subject: 'New Donation Received',
    html: `<h2>Donation Alert</h2>
           <p>Donation ID: ${donationId}</p>
           <p>Donor: ${donorName || 'Anonymous'}</p>
           <p>Amount: ${amount} ${currency}</p>
           <p>Provider: ${provider}</p>`
  });
};
