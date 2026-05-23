import nodemailer from "nodemailer";

// ---------------------------------------------------------------------------
// Custom error class so callers can distinguish email failures from other errors
// ---------------------------------------------------------------------------
export class EmailError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "EmailError";
  }
}

// ---------------------------------------------------------------------------
// Transporter — created once, verified lazily on first use
// ---------------------------------------------------------------------------
function createTransporter() {
  const { EMAIL_SERVER_HOST, EMAIL_SERVER_PORT, EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD } =
    process.env;

  if (!EMAIL_SERVER_HOST || !EMAIL_SERVER_PORT || !EMAIL_SERVER_USER || !EMAIL_SERVER_PASSWORD) {
    throw new EmailError(
      "Missing required email environment variables: EMAIL_SERVER_HOST, EMAIL_SERVER_PORT, EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD"
    );
  }

  return nodemailer.createTransport({
    host: EMAIL_SERVER_HOST,
    port: Number(EMAIL_SERVER_PORT),
    // Use `true` for port 465 (SMTPS), `false` for 587/25 (STARTTLS)
    secure: Number(EMAIL_SERVER_PORT) === 465,
    auth: {
      user: EMAIL_SERVER_USER,
      pass: EMAIL_SERVER_PASSWORD,
    },
    tls: {
      // Only disable in dev/staging. In production this should be `true`
      // (or omit the field entirely) so TLS certificates are validated.
      rejectUnauthorized: process.env.NODE_ENV === "production",
    },
  });
}

// Singleton — avoids re-creating a connection pool on every call
let _transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (!_transporter) {
    _transporter = createTransporter();
  }
  return _transporter;
}

// ---------------------------------------------------------------------------
// Verify SMTP connection (call once at app startup, e.g. in server.ts)
// ---------------------------------------------------------------------------
export async function verifyEmailConnection(): Promise<void> {
  try {
    await getTransporter().verify();
    console.log("[email] SMTP connection verified successfully");
  } catch (error) {
    // Reset so the next call retries (handles transient startup failures)
    _transporter = null;
    throw new EmailError("SMTP connection verification failed", error);
  }
}

// ---------------------------------------------------------------------------
// Helper — shared send logic with consistent error handling
// ---------------------------------------------------------------------------
async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const from = process.env.EMAIL_FROM;
  if (!from) {
    throw new EmailError("Missing required environment variable: EMAIL_FROM");
  }

  try {
    const info = await getTransporter().sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log(`[email] Sent to ${options.to} — messageId: ${info.messageId}`);
  } catch (error) {
    // Reset transporter on auth/connection errors so the next request retries
    const isConnectionError =
      error instanceof Error &&
      (error.message.includes("ECONNREFUSED") ||
        error.message.includes("ENOTFOUND") ||
        error.message.includes("535") || // auth failure
        error.message.includes("534"));

    if (isConnectionError) {
      _transporter = null;
    }

    console.error(`[email] Failed to send to ${options.to}:`, error);

    // Re-throw as EmailError so callers can handle specifically
    throw new EmailError(`Failed to send email to ${options.to}`, error);
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const baseUrl = process.env.NEXTAUTH_URL;
  if (!baseUrl) throw new EmailError("Missing required environment variable: NEXTAUTH_URL");

  const verificationUrl = `${baseUrl}/authentication/verify-email?token=${token}`;

  await sendMail({
    to: email,
    subject: "🎉 Verify your email - Welcome to Focura!",
    html: verificationEmailHtml(verificationUrl),
  });
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const baseUrl = process.env.NEXTAUTH_URL;
  if (!baseUrl) throw new EmailError("Missing required environment variable: NEXTAUTH_URL");

  const resetUrl = `${baseUrl}/authentication/reset-password?token=${token}`;

  await sendMail({
    to: email,
    subject: "🔐 Reset your password - Focura",
    html: passwordResetEmailHtml(resetUrl),
  });
}

// ---------------------------------------------------------------------------
// HTML templates (extracted for readability and testability)
// ---------------------------------------------------------------------------

