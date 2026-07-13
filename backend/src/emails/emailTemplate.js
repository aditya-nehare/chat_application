export function createWelcomeEmailTemplate(name, clientUrl) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.08);">

            <tr>
              <td style="background:#2563eb;padding:30px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;">Welcome!</h1>
              </td>
            </tr>

            <tr>
              <td style="padding:40px;color:#333333;">

                <h2 style="margin-top:0;">
                  Hi ${name},
                </h2>

                <p style="font-size:16px;line-height:1.6;">
                  Welcome! Your account has been created successfully.
                  We're excited to have you with us.
                </p>

                <p style="font-size:16px;line-height:1.6;">
                  Click the button below to start exploring the application.
                </p>

                <div style="text-align:center;margin:40px 0;">
                  <a
                    href="${clientUrl}"
                    style="
                      background:#2563eb;
                      color:#ffffff;
                      text-decoration:none;
                      padding:14px 32px;
                      border-radius:8px;
                      display:inline-block;
                      font-size:16px;
                      font-weight:bold;
                    "
                  >
                    Get Started
                  </a>
                </div>

                <p style="font-size:14px;color:#666;">
                  If the button doesn't work, copy and paste this link into your browser:
                </p>

                <p style="word-break:break-all;">
                  <a href="${clientUrl}" style="color:#2563eb;">
                    ${clientUrl}
                  </a>
                </p>

                <hr style="border:none;border-top:1px solid #eeeeee;margin:30px 0;" />

                <p style="font-size:13px;color:#888888;text-align:center;">
                  Thank you for joining us.<br />
                  We hope you enjoy your experience.
                </p>

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
