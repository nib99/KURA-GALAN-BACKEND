import axios from 'axios';
import { CHAPA_SECRET_KEY, FRONTEND_URL } from '../config/index.js';
import { sendDevAlert } from './devAlertService.js';

const CHAPA_BASE_URL = 'https://api.chapa.co/v1/transaction/initialize';

export const createChapaPayment = async ({ amount, currency, donorName, donorEmail, donationId }) => {
  try {
    const data = {
      amount,
      currency,
      email: donorEmail,
      first_name: donorName,
      tx_ref: donationId,
      callback_url: `${FRONTEND_URL}/donation/success/${donationId}`,
    };

    const response = await axios.post(CHAPA_BASE_URL, data, {
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data; // contains payment link and status
  } catch (err) {
    await sendDevAlert({
      subject: 'Chapa Payment Failure',
      message: `Failed to create payment for donationId=${donationId}`,
      context: err.response?.data || err.message
    });
    throw err;
  }
};
