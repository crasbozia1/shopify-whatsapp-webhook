import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(req) {
  try {
    const body = await req.json();
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromWhatsAppNumber = process.env.TWILIO_WHATSAPP_FROM;
    const client = twilio(accountSid, authToken);

    const customerName = body?.shipping_address?.name || 'Customer';
    const customerPhone = body?.shipping_address?.phone;
    if (!customerPhone) {
      return NextResponse.json({ error: 'No phone number found' }, { status: 400 });
    }

    const message = `Hi ${customerName}, thank you for your order from Crasbozia! We'll notify you when it's on the way.`;

    const response = await client.messages.create({
      from: `whatsapp:${fromWhatsAppNumber}`,
      to: `whatsapp:${customerPhone}`,
      body: message,
    });

    return NextResponse.json({ success: true, sid: response.sid }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}