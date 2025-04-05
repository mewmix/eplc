// app/api/submit-order/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    // Create transporter (using Gmail as an example)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS,  // Your Gmail app password
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'alexanderjamesklein@gmail.com',
      subject: 'New Order Request',
      text: `New order received:\n\n${JSON.stringify(orderData, null, 2)}`,
    });

    return NextResponse.json(
      { success: true, message: 'Order submitted and email sent' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send email' },
      { status: 500 }
    );
  }
}
