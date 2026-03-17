import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPasswordResetEmail = async ({ toEmail, toName, resetUrl }) => {
  const mailOptions = {
    from: `"Rehoboth Cereals & Shop" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Reset Your Password – Rehoboth Cereals & Shop',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff8f0; border-radius: 16px; overflow: hidden; border: 1px solid #f0d9b5;">
        <div style="background: linear-gradient(135deg, #d4a96a, #b5844d); padding: 32px 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 26px; letter-spacing: 0.5px; text-shadow: 1px 1px 4px rgba(0,0,0,0.3);">
            Rehoboth Cereals &amp; Shop
          </h1>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #7c5c2e; margin-top: 0;">Hi ${toName},</h2>
          <p style="color: #555; line-height: 1.7; font-size: 15px;">
            We received a request to reset the password for your account. Click the button below to choose a new password.
          </p>
          <div style="text-align: center; margin: 36px 0;">
            <a href="${resetUrl}"
               style="display: inline-block; background: linear-gradient(135deg, #d4a96a, #b5844d); color: white; text-decoration: none; padding: 14px 40px; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 14px rgba(181,132,77,0.4);">
              Reset My Password
            </a>
          </div>
          <p style="color: #888; font-size: 13px; line-height: 1.6;">
            This link will expire in <strong>15 minutes</strong>. If you did not request a password reset, you can safely ignore this email — your password will not change.
          </p>
          <hr style="border: none; border-top: 1px solid #f0d9b5; margin: 28px 0;" />
          <p style="color: #aaa; font-size: 12px; text-align: center; margin: 0;">
            &copy; ${new Date().getFullYear()} Rehoboth Cereals &amp; Shop. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};