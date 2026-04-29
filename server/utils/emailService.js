const nodemailer = require('nodemailer');

/**
 * Create a reusable SMTP transporter.
 * Returns null when credentials are not configured — emails are silently skipped.
 */
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send booking confirmation email to the client.
 */
const sendBookingConfirmation = async ({ to, name, booking, service, stylist }) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('📧 Email service not configured — skipping confirmation email');
    return;
  }

  const dateStr = new Date(booking.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'Glamour Salon <noreply@glamoursalon.com>',
    to,
    subject: '✨ Your Booking is Confirmed — Glamour Salon',
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #FAF3E0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #B76E79, #C9A84C); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; font-size: 28px; margin: 0;">Glamour Salon</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">Your appointment is confirmed</p>
        </div>
        <div style="padding: 30px;">
          <p style="color: #1A1A1A; font-size: 16px;">Dear <strong>${name}</strong>,</p>
          <p style="color: #555;">We're delighted to confirm your appointment at Glamour Salon.</p>

          <div style="background: white; border-left: 4px solid #B76E79; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #B76E79; margin-top: 0;">📅 Appointment Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; color: #666;">Service</td>
                  <td style="padding: 6px 0; color: #1A1A1A; font-weight: bold;">${service}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Stylist</td>
                  <td style="padding: 6px 0; color: #1A1A1A;">${stylist}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Date</td>
                  <td style="padding: 6px 0; color: #1A1A1A;">${dateStr}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Time</td>
                  <td style="padding: 6px 0; color: #1A1A1A;">${booking.timeSlot}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Amount</td>
                  <td style="padding: 6px 0; color: #C9A84C; font-weight: bold;">₹${booking.totalAmount}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Status</td>
                  <td style="padding: 6px 0;"><span style="background:#B76E79;color:white;padding:2px 10px;border-radius:20px;font-size:12px;">Pending</span></td></tr>
            </table>
          </div>

          <p style="color: #555; font-size: 14px;">Please arrive 10 minutes early. If you need to reschedule, contact us at least 24 hours in advance.</p>
          <p style="color: #555; font-size: 14px;">📍 123 Rose Garden Avenue, Mumbai | 📞 +91 98765 43210</p>
        </div>
        <div style="background: #1A1A1A; padding: 20px; text-align: center;">
          <p style="color: #C9A84C; margin: 0; font-size: 13px;">© 2024 Glamour Salon. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Confirmation email sent to ${to}`);
  } catch (err) {
    console.error('📧 Failed to send email:', err.message);
  }
};

module.exports = { sendBookingConfirmation };
