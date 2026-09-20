import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface PDFPassData {
  registrationId: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  familyName: string;
  houseNumber: string;
  blockTower: string;
  status: string;
  createdAt: string | Date;
  entries: Array<{
    participantName: string;
    age?: number;
    gender?: string;
    tShirtSize?: string;
    eventTitle: string;
    sportType: string;
    venue?: string;
    scheduleTime?: string;
    roleOrNotes?: string;
  }>;
  qrCodeDataUrl?: string;
}

export function generateRegistrationPDF(data: PDFPassData): Buffer {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // ================= 1. SWISS ARCHITECTURAL HEADER =================
  // Main Banner (Swiss Black)
  doc.setFillColor(17, 17, 17); // #111111
  doc.rect(0, 0, pageWidth, 44, 'F');

  // Accent Line (Swiss Red)
  doc.setFillColor(220, 38, 38); // #dc2626
  doc.rect(0, 44, pageWidth, 2.5, 'F');

  // Brand Mark Box: "CG"
  doc.setFillColor(220, 38, 38);
  doc.rect(margin, 9, 12, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('CG', margin + 2.2, 17.5);

  // Main Title: "COLONY" (White) + "GAMES" (Swiss Red)
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(21);
  doc.text('COLONY', margin + 16, 17.5);

  const colonyWidth = doc.getTextWidth('COLONY');
  doc.setTextColor(220, 38, 38);
  doc.text('GAMES', margin + 17 + colonyWidth, 17.5);

  // Monospaced 2026 Year Badge
  const gamesWidth = doc.getTextWidth('GAMES');
  const badgeX = margin + 19 + colonyWidth + gamesWidth;
  doc.setFillColor(255, 255, 255);
  doc.rect(badgeX, 11, 14, 7, 'F');
  doc.setTextColor(17, 17, 17);
  doc.setFont('courier', 'bold');
  doc.setFontSize(8.5);
  doc.text('2026', badgeX + 1.8, 16);

  // Subheaders with crisp typography
  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(170, 170, 170);
  doc.text('ANNUAL SOCIETY SPORTS FEST • OFFICIAL ATHLETE & FAMILY PASS', margin + 16, 24);

  doc.setFont('courier', 'bold');
  doc.setTextColor(220, 220, 220);
  doc.text('OCTOBER 15–18, 2026 • CENTRAL SPORTS COMPLEX & GROUNDS', margin + 16, 30);

  doc.setFont('courier', 'normal');
  doc.setTextColor(140, 140, 140);
  doc.text('GREEN MEADOWS RESIDENT WELFARE ASSOCIATION (RWA) ACCREDITED', margin + 16, 36);

  // Status Badge (Right side of Header)
  const badgeRightX = pageWidth - margin - 50;
  doc.setFillColor(220, 38, 38);
  doc.rect(badgeRightX, 9, 50, 13, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('STATUS: CONFIRMED', badgeRightX + 4, 15);
  doc.setFont('courier', 'bold');
  doc.setFontSize(6.5);
  doc.text('OFFICIAL ATHLETIC CREDENTIAL', badgeRightX + 4, 19.5);

  // Registration ID Box
  doc.setFillColor(32, 32, 32);
  doc.rect(badgeRightX, 23, 50, 13, 'F');
  doc.setTextColor(170, 170, 170);
  doc.setFont('courier', 'normal');
  doc.setFontSize(6.5);
  doc.text('REGISTRATION PASS ID:', badgeRightX + 4, 28);
  doc.setTextColor(255, 255, 255);
  doc.setFont('courier', 'bold');
  doc.setFontSize(9.5);
  doc.text(data.registrationId, badgeRightX + 4, 33.5);

  // ================= 2. HOUSEHOLD & REGISTRATION DOSSIER =================
  const section1Y = 53;
  doc.setFont('courier', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(17, 17, 17);
  doc.text('[01] REGISTRATION & HOUSEHOLD DOSSIER', margin, section1Y);

  const cardTop = section1Y + 3;
  const cardHeight = 47;

  // Background Card with crisp Swiss border
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(0.35);
  doc.rect(margin, cardTop, contentWidth, cardHeight, 'FD');

  // Vertical hairline divider for QR section
  const qrSectionX = pageWidth - margin - 46;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.25);
  doc.line(qrSectionX, cardTop, qrSectionX, cardTop + cardHeight);

  // Left Details Grid
  const textLeft = margin + 5;
  const col2X = margin + 46;

  // Row 1: Family Name & Residence
  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);
  doc.text('FAMILY / RESIDENCE:', textLeft, cardTop + 8);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(17, 17, 17);
  doc.text(data.familyName, col2X, cardTop + 8);

  // Row 2: Block & House
  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);
  doc.text('TOWER & APARTMENT:', textLeft, cardTop + 15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(220, 38, 38);
  doc.text(`${data.blockTower} • Flat ${data.houseNumber}`, col2X, cardTop + 15);

  // Row 3: Primary Contact & Phone
  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);
  doc.text('PRIMARY CONTACT:', textLeft, cardTop + 22);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(17, 17, 17);
  doc.text(`${data.contactName} (${data.contactPhone})`, col2X, cardTop + 22);

  // Row 4: Registered Email
  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);
  doc.text('REGISTERED EMAIL:', textLeft, cardTop + 29);
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(17, 17, 17);
  doc.text(data.contactEmail, col2X, cardTop + 29);

  // Row 5: Issuance Date & Clearance
  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);
  doc.text('ISSUANCE DATE:', textLeft, cardTop + 36);
  doc.setFont('courier', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(17, 17, 17);
  const formattedDate = new Date(data.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  doc.text(formattedDate, col2X, cardTop + 36);

  // Row 6: Security Verification Tag
  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);
  doc.text('GATE ACCESS LEVEL:', textLeft, cardTop + 43);
  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(220, 38, 38);
  doc.text('ALL-ACCESS ATHLETE & SPECTATOR PASS • T-SHIRT KIT AUTHORIZED', col2X, cardTop + 43);

  // QR Code on Right
  const qrBoxSize = 34;
  const qrBoxX = qrSectionX + (46 - qrBoxSize) / 2;
  const qrBoxY = cardTop + 4;

  if (data.qrCodeDataUrl) {
    try {
      doc.addImage(data.qrCodeDataUrl, 'PNG', qrBoxX, qrBoxY, qrBoxSize, qrBoxSize);
      doc.setFont('courier', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(17, 17, 17);
      doc.text('SCAN FOR GATE ENTRY', qrSectionX + 23, cardTop + 42, { align: 'center' });
    } catch (e) {
      console.error('PDF QR insert error:', e);
    }
  }

  // ================= 3. ATHLETE ROSTER & EVENT SCHEDULE TABLE =================
  const section2Y = cardTop + cardHeight + 8;
  doc.setFont('courier', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(17, 17, 17);
  doc.text(`[02] ATHLETE ROSTER & COMPETITION SCHEDULE (${data.entries.length} ENTRIES)`, margin, section2Y);

  const tableRows = data.entries.map((entry, idx) => {
    const details = [
      entry.age ? `${entry.age}y` : '',
      entry.gender || '',
      entry.tShirtSize ? `Size: ${entry.tShirtSize}` : '',
    ]
      .filter(Boolean)
      .join(' • ');

    return [
      String(idx + 1).padStart(2, '0'),
      entry.participantName,
      details || 'General Athlete',
      entry.eventTitle,
      entry.sportType,
      entry.venue || 'Central Sports Ground',
      entry.scheduleTime || 'Check Live Schedule',
      entry.roleOrNotes || 'Regular Entry',
    ];
  });

  autoTable(doc, {
    startY: section2Y + 3,
    head: [['#', 'ATHLETE NAME', 'DEMOGRAPHICS / T-SHIRT', 'SPORT / TOURNAMENT', 'TYPE', 'VENUE', 'TIME SLOT', 'ROLE / NOTES']],
    body: tableRows,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      textColor: [17, 17, 17],
      lineColor: [220, 220, 220],
      lineWidth: 0.2,
      cellPadding: 2.2,
    },
    headStyles: {
      fillColor: [17, 17, 17], // Swiss Black
      textColor: [255, 255, 255],
      font: 'helvetica',
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'left',
      cellPadding: 2.8,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8, font: 'courier', fontStyle: 'bold' },
      1: { fontStyle: 'bold', cellWidth: 32 },
      2: { cellWidth: 32, font: 'courier', fontSize: 7 },
      3: { fontStyle: 'bold', cellWidth: 30 },
      4: { cellWidth: 16, font: 'courier' },
      5: { cellWidth: 26 },
      6: { cellWidth: 20, font: 'courier', fontSize: 7 },
      7: { cellWidth: 18, font: 'courier', fontSize: 7 },
    },
    alternateRowStyles: {
      fillColor: [248, 248, 246], // subtle eggshell
    },
    margin: { left: margin, right: margin },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = (doc as any).lastAutoTable?.finalY || 185;

  // ================= 4. GATE ACCESS PROTOCOLS & ATHLETE DIRECTIVES =================
  const protocolsY = Math.min(finalY + 6, pageHeight - 56);
  const protocolsHeight = 31;

  // Background Box
  doc.setFillColor(248, 248, 246);
  doc.rect(margin, protocolsY, contentWidth, protocolsHeight, 'F');

  // Swiss Red Left Accent Bar
  doc.setFillColor(220, 38, 38);
  doc.rect(margin, protocolsY, 3, protocolsHeight, 'F');

  // Border
  doc.setDrawColor(210, 210, 210);
  doc.setLineWidth(0.25);
  doc.rect(margin, protocolsY, contentWidth, protocolsHeight, 'S');

  // Protocols Heading
  doc.setFont('courier', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(17, 17, 17);
  doc.text('[03] GATE ACCESS PROTOCOLS & ATHLETE DIRECTIVES', margin + 6, protocolsY + 6);

  // Protocols Content
  doc.setFont('courier', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(60, 60, 60);

  doc.text(
    '[01] OFFICIAL KIT PICKUP: Present this pass at Tower-C Club Lounge on Oct 13-14 (10 AM - 8 PM) to collect jerseys.',
    margin + 6,
    protocolsY + 12
  );
  doc.text(
    '[02] REPORTING TIME: Report to your venue desk 15 minutes prior to scheduled slot. 10m delay leads to walkover.',
    margin + 6,
    protocolsY + 17
  );
  doc.text(
    '[03] MANDATORY GEAR: Non-marking shoes required for badminton & table tennis. Moulded studs on football turf.',
    margin + 6,
    protocolsY + 22
  );
  doc.text(
    '[04] FIRST AID & HYDRATION: Medical trauma response and electrolyte stations are stationed at Central Clubhouse.',
    margin + 6,
    protocolsY + 27
  );

  // ================= 5. SECURITY COLOPHON & FOOTER =================
  const footerLineY = pageHeight - 16;
  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(0.3);
  doc.line(margin, footerLineY, pageWidth - margin, footerLineY);

  doc.setFont('courier', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(17, 17, 17);
  doc.text('COLONYGAMES 2026 • OFFICIAL RESIDENT CREDENTIAL • RWA ACCREDITED', margin, footerLineY + 5);

  doc.setFont('courier', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`HASH: ${data.registrationId} • HQ: hq@colonygames.org • +91 98765 43210`, margin, footerLineY + 9);

  doc.setFont('courier', 'bold');
  doc.setTextColor(220, 38, 38);
  doc.text('VALID CREDENTIAL ↗', pageWidth - margin, footerLineY + 5, { align: 'right' });

  doc.setFont('courier', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text('PAGE 1 OF 1', pageWidth - margin, footerLineY + 9, { align: 'right' });

  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}
