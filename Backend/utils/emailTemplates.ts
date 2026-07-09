export const getResetPasswordTemplate = (userName: string, resetUrl: string): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Reset Your Password</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <style>
    table { border-collapse: collapse; }
    td { font-family: 'Segoe UI', Arial, sans-serif; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f6f9; min-width: 100%;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <!-- Outer Container -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; width: 100%;">
          <tr>
            <td align="center" style="padding: 0 0 24px 0;">
              <!-- Brand / Logo -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 0;">
                    <img src="https://img.icons8.com/fluency/96/null/lock.png" alt="" width="64" height="64" style="display: block; border: 0; outline: none; height: auto;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <!-- Main Card -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);">
                <!-- Header Accent -->
                <tr>
                  <td height="6" style="height: 6px; font-size: 0; line-height: 0; background: linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7);">&nbsp;</td>
                </tr>
                <tr>
                  <td style="padding: 40px 40px 32px 40px;">
                    <!--[if mso]>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="padding: 0 20px;">
                    <![endif]-->

                    <!-- Title -->
                    <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #1e293b; line-height: 1.3; text-align: center;">
                      Reset Your Password
                    </h1>

                    <!-- Subtitle -->
                    <p style="margin: 0 0 24px 0; font-size: 16px; color: #64748b; line-height: 1.6; text-align: center;">
                      Hi <strong style="color: #334155;">${userName}</strong>, we received a request to reset the password for your account.
                    </p>

                    <!-- Divider -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 24px;">
                      <tr>
                        <td height="1" style="height: 1px; font-size: 0; line-height: 0; background-color: #e2e8f0;">&nbsp;</td>
                      </tr>
                    </table>

                    <!-- Instruction -->
                    <p style="margin: 0 0 28px 0; font-size: 15px; color: #475569; line-height: 1.7; text-align: center;">
                      Click the button below to create a new password. This link will expire in <strong style="color: #dc2626;">15 minutes</strong>.
                    </p>

                    <!-- CTA Button -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto 28px auto;">
                      <tr>
                        <td align="center" style="border-radius: 10px; background: linear-gradient(135deg, #6366f1, #8b5cf6);">
                          <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 14px 40px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; letter-spacing: 0.3px; border-radius: 10px; background: linear-gradient(135deg, #6366f1, #8b5cf6); mso-hide: none;">
                            <!--[if mso]>
                            <span style="display: inline-block; padding: 14px 40px; font-size: 16px; font-weight: 600; color: #ffffff; background: #6366f1; border-radius: 10px;">
                            <![endif]-->
                            Reset Password
                            <!--[if mso]>
                            </span>
                            <![endif]-->
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Fallback link text -->
                    <p style="margin: 0 0 24px 0; font-size: 13px; color: #94a3b8; line-height: 1.5; text-align: center; word-break: break-all;">
                      Or copy this link:<br />
                      <a href="${resetUrl}" style="color: #6366f1; text-decoration: underline; word-break: break-all;">${resetUrl}</a>
                    </p>

                    <!-- Divider -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 24px;">
                      <tr>
                        <td height="1" style="height: 1px; font-size: 0; line-height: 0; background-color: #e2e8f0;">&nbsp;</td>
                      </tr>
                    </table>

                    <!-- Security Notice -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fef2f2; border-radius: 10px; margin-bottom: 0;">
                      <tr>
                        <td style="padding: 16px 20px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td width="28" valign="top" style="padding: 0 12px 0 0; width: 28px;">
                                <img src="https://img.icons8.com/fluency/28/null/medium-importance.png" alt="!" width="28" height="28" style="display: block; border: 0; outline: none;" />
                              </td>
                              <td valign="top">
                                <p style="margin: 0; font-size: 13px; color: #b91c1c; line-height: 1.5;">
                                  <strong style="font-weight: 600;">Didn't request this?</strong><br />
                                  If you didn't ask to reset your password, please ignore this email or <a href="mailto:support@shopit.com" style="color: #dc2626; text-decoration: underline;">contact support</a> right away.
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!--[if mso]>
                    </td></tr></table>
                    <![endif]-->
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 16px 0 16px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 0 0 8px 0;">
                    <p style="margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">
                      &copy; ${new Date().getFullYear()} <a href="https://shopit.com" style="color: #6366f1; text-decoration: none;">ShopIT</a>. All rights reserved.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 0 0 4px 0;">
                    <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                      This is an automated message, please do not reply to this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}
