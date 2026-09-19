import nodemailer from 'nodemailer';

interface SendConfirmationEmailParams {
  to: string;
  recipientName: string;
  registrationId: string;
  familyName: string;
  houseNumber: string;
  blockTower: string;
  entriesCount: number;
  pdfBuffer?: Buffer;
}

export async function sendRegistrationConfirmationEmail(params: SendConfirmationEmailParams): Promise<boolean> {
  const {
    to,
    recipientName,
    registrationId,
    familyName,
    houseNumber,
    blockTower,
    entriesCount,
    pdfBuffer,
  } = params;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || 'aniket.singh07vs@gmail.com',
        pass: process.env.SMTP_PASS || 'ifwkfihuwjdizmtb',
      },
    });

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #334155;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 32px 24px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: 1px;">COLONYGAMES 2026</h1>
          <p style="margin: 6px 0 0 0; color: #d1fae5; font-size: 14px; font-weight: 500;">Society Sports Fest • Official Entry Confirmation</p>
        </div>
        
        <div style="padding: 28px 24px;">
          <h2 style="color: #ffffff; font-size: 20px; margin-top: 0;">Registration Confirmed! 🎉</h2>
          <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
            Hello <strong>${recipientName}</strong>, your family's registration for the <strong>ColonyGames 2026 Society Sports Fest</strong> has been successfully confirmed.
          </p>
          
          <div style="background-color: #1e293b; border-radius: 8px; padding: 20px; margin: 24px 0; border: 1px solid #334155;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; color: #94a3b8;">Registration ID:</td>
                <td style="padding: 6px 0; color: #10b981; font-weight: bold; font-family: monospace; font-size: 16px;">${registrationId}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8;">Family & Unit:</td>
                <td style="padding: 6px 0; color: #ffffff; font-weight: 600;">${familyName} (${blockTower} - ${houseNumber})</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8;">Registered Sports:</td>
                <td style="padding: 6px 0; color: #ffffff; font-weight: 600;">${entriesCount} athlete entries</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8;">Status:</td>
                <td style="padding: 6px 0; color: #34d399; font-weight: bold;">Confirmed & Verified</td>
              </tr>
            </table>
          </div>

          <div style="background: rgba(16, 185, 129, 0.1); border-left: 4px solid #10b981; padding: 12px 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
            <p style="margin: 0; color: #a7f3d0; font-size: 13.5px; line-height: 1.5;">
              📎 <strong>Official Pass Attached:</strong> Your downloadable entry pass with high-contrast QR code is attached to this email. Please display it at the entry desk on festival day.
            </p>
          </div>

          <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; margin-top: 24px;">
            Need to view the schedule, match fixtures, or live leaderboard? Visit our portal at 
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" style="color: #38bdf8; text-decoration: none;">ColonyGames Portal</a>.
          </p>
        </div>

        <div style="background-color: #090d16; padding: 16px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b;">
          Green Meadows Resident Welfare Association • Sports Organizing Committee
        </div>
      </div>
    `;

    const attachments = pdfBuffer
      ? [
          {
            filename: `ColonyGames_Pass_${registrationId}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ]
      : [];

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"ColonyGames Fest" <aniket.singh07vs@gmail.com>',
      to,
      subject: `🏆 Registration Confirmed: ColonyGames 2026 [ID: ${registrationId}]`,
      html: emailHtml,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Confirmation email dispatched to ${to}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Failed to send confirmation email via Gmail SMTP:', error);
    // Non-blocking: return false so caller continues
    return false;
  }
}
