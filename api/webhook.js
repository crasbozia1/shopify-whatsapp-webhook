export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require('twilio')(accountSid, authToken);

  const { phone, message } = req.body;

  try {
    const response = await client.messages.create({
      body: message,
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${phone}`
    });

    res.status(200).json({ success: true, sid: response.sid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
