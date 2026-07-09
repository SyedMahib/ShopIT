export const getResetPasswordTemplate = (
  userName: string,
  resetUrl: string,
): string => {
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>Reset Your Password</title>
    <style type="text/css" rel="stylesheet" media="all">
      @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

      body {
        width: 100% !important;
        height: 100%;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: none;
        text-size-adjust: none;
        background-color: #f0f2f5;
      }

      a { color: #7c3aed; }
      a img { border: none; }
      td { word-break: break-word; }

      .preheader {
        display: none !important;
        visibility: hidden;
        mso-hide: all;
        font-size: 1px;
        line-height: 1px;
        max-height: 0;
        max-width: 0;
        opacity: 0;
        overflow: hidden;
      }

      body, td, th {
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      }

      h1 {
        margin: 0 0 12px;
        color: #1e293b;
        font-size: 26px;
        font-weight: 800;
        text-align: center;
        letter-spacing: -0.5px;
      }

      p {
        margin: 0 0 16px;
        font-size: 16px;
        line-height: 1.7;
        color: #475569;
      }

      .email-wrapper {
        width: 100%;
        margin: 0;
        padding: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      .email-content {
        width: 100%;
        margin: 0;
        padding: 0;
      }

      .email-body_inner {
        width: 560px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 16px;
        overflow: hidden;
      }

      .email-footer {
        width: 560px;
        margin: 0 auto;
        text-align: center;
      }

      .email-footer p {
        color: #cbd5e1;
        font-size: 13px;
        margin: 4px 0;
      }

      .email-footer a {
        color: #e2e8f0;
        text-decoration: underline;
      }

      .header-accent {
        height: 6px;
        background: linear-gradient(90deg, #7c3aed, #a855f7, #ec4899);
        font-size: 0;
        line-height: 0;
      }

      .logo-container {
        text-align: center;
        padding: 40px 0 8px;
      }

      .logo-icon {
        display: inline-block;
        width: 72px;
        height: 72px;
        background: linear-gradient(135deg, #7c3aed, #a855f7);
        border-radius: 20px;
        line-height: 72px;
        font-size: 36px;
        text-align: center;
      }

      .content-cell {
        padding: 8px 48px 40px;
      }

      .greeting {
        text-align: center;
        margin-bottom: 8px;
      }

      .greeting-name {
        color: #7c3aed;
        font-weight: 700;
      }

      .divider {
        width: 60px;
        height: 4px;
        background: linear-gradient(90deg, #7c3aed, #a855f7);
        border-radius: 2px;
        margin: 24px auto;
      }

      .body-text {
        text-align: center;
        max-width: 440px;
        margin: 0 auto 24px;
      }

      .expiry-badge {
        display: inline-block;
        background: #fef2f2;
        color: #dc2626;
        font-size: 14px;
        font-weight: 600;
        padding: 8px 20px;
        border-radius: 20px;
        margin: 0 auto 28px;
        text-align: center;
      }

      .button-wrapper {
        width: 100%;
        margin: 0 auto 32px;
        text-align: center;
      }

      .button {
        display: inline-block;
        padding: 16px 48px;
        font-size: 16px;
        font-weight: 700;
        color: #ffffff !important;
        text-decoration: none;
        background: linear-gradient(135deg, #7c3aed, #a855f7);
        border-radius: 12px;
        letter-spacing: 0.3px;
        box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
      }

      .button:hover {
        background: linear-gradient(135deg, #6d28d9, #9333ea);
        box-shadow: 0 6px 20px rgba(124, 58, 237, 0.45);
      }

      .fallback-link {
        text-align: center;
        padding: 16px 20px;
        background: #f8fafc;
        border-radius: 10px;
        margin-bottom: 32px;
      }

      .fallback-link p {
        font-size: 13px;
        color: #94a3b8;
        margin-bottom: 8px;
      }

      .fallback-link a {
        font-size: 13px;
        color: #7c3aed;
        word-break: break-all;
        text-decoration: underline;
      }

      .security-notice {
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 12px;
        padding: 20px 24px;
        margin-bottom: 8px;
      }

      .security-notice td {
        vertical-align: top;
      }

      .security-icon {
        width: 24px;
        padding: 0 12px 0 0;
      }

      .security-text p {
        margin: 0;
        font-size: 14px;
        color: #b91c1c;
        line-height: 1.6;
      }

      .security-text strong {
        font-weight: 700;
      }

      .security-text a {
        color: #dc2626;
        text-decoration: underline;
      }

      @media only screen and (max-width: 600px) {
        .email-body_inner,
        .email-footer {
          width: 100% !important;
        }
        .content-cell {
          padding: 8px 24px 32px !important;
        }
        h1 {
          font-size: 22px !important;
        }
        .button {
          display: block !important;
          width: 100% !important;
          box-sizing: border-box !important;
          text-align: center !important;
        }
        .logo-container {
          padding: 28px 0 4px !important;
        }
        .logo-icon {
          width: 60px !important;
          height: 60px !important;
          line-height: 60px !important;
          font-size: 28px !important;
        }
      }

      @media (prefers-color-scheme: dark) {
        body {
          background-color: #0f172a !important;
        }
        .email-body_inner {
          background-color: #1e293b !important;
        }
        h1 { color: #f1f5f9 !important; }
        p { color: #cbd5e1 !important; }
        .fallback-link { background-color: #334155 !important; }
        .fallback-link p { color: #94a3b8 !important; }
        .fallback-link a { color: #a78bfa !important; }
        .security-notice {
          background: #450a0a !important;
          border-color: #7f1d1d !important;
        }
        .security-text p { color: #fca5a5 !important; }
        .security-text a { color: #f87171 !important; }
        .expiry-badge {
          background: #450a0a !important;
          color: #fca5a5 !important;
        }
      }
    </style>
    <!--[if mso]>
      <style type="text/css">
        .f-fallback { font-family: Arial, sans-serif; }
        .button { background: #7c3aed !important; }
      </style>
    <![endif]-->
  </head>
  <body>
    <span class="preheader">
      Reset your ShopIT password — link valid for 30 minutes.
    </span>
    <table
      class="email-wrapper"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
    >
      <tr>
        <td align="center" style="padding: 48px 16px;">
          <table
            class="email-content"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
          >
            <!-- Outer padding -->
            <tr>
              <td align="center">
                <table
                  class="email-body_inner"
                  align="center"
                  width="560"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                >
                  <!-- Purple gradient accent bar -->
                  <tr>
                    <td class="header-accent">&nbsp;</td>
                  </tr>

                  <!-- Logo -->
                  <tr>
                    <td class="logo-container">
                      <span class="logo-icon">🔒</span>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td class="content-cell">
                      <div class="f-fallback">
                        <!-- Greeting -->
                        <h1>Reset your password</h1>

                        <div class="divider">&nbsp;</div>

                        <p class="body-text">
                          Hey <span class="greeting-name">${userName}</span>,
                          we received a request to reset the password for your
                          ShopIT account. No worries — we've got you covered.
                        </p>

                        <!-- Expiry badge -->
                        <table
                          width="100%"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          style="margin-bottom: 28px;"
                        >
                          <tr>
                            <td align="center">
                              <span class="expiry-badge">
                                ⏱ Link expires in 30 minutes
                              </span>
                            </td>
                          </tr>
                        </table>

                        <!-- CTA Button -->
                        <div class="button-wrapper">
                          <!--[if mso]>
                            <v:roundrect
                              xmlns:v="urn:schemas-microsoft-com:vml"
                              xmlns:w="urn:schemas-microsoft-com:office:word"
                              href="${resetUrl}"
                              style="height: 52px; v-text-anchor: middle; width: 280px;"
                              arcsize="23%"
                              fillcolor="#7c3aed"
                              stroke="f"
                            >
                              <w:anchorlock />
                              <center style="color: #ffffff; font-weight: 700; font-size: 16px;">
                                Reset Password
                              </center>
                            </v:roundrect>
                          <![endif]-->
                          <!--[if !mso]><!-->
                          <a
                            href="${resetUrl}"
                            class="button"
                            target="_blank"
                          >
                            Reset Password
                          </a>
                          <!--<![endif]-->
                        </div>

                        <!-- Fallback plain link -->
                        <table
                          class="fallback-link"
                          width="100%"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                        >
                          <tr>
                            <td align="center">
                              <p>Or copy this link into your browser:</p>
                              <a href="${resetUrl}">${resetUrl}</a>
                            </td>
                          </tr>
                        </table>

                        <!-- Security notice -->
                        <table
                          class="security-notice"
                          width="100%"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                        >
                          <tr>
                            <td class="security-icon" width="24">
                              🛡️
                            </td>
                            <td class="security-text">
                              <p>
                                <strong>Didn't request this?</strong><br />
                                If you didn't ask to reset your password, please
                                ignore this email or
                                <a href="mailto:support@shopit.com">contact support</a>
                                immediately.
                              </p>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- Footer -->
                <table
                  class="email-footer"
                  align="center"
                  width="560"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                >
                  <tr>
                    <td class="content-cell" align="center" style="padding: 32px 48px 8px;">
                      <p style="margin-bottom: 4px;">
                        <strong style="color: #e2e8f0; font-weight: 700;">ShopIT</strong>
                      </p>
                      <p>1234 Street Rd. &bull; Suite 1234</p>
                      <p style="margin-top: 12px;">
                        &copy; ${new Date().getFullYear()} ShopIT.
                        All rights reserved.
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
