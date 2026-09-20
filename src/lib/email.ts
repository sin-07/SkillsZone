import nodemailer from 'nodemailer';

export interface ConfirmationEmailEntry {
  participantName: string;
  age?: number;
  gender?: string;
  tShirtSize?: string;
  eventTitle: string;
  sportType: string;
  venue?: string;
  scheduleTime?: string;
  roleOrNotes?: string;
}

export interface SendConfirmationEmailParams {
  to: string;
  recipientName?: string;
  contactName?: string;
  registrationId: string;
  familyName: string;
  houseNumber: string;
  blockTower: string;
  contactPhone?: string;
  entriesCount: number;
  entries?: ConfirmationEmailEntry[];
  pdfBuffer?: Buffer;
}

export function generateConfirmationEmailHtml(params: SendConfirmationEmailParams): string {
  const {
    registrationId,
    familyName,
    houseNumber,
    blockTower,
    contactPhone,
    entriesCount,
    entries = [],
  } = params;

  const recipientName = params.recipientName || params.contactName || params.familyName || 'Resident';

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const passUrl = `${appUrl}/confirmation/${registrationId}`;
  const leaderboardUrl = `${appUrl}/results`;

  // Render athlete entries table rows if available
  const entriesHtml =
    entries.length > 0
      ? `
        <div style="margin: 28px 0 20px 0;">
          <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #111111; margin-bottom: 8px;">
            [02] REGISTERED ATHLETE ROSTER (${entries.length} ENTRIES)
          </div>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #111111; font-size: 12px; background-color: #ffffff;">
            <thead>
              <tr style="background-color: #111111; color: #ffffff; text-align: left;">
                <th style="padding: 9px 10px; font-family: ui-monospace, monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; border-right: 1px solid #333333; width: 30px; text-align: center;">#</th>
                <th style="padding: 9px 10px; font-family: ui-monospace, monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; border-right: 1px solid #333333;">Athlete</th>
                <th style="padding: 9px 10px; font-family: ui-monospace, monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; border-right: 1px solid #333333;">Sport / Event</th>
                <th style="padding: 9px 10px; font-family: ui-monospace, monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; border-right: 1px solid #333333;">Schedule</th>
                <th style="padding: 9px 10px; font-family: ui-monospace, monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em;">T-Shirt / Role</th>
              </tr>
            </thead>
            <tbody>
              ${entries
                .map(
                  (entry, idx) => `
                <tr style="border-bottom: 1px solid #e5e5e0; background-color: ${idx % 2 === 0 ? '#ffffff' : '#fafaf7'};">
                  <td style="padding: 8px 10px; font-family: ui-monospace, monospace; font-weight: 700; color: #666666; text-align: center; border-right: 1px solid #e5e5e0;">
                    ${String(idx + 1).padStart(2, '0')}
                  </td>
                  <td style="padding: 8px 10px; font-weight: 700; color: #111111; border-right: 1px solid #e5e5e0;">
                    ${entry.participantName}
                    ${entry.age ? `<div style="font-size: 10px; color: #777777; font-weight: normal;">${entry.age} yrs • ${entry.gender || 'Athlete'}</div>` : ''}
                  </td>
                  <td style="padding: 8px 10px; border-right: 1px solid #e5e5e0;">
                    <div style="font-weight: 700; color: #111111;">${entry.eventTitle}</div>
                    <div style="font-size: 10px; color: #dc2626; font-family: ui-monospace, monospace; text-transform: uppercase;">${entry.sportType}</div>
                  </td>
                  <td style="padding: 8px 10px; font-family: ui-monospace, monospace; font-size: 11px; color: #444444; border-right: 1px solid #e5e5e0;">
                    ${entry.scheduleTime || 'Check Schedule'}
                  </td>
                  <td style="padding: 8px 10px; font-size: 11px; color: #444444;">
                    ${entry.tShirtSize ? `<span style="display: inline-block; background: #f4f4f0; border: 1px solid #cccccc; padding: 1px 5px; font-family: monospace; font-size: 10px; font-weight: bold; margin-bottom: 3px;">T-SHIRT: ${entry.tShirtSize}</span><br/>` : ''}
                    ${entry.roleOrNotes || 'Regular Entry'}
                  </td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      `
      : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ColonyGames 2026 Confirmation - ${registrationId}</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #f4f4f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #111111;">
  <div style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border: 1px solid #111111; box-shadow: 0 8px 24px -4px rgba(17, 17, 17, 0.08); overflow: hidden;">
    
    <!-- Top Black Architectural Header -->
    <div style="background-color: #111111; padding: 28px 24px 22px 24px; border-bottom: 3px solid #dc2626; color: #ffffff;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="vertical-align: middle;">
            <table style="border-collapse: collapse;">
              <tr>
                <td style="background-color: #dc2626; color: #ffffff; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 800; font-size: 14px; width: 34px; height: 34px; text-align: center; vertical-align: middle; border: 1px solid #dc2626;">
                  CG
                </td>
                <td style="padding-left: 12px;">
                  <div style="font-size: 20px; font-weight: 900; letter-spacing: -0.02em; text-transform: uppercase; color: #ffffff; line-height: 1;">
                    COLONY<span style="color: #dc2626;">GAMES</span>
                    <span style="font-family: ui-monospace, monospace; font-size: 11px; font-weight: 700; background-color: #ffffff; color: #111111; padding: 2px 5px; margin-left: 6px; letter-spacing: 0.05em; vertical-align: middle;">2026</span>
                  </div>
                  <div style="font-family: ui-monospace, monospace; font-size: 9.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #aaaaaa; margin-top: 5px;">
                    SOCIETY SPORTS FEST • OCT 15–18, 2026
                  </div>
                </td>
              </tr>
            </table>
          </td>
          <td style="text-align: right; vertical-align: middle;">
            <div style="display: inline-block; background-color: #dc2626; color: #ffffff; font-family: ui-monospace, monospace; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; padding: 4px 10px; border: 1px solid #dc2626;">
              CONFIRMED
            </div>
            <div style="font-family: ui-monospace, monospace; font-size: 10px; color: #aaaaaa; margin-top: 4px;">
              PASS: <strong style="color: #ffffff;">${registrationId}</strong>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Main Content Area -->
    <div style="padding: 32px 24px; background-color: #ffffff;">
      
      <!-- Greeting Headline -->
      <h1 style="margin: 0 0 10px 0; font-size: 22px; font-weight: 900; letter-spacing: -0.02em; text-transform: uppercase; color: #111111; line-height: 1.2;">
        REGISTRATION CONFIRMED • PASS ISSUED
      </h1>
      <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #444444;">
        Dear <strong>${recipientName}</strong>, your family's athletic pass for the <strong>ColonyGames 2026 Annual Society Sports Championship</strong> has been officially confirmed by the RWA Sports Organizing Committee.
      </p>

      <!-- Section 01: Household Dossier Box -->
      <div style="margin-bottom: 24px;">
        <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #111111; margin-bottom: 8px;">
          [01] OFFICIAL HOUSEHOLD DOSSIER
        </div>
        
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #111111; background-color: #fafaf7; font-size: 13px;">
          <tr>
            <td style="padding: 10px 14px; border-bottom: 1px solid #e5e5e0; border-right: 1px solid #e5e5e0; font-family: ui-monospace, monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #666666; width: 35%;">
              Registration ID:
            </td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #e5e5e0; font-family: ui-monospace, monospace; font-size: 13px; font-weight: 800; color: #dc2626;">
              ${registrationId}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; border-bottom: 1px solid #e5e5e0; border-right: 1px solid #e5e5e0; font-family: ui-monospace, monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #666666;">
              Family & Residence:
            </td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #e5e5e0; font-weight: 700; color: #111111;">
              ${familyName} <span style="color: #666666; font-weight: normal;">(${blockTower} • Flat ${houseNumber})</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; border-bottom: 1px solid #e5e5e0; border-right: 1px solid #e5e5e0; font-family: ui-monospace, monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #666666;">
              Primary Contact:
            </td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #e5e5e0; font-weight: 600; color: #111111;">
              ${recipientName} ${contactPhone ? `<span style="font-family: monospace; font-size: 11px; color: #555555;">(${contactPhone})</span>` : ''}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; border-bottom: 1px solid #e5e5e0; border-right: 1px solid #e5e5e0; font-family: ui-monospace, monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #666666;">
              Registered Athletes:
            </td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #e5e5e0; font-weight: 700; color: #111111;">
              ${entriesCount} Competition Entries
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; border-right: 1px solid #e5e5e0; font-family: ui-monospace, monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #666666;">
              Gate Access Level:
            </td>
            <td style="padding: 10px 14px; font-family: ui-monospace, monospace; font-size: 11px; font-weight: 700; color: #111111;">
              ALL-ACCESS ATHLETE & FAMILY SPECTATOR PASS
            </td>
          </tr>
        </table>
      </div>

      <!-- Athlete Entries Table -->
      ${entriesHtml}

      <!-- PDF Attachment Notification Callout -->
      <div style="background-color: #fafaf7; border: 1px solid #111111; border-left: 4px solid #111111; padding: 14px 18px; margin: 24px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 24px; vertical-align: top; font-size: 16px;">
              📎
            </td>
            <td style="padding-left: 8px; vertical-align: top;">
              <div style="font-family: ui-monospace, monospace; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #111111;">
                OFFICIAL PRINTABLE PDF PASS ATTACHED
              </div>
              <p style="margin: 4px 0 0 0; font-size: 12.5px; color: #555555; line-height: 1.5;">
                We have attached your official high-resolution tournament credential <strong>ColonyGames_Pass_${registrationId}.pdf</strong> with your scannable gate QR code. You may also access it online anytime below.
              </p>
            </td>
          </tr>
        </table>
      </div>

      <!-- Primary Action Buttons -->
      <div style="margin: 28px 0; text-align: center;">
        <table style="margin: 0 auto; border-collapse: collapse;">
          <tr>
            <td style="padding: 0 6px;">
              <a href="${passUrl}" style="display: inline-block; background-color: #111111; color: #ffffff; text-decoration: none; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; padding: 13px 22px; border: 1px solid #111111;">
                VIEW DIGITAL PASS & QR ↗
              </a>
            </td>
            <td style="padding: 0 6px;">
              <a href="${leaderboardUrl}" style="display: inline-block; background-color: #ffffff; color: #111111; text-decoration: none; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; padding: 13px 22px; border: 1px solid #111111;">
                LIVE LEADERBOARD ↗
              </a>
            </td>
          </tr>
        </table>
      </div>

      <!-- Section 03: Gate Access Protocols & Guidelines -->
      <div style="background-color: #fdf2f2; border: 1px solid #fca5a5; border-left: 4px solid #dc2626; padding: 16px 18px; margin-top: 24px;">
        <div style="font-family: ui-monospace, monospace; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #991b1b; margin-bottom: 8px;">
          [03] ATHLETE CODE OF CONDUCT & EVENT INSTRUCTIONS
        </div>
        <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #7f1d1d; line-height: 1.7;">
          <li><strong>Jersey & Kit Collection:</strong> Claim official dry-fit tournament t-shirts at Tower-C Club Lounge on Oct 13–14 (10 AM to 8 PM).</li>
          <li><strong>Reporting Protocol:</strong> Report to the match referee desk 15 minutes before fixture time. Walkover declared after 10m delay.</li>
          <li><strong>Footwear Regulation:</strong> Non-marking rubber soles mandatory for badminton and table tennis arenas.</li>
          <li><strong>First Aid & Hydration:</strong> Dedicated paramedics and electrolyte hydration booths available at the Central Clubhouse.</li>
        </ul>
      </div>

    </div>

    <!-- Bottom Swiss Colophon Footer -->
    <div style="background-color: #111111; border-top: 1px solid #222222; padding: 22px 24px; color: #888888; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 10px; line-height: 1.6;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="vertical-align: top; color: #aaaaaa;">
            <strong style="color: #ffffff; text-transform: uppercase;">COLONYGAMES 2026</strong><br/>
            Green Meadows Resident Welfare Association (RWA) • Sports Committee<br/>
            Central Sports Complex & Grounds • HQ: <a href="mailto:hq@colonygames.org" style="color: #dc2626; text-decoration: none;">hq@colonygames.org</a>
          </td>
          <td style="text-align: right; vertical-align: top; color: #777777;">
            PHONE: +91 98765 43210<br/>
            EDITION: SWISS GROTESK • 2026
          </td>
        </tr>
      </table>
    </div>

  </div>
</body>
</html>
  `;
}

export async function sendRegistrationConfirmationEmail(params: SendConfirmationEmailParams): Promise<boolean> {
  const {
    to,
    registrationId,
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

    const emailHtml = generateConfirmationEmailHtml(params);

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
      from: process.env.EMAIL_FROM || '"ColonyGames 2026" <aniket.singh07vs@gmail.com>',
      to,
      subject: `🏆 ColonyGames 2026 Entry Credential Confirmed [Pass ID: ${registrationId}]`,
      html: emailHtml,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Confirmation email dispatched to ${to}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Failed to send confirmation email via Gmail SMTP:', error);
    return false;
  }
}