function verificationEmailHtml(verificationUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="min-height: 100vh; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); overflow: hidden;">
              
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center;">
                  <div style="background: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Verify Your Email</h1>
                  <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Welcome to Focura! 🚀</p>
                </td>
              </tr>

              <tr>
                <td style="padding: 50px 40px;">
                  <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">Hey there! 👋</h2>
                  <p style="margin: 0 0 20px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                    Thanks for signing up with <strong style="color: #667eea;">Focura</strong>! We're excited to have you on board. To get started, please verify your email address by clicking the button below.
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0;">
                    <tr>
                      <td align="center">
                        <a href="${verificationUrl}" style="display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-size: 16px; font-weight: 600; box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);">
                          ✨ Verify My Email
                        </a>
                      </td>
                    </tr>
                  </table>

                  <div style="background: #f7fafc; border-radius: 12px; padding: 25px; margin: 30px 0;">
                    <p style="margin: 0 0 10px; color: #4a5568; font-size: 14px; font-weight: 600;">Or copy and paste this link:</p>
                    <p style="margin: 0; color: #667eea; font-size: 13px; word-break: break-all; line-height: 1.6;">${verificationUrl}</p>
                  </div>

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

              <tr>
                <td style="background: #f7fafc; padding: 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0 0 15px; color: #1a1a1a; font-size: 18px; font-weight: 600;">Focura</p>
                  <p style="margin: 0 0 20px; color: #718096; font-size: 14px;">Focus. Create. Achieve.</p>
                  <div style="margin: 20px 0;">
                    <a href="#" style="display: inline-block; margin: 0 10px; color: #667eea; text-decoration: none; font-size: 14px;">Website</a>
                    <span style="color: #cbd5e0;">•</span>
                    <a href="#" style="display: inline-block; margin: 0 10px; color: #667eea; text-decoration: none; font-size: 14px;">Support</a>
                    <span style="color: #cbd5e0;">•</span>
                    <a href="#" style="display: inline-block; margin: 0 10px; color: #667eea; text-decoration: none; font-size: 14px;">Privacy</a>
                  </div>
                  <p style="margin: 20px 0 0; color: #a0aec0; font-size: 12px;">© 2025 Focura. All rights reserved.</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

function passwordResetEmailHtml(resetUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="min-height: 100vh; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); overflow: hidden;">

              <tr>
                <td style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 50px 40px; text-align: center;">
                  <div style="background: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Password Reset</h1>
                  <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Let's get you back in! 🔑</p>
                </td>
              </tr>

              <tr>
                <td style="padding: 50px 40px;">
                  <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">Hi there! 👋</h2>
                  <p style="margin: 0 0 20px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                    We received a request to reset your password for your <strong style="color: #f5576c;">Focura</strong> account. Don't worry—it happens to the best of us!
                  </p>
                  <p style="margin: 0 0 20px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                    Click the button below to create a new password and regain access to your account.
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0;">
                    <tr>
                      <td align="center">
                        <a href="${resetUrl}" style="display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-size: 16px; font-weight: 600; box-shadow: 0 10px 25px rgba(245, 87, 108, 0.4);">
                          🔓 Reset My Password
                        </a>
                      </td>
                    </tr>
                  </table>

                  <div style="background: #f7fafc; border-radius: 12px; padding: 25px; margin: 30px 0;">
                    <p style="margin: 0 0 10px; color: #4a5568; font-size: 14px; font-weight: 600;">Button not working? Copy this link:</p>
                    <p style="margin: 0; color: #f5576c; font-size: 13px; word-break: break-all; line-height: 1.6;">${resetUrl}</p>
                  </div>

                  <div style="border-left: 4px solid #f5576c; background: #fff5f5; padding: 20px; margin: 30px 0; border-radius: 8px;">
                    <p style="margin: 0 0 10px; color: #1a1a1a; font-size: 15px; font-weight: 600;">⚠️ Security Notice</p>
                    <p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.6;">
                      This password reset link will expire in <strong>1 hour</strong> for security reasons. If it expires, you'll need to request a new one.
                    </p>
                  </div>

                  <div style="background: #f0f4ff; border-radius: 12px; padding: 25px; margin: 30px 0;">
                    <p style="margin: 0 0 15px; color: #1a1a1a; font-size: 15px; font-weight: 600;">💡 Password Security Tips:</p>
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

              <tr>
                <td style="background: #f7fafc; padding: 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0 0 15px; color: #1a1a1a; font-size: 18px; font-weight: 600;">Focura</p>
                  <p style="margin: 0 0 20px; color: #718096; font-size: 14px;">Focus. Create. Achieve.</p>
                  <div style="margin: 20px 0;">
                    <a href="#" style="display: inline-block; margin: 0 10px; color: #f5576c; text-decoration: none; font-size: 14px;">Website</a>
                    <span style="color: #cbd5e0;">•</span>
                    <a href="#" style="display: inline-block; margin: 0 10px; color: #f5576c; text-decoration: none; font-size: 14px;">Support</a>
                    <span style="color: #cbd5e0;">•</span>
                    <a href="#" style="display: inline-block; margin: 0 10px; color: #f5576c; text-decoration: none; font-size: 14px;">Privacy</a>
                  </div>
                  <p style="margin: 20px 0 0; color: #a0aec0; font-size: 12px;">© 2025 Focura. All rights reserved.</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}