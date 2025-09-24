import { sendDevAlert } from '../services/devAlertService.js';

export const errorHandler = async (err, req, res, next) => {
  console.error(err);

  // Send developer alert
  await sendDevAlert({
    subject: 'Server Error',
    message: err.message,
    context: {
      path: req.originalUrl,
      method: req.method,
      body: req.body
    }
  });

  res.status(500).json({ error: 'Internal Server Error' });
};
