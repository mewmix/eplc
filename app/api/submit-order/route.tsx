// app/api/submit-order/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Helper function to format boolean/unsure values for the email
function formatBooleanUnsure(value: boolean | string | null | undefined): string {
  if (value === true || value === 'true') return 'Yes';
  if (value === false || value === 'false') return 'No';
  if (value === 'unsure' || value === null || value === undefined) return 'Not Sure / Needs Discussion';
  return String(value); // Fallback for unexpected values
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string: string): string {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    // Basic validation (optional but recommended)
    if (!orderData || !orderData.email || !orderData.cart) {
        console.error("Incomplete order data received:", orderData);
        return NextResponse.json({ success: false, message: 'Incomplete order data' }, { status: 400 });
    }

    // Debug: Log the received data
    console.log('Received order data for email:', JSON.stringify(orderData, null, 2));

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or your preferred service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Ensure this is an app password if using Gmail 2FA
      },
    });

    // --- Enhanced HTML Email Template ---
    const htmlEmail = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order Request - Earth People LandCare</title>
  <style>
    body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8f9f6; color: #333; line-height: 1.6; }
    .email-container { max-width: 680px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
    .header { background-color: #2F855A; /* Green-700 */ color: white; padding: 25px 30px; text-align: center; border-bottom: 4px solid #38A169; /* Green-600 */ }
    .header h1 { margin: 0; font-size: 26px; font-weight: 600; letter-spacing: 0.5px; }
    .content { padding: 30px; }
    .section { margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px dashed #e0e0e0; }
    .section:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
    .section h2 { color: #2F855A; font-size: 20px; margin-top: 0; margin-bottom: 15px; font-weight: 600; border-bottom: 2px solid #C6F6D5; /* Green-100 */ padding-bottom: 5px; }
    p { margin: 5px 0 10px 0; font-size: 15px; color: #555; }
    p strong { color: #333; font-weight: 500; margin-right: 5px; }
    table.order-summary, table.plant-list { width: 100%; border-collapse: collapse; margin: 15px 0; }
    table.order-summary th, table.order-summary td,
    table.plant-list th, table.plant-list td { padding: 12px; text-align: left; font-size: 14px; border-bottom: 1px solid #e8e8e8; }
    table.order-summary th, table.plant-list th { background-color: #f9f9f9; color: #555; font-weight: 500; text-transform: uppercase; font-size: 13px; }
    table.order-summary tr:last-child td, table.plant-list tr:last-child td { border-bottom: none; }
    .total-row td { font-weight: bold; background-color: #f0fff4; /* Green-50 */ color: #2F855A; font-size: 16px !important; border-top: 2px solid #9AE6B4; /* Green-300 */ }
    .text-capitalize { text-transform: capitalize; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #888; background-color: #f9f9f9; border-top: 1px solid #e0e0e0; }
    .footer a { color: #38A169; text-decoration: none; }
    .no-items { color: #888; font-style: italic; }
    @media (max-width: 680px) {
      .email-container { margin: 10px; border-radius: 4px; }
      .header, .content { padding: 20px; }
      .header h1 { font-size: 22px; }
      .section h2 { font-size: 18px; }
      p { font-size: 14px; }
      table.order-summary th, table.order-summary td,
      table.plant-list th, table.plant-list td { padding: 10px; font-size: 13px; }
      .total-row td { font-size: 15px !important; }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>New Order Request Received</h1>
    </div>
    <div class="content">

      <div class="section">
        <h2>Customer Information</h2>
        <p><strong>Name:</strong> ${orderData.name || 'N/A'}</p>
        <p><strong>Email:</strong> <a href="mailto:${orderData.email}">${orderData.email}</a></p>
        <p><strong>Phone:</strong> ${orderData.phone || 'N/A'}</p>
        <p><strong>Address:</strong> ${orderData.address || 'N/A'}</p>
        <p><strong>Contact Preference:</strong> <span class="text-capitalize">${orderData.contactPreference || 'N/A'}</span></p>
      </div>

      <div class="section">
        <h2>Order Details</h2>
        ${
          orderData.cart && orderData.cart.length > 0
            ? `
              <table class="plant-list">
                <thead>
                  <tr>
                    <th>Plant Name</th>
                    <th>Quantity</th>
                    <th>Price Each</th>
                    <th>Item Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderData.cart
                    .map((item: { name: string; quantity: number; price: number }) => `
                      <tr>
                        <td>${item.name || 'Unknown Plant'}</td>
                        <td>${item.quantity || 0}</td>
                        <td>$${item.price ? item.price.toFixed(2) : 'N/A'}</td>
                        <td>$${(item.price * (item.quantity || 0)).toFixed(2)}</td>
                      </tr>
                    `)
                    .join('')}
                </tbody>
              </table>
            `
            : '<p class="no-items">No plants were selected in this request.</p>'
        }
      </div>

       <div class="section">
         <h2>Additional Items & Services</h2>
         <p><strong>Premium Soil Bags:</strong> ${orderData.soilBags || 0}</p>
         <p><strong>Professional Planting Service:</strong> ${formatBooleanUnsure(orderData.includePlanting)}</p>
       </div>

      <div class="section">
        <h2>Delivery Information</h2>
        <p><strong>Estimated Zone:</strong> <span class="text-capitalize">${orderData.deliveryZone || 'N/A'}</span></p>
        <p><strong>Estimated Size Category:</strong> <span class="text-capitalize">${orderData.deliverySize || 'N/A'}</span></p>
      </div>

      <div class="section">
        <h2>Project Details & Requests</h2>
        <p><strong>Irrigation Needed:</strong> ${formatBooleanUnsure(orderData.needsIrrigation)}
            ${orderData.needsIrrigation && orderData.irrigationType && orderData.irrigationType !== 'none' ? ` (${capitalizeFirstLetter(orderData.irrigationType)})` : ''}
        </p>
        <p><strong>Fertilizer Needed:</strong> ${formatBooleanUnsure(orderData.needsFertilizer)}</p>
        <p><strong>Desired Timeline:</strong> <span class="text-capitalize">${orderData.projectTimeline || 'N/A'}</span></p>
        <p><strong>Customer Notes:</strong> ${orderData.notes || 'None provided.'}</p>
      </div>

      <div class="section">
        <h2>Estimated Costs (Subject to Confirmation)</h2>
        <table class="order-summary">
          <tbody>
            <tr><td>Plant Subtotal</td><td>$${orderData.plantSubtotal || '0.00'}</td></tr>
            <tr><td>Soil Cost</td><td>$${orderData.soilCost || '0.00'}</td></tr>
            <tr><td>Planting Service Cost</td><td>$${orderData.plantingCost || '0.00'}</td></tr>
            <tr><td>Delivery Cost</td><td>$${orderData.deliveryCost || '0.00'}</td></tr>
            <tr class="total-row"><td>Estimated Total</td><td>$${orderData.total || '0.00'}</td></tr>
          </tbody>
        </table>
         <p style="font-size: 13px; color: #888; text-align: center; margin-top: 15px;">Note: This is an estimate. Final costs, taxes, and availability will be confirmed.</p>
      </div>

    </div>
    <div class="footer">
      <p>This order request was submitted via the Earth People LandCare website.</p>
      <p><a href="[Your Website URL Here]">Visit Website</a></p>
    </div>
  </div>
</body>
</html>
    `;

    // Send email
    console.log("Attempting to send email...");
    const mailInfo = await transporter.sendMail({
      from: `"EPLC Order System" <${process.env.EMAIL_USER}>`, // Use a sender name
      to: 'alexanderjamesklein@gmail.com', // Primary recipient
      // cc: orderData.email, // Optional: Send a copy to the customer
      subject: `New Plant Order Request - ${orderData.name || 'Unknown Customer'}`,
      html: htmlEmail,
    });

    console.log("Email sent successfully:", mailInfo.messageId);

    return NextResponse.json(
      { success: true, message: 'Order submitted and email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    // Log the detailed error
    console.error('Failed to process order or send email:', error);
    // Check if the error is from Nodemailer specifically
    if (error instanceof Error) {
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        console.error('Error Stack:', error.stack);
    }

    return NextResponse.json(
      { success: false, message: 'Failed to send order email. Please check server logs.' },
      { status: 500 }
    );
  }
}
