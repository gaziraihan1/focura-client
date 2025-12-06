import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/authentication/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "🎉 Verify your email - Welcome to Focura!",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="min-height: 100vh; padding: 40px 20px;">
          <tr>
            <td align="center">
              <!-- Main Container -->
              <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); overflow: hidden;">
                
                <!-- Header Section with Gradient -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center;">
                    <div style="background: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Verify Your Email</h1>
                    <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Welcome to Focura! 🚀</p>
                  </td>
                </tr>

                <!-- Content Section -->
                <tr>
                  <td style="padding: 50px 40px;">
                    <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">Hey there! 👋</h2>
                    <p style="margin: 0 0 20px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                      Thanks for signing up with <strong style="color: #667eea;">Focura</strong>! We're excited to have you on board. To get started, please verify your email address by clicking the button below.
                    </p>

                    <!-- Call-to-Action Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0;">
                      <tr>
                        <td align="center">
                          <a href="${verificationUrl}" style="display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-size: 16px; font-weight: 600; box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                            ✨ Verify My Email
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Alternative Link Section -->
                    <div style="background: #f7fafc; border-radius: 12px; padding: 25px; margin: 30px 0;">
                      <p style="margin: 0 0 10px; color: #4a5568; font-size: 14px; font-weight: 600;">Or copy and paste this link:</p>
                      <p style="margin: 0; color: #667eea; font-size: 13px; word-break: break-all; line-height: 1.6;">
                        ${verificationUrl}
                      </p>
                    </div>

                    <!-- Info Box -->
                    <div style="border-left: 4px solid #667eea; background: #f0f4ff; padding: 20px; margin: 30px 0; border-radius: 8px;">
                      <p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.6;">
                        ⏰ <strong>Important:</strong> This verification link will expire in <strong>24 hours</strong>. If you don't verify within this time, you'll need to register again.
                      </p>
                    </div>

                    <p style="margin: 30px 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
                      If you didn't create a Focura account, you can safely ignore this email. No further action is required.
                    </p>
                  </td>
                </tr>

                <!-- Footer Section -->
                <tr>
                  <td style="background: #f7fafc; padding: 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0 0 15px; color: #1a1a1a; font-size: 18px; font-weight: 600;">Focura</p>
                    <p style="margin: 0 0 20px; color: #718096; font-size: 14px;">
                      Focus. Create. Achieve.
                    </p>
                    <div style="margin: 20px 0;">
                      <a href="#" style="display: inline-block; margin: 0 10px; color: #667eea; text-decoration: none; font-size: 14px;">Website</a>
                      <span style="color: #cbd5e0;">•</span>
                      <a href="#" style="display: inline-block; margin: 0 10px; color: #667eea; text-decoration: none; font-size: 14px;">Support</a>
                      <span style="color: #cbd5e0;">•</span>
                      <a href="#" style="display: inline-block; margin: 0 10px; color: #667eea; text-decoration: none; font-size: 14px;">Privacy</a>
                    </div>
                    <p style="margin: 20px 0 0; color: #a0aec0; font-size: 12px;">
                      © 2024 Focura. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/authentication/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "🔐 Reset your password - Focura",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="min-height: 100vh; padding: 40px 20px;">
          <tr>
            <td align="center">
              <!-- Main Container -->
              <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); overflow: hidden;">
                
                <!-- Header Section with Gradient -->
                <tr>
                  <td style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 50px 40px; text-align: center;">
                    <div style="background: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Password Reset</h1>
                    <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Let's get you back in! 🔑</p>
                  </td>
                </tr>

                <!-- Content Section -->
                <tr>
                  <td style="padding: 50px 40px;">
                    <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">Hi there! 👋</h2>
                    <p style="margin: 0 0 20px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                      We received a request to reset your password for your <strong style="color: #f5576c;">Focura</strong> account. Don't worry—it happens to the best of us!
                    </p>
                    <p style="margin: 0 0 20px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                      Click the button below to create a new password and regain access to your account.
                    </p>

                    <!-- Call-to-Action Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0;">
                      <tr>
                        <td align="center">
                          <a href="${resetUrl}" style="display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-size: 16px; font-weight: 600; box-shadow: 0 10px 25px rgba(245, 87, 108, 0.4); transition: all 0.3s ease;">
                            🔓 Reset My Password
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Alternative Link Section -->
                    <div style="background: #f7fafc; border-radius: 12px; padding: 25px; margin: 30px 0;">
                      <p style="margin: 0 0 10px; color: #4a5568; font-size: 14px; font-weight: 600;">Button not working? Copy this link:</p>
                      <p style="margin: 0; color: #f5576c; font-size: 13px; word-break: break-all; line-height: 1.6;">
                        ${resetUrl}
                      </p>
                    </div>

                    <!-- Warning Box -->
                    <div style="border-left: 4px solid #f5576c; background: #fff5f5; padding: 20px; margin: 30px 0; border-radius: 8px;">
                      <p style="margin: 0 0 10px; color: #1a1a1a; font-size: 15px; font-weight: 600;">
                        ⚠️ Security Notice
                      </p>
                      <p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.6;">
                        This password reset link will expire in <strong>1 hour</strong> for security reasons. If it expires, you'll need to request a new one.
                      </p>
                    </div>

                    <!-- Security Tips -->
                    <div style="background: #f0f4ff; border-radius: 12px; padding: 25px; margin: 30px 0;">
                      <p style="margin: 0 0 15px; color: #1a1a1a; font-size: 15px; font-weight: 600;">
                        💡 Password Security Tips:
                      </p>
                      <ul style="margin: 0; padding-left: 20px; color: #4a5568; font-size: 14px; line-height: 1.8;">
                        <li>Use at least 8 characters with a mix of letters, numbers, and symbols</li>
                        <li>Avoid common words or personal information</li>
                        <li>Don't reuse passwords from other accounts</li>
                        <li>Consider using a password manager</li>
                      </ul>
                    </div>

                    <div style="border-top: 1px solid #e2e8f0; padding-top: 25px; margin-top: 30px;">
                      <p style="margin: 0; color: #718096; font-size: 14px; line-height: 1.6;">
                        <strong>Didn't request this?</strong><br>
                        If you didn't request a password reset, please ignore this email. Your password will remain unchanged, and your account is secure.
                      </p>
                      <p style="margin: 20px 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
                        If you're concerned about your account security, please contact our support team immediately.
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Footer Section -->
                <tr>
                  <td style="background: #f7fafc; padding: 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0 0 15px; color: #1a1a1a; font-size: 18px; font-weight: 600;">Focura</p>
                    <p style="margin: 0 0 20px; color: #718096; font-size: 14px;">
                      Focus. Create. Achieve.
                    </p>
                    <div style="margin: 20px 0;">
                      <a href="#" style="display: inline-block; margin: 0 10px; color: #f5576c; text-decoration: none; font-size: 14px;">Website</a>
                      <span style="color: #cbd5e0;">•</span>
                      <a href="#" style="display: inline-block; margin: 0 10px; color: #f5576c; text-decoration: none; font-size: 14px;">Support</a>
                      <span style="color: #cbd5e0;">•</span>
                      <a href="#" style="display: inline-block; margin: 0 10px; color: #f5576c; text-decoration: none; font-size: 14px;">Privacy</a>
                    </div>
                    <p style="margin: 20px 0 0; color: #a0aec0; font-size: 12px;">
                      © 2024 Focura. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });
}