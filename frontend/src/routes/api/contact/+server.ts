import { json } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from '@sveltejs/kit';

const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD}
});

export const POST: RequestHandler = async ({ request }) => {
    try {
      const { name, email, message, type } = await request.json();
      const label = type === 'business' ? `Business Inquiry from ${name}` : `Feedback from ${name}`;

    const emailContent = `
        <img src="https://res.cloudinary.com/dh8nskoaz/image/upload/v1755917757/ffEmailLogo_qdmub9.png" 
             alt="FindingFocus" 
             style="display: block; max-height: 100px; width: auto;"
        />

        <div style="font-family: Arial, sans-serif; color: #1f2937; position: relative;">
          <p><strong>${label}</strong></p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 20px; line-height: 1; color: #374151;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
    `
    await transporter.sendMail({
      from: `findingfocusdev <${env.SMTP_USER}>`,
      to: env.SMTP_USER,
      subject: type === 'business' ?
      `Business Inquiry from ${name} ` :
      `Feedback from ${name}`,
      html: emailContent,
      replyTo: email
    });
    return json({ success: true });

} catch (error) {
    console.error('Email error:', error);
    return json({ error: 'Failed to send email' }, { status: 500 });
}
}