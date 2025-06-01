import twilio from "twilio";

export const config = {
  api: {
    bodyParser: true,
  },
};

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests allowed" });
  }

  try {
    const order = req.body;

    // ✅ کسٹمر کا فون نمبر Shopify order سے نکالیں:
    const phone = order?.billing_address?.phone;

    if (!phone) {
      return res.status(400).json({ success: false, error: "Phone number not found in order data" });
    }

    // ✅ آپ کا میسج:
    const message = `Dear Customer, your order has been received successfully. Thank you for shopping with Crasbozia!`;

    const response = await client.messages.create({
      body: message,
      from: "whatsapp:+14155238886",   // Twilio sandbox number
      to: `whatsapp:${phone}`,         // کسٹمر کا نمبر
    });

    res.status(200).json({ success: true, sid: response.sid });
  } catch (error) {
    console.error("Twilio Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
