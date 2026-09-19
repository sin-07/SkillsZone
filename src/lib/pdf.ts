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

  // Background Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Accent Line
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.rect(0, 42, pageWidth, 3, 'F');

  // Fest Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('COLONYGAMES 2026', 15, 18);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Annual Society Sports Fest • Official Athlete & Family Pass', 15, 26);

  doc.setFontSize(9);
  doc.setTextColor(52, 211, 153); // emerald-400
  doc.text('VENUE: Central Society Sports Complex & Grounds', 15, 33);

  // Pass Status Pill
  doc.setFillColor(6, 78, 59); // emerald-900
  doc.roundedRect(pageWidth - 62, 12, 47, 18, 3, 3, 'F');
  doc.setTextColor(52, 211, 153);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('STATUS: CONFIRMED', pageWidth - 57, 20);
  doc.setFontSize(8);
  doc.setTextColor(209, 250, 229);
  doc.text(`ID: ${data.registrationId}`, pageWidth - 57, 26);

  // QR Code & Key Information Card
  const cardTop = 52;
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(14, cardTop, pageWidth - 28, 50, 3, 3, 'FD');

  // Left Details
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Registration & Family Details', 20, cardTop + 10);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  doc.text(`Family / House:`, 20, cardTop + 18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${data.familyName} (${data.blockTower} - ${data.houseNumber})`, 55, cardTop + 18);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Primary Contact:`, 20, cardTop + 26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${data.contactName} (${data.contactPhone})`, 55, cardTop + 26);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Registered Email:`, 20, cardTop + 34);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${data.contactEmail}`, 55, cardTop + 34);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Issue Date:`, 20, cardTop + 42);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${new Date(data.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`, 55, cardTop + 42);

  // QR Code Image on Right
  if (data.qrCodeDataUrl) {
    try {
      doc.addImage(data.qrCodeDataUrl, 'PNG', pageWidth - 55, cardTop + 5, 40, 40);
    } catch (e) {
      console.error('PDF QR insert error:', e);
    }
  }

  // Participants & Sports Schedule Table
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Registered Athletes & Event Schedule', 15, 112);

  const tableRows = data.entries.map((entry, idx) => [
    (idx + 1).toString(),
    entry.participantName,
    `${entry.age ? `${entry.age}y` : ''} ${entry.gender ? `• ${entry.gender}` : ''} ${entry.tShirtSize ? `• T-Shirt: ${entry.tShirtSize}` : ''}`,
    entry.eventTitle,
    entry.sportType,
    entry.venue || 'Sports Complex Ground',
    entry.scheduleTime || 'Check Schedule Board',
    entry.roleOrNotes || 'Regular Entry',
  ]);

  autoTable(doc, {
    startY: 116,
    head: [['#', 'Athlete Name', 'Details', 'Sport / Event', 'Sport Type', 'Venue', 'Time Slot', 'Role/Partner']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
      cellPadding: 3,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { fontStyle: 'bold', cellWidth: 28 },
      2: { cellWidth: 32 },
      3: { fontStyle: 'bold', cellWidth: 30 },
      4: { cellWidth: 20 },
      5: { cellWidth: 28 },
      6: { cellWidth: 22 },
      7: { cellWidth: 22 },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = (doc as any).lastAutoTable?.finalY || 190;

  // Guidelines Box
  const guidelinesY = Math.min(finalY + 10, 235);
  doc.setFillColor(241, 245, 249); // slate-100
  doc.roundedRect(14, guidelinesY, pageWidth - 28, 38, 2, 2, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('ATHLETE CODE OF CONDUCT & IMPORTANT INSTRUCTIONS', 20, guidelinesY + 7);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('1. Present this digital or printed pass with the QR code at the registration desk to collect athlete kits.', 20, guidelinesY + 14);
  doc.text('2. Arrive at the designated court/ground 15 minutes prior to match time. Forfeit rule applies after 10m delay.', 20, guidelinesY + 20);
  doc.text('3. Wear appropriate non-marking athletic shoes for indoor badminton and table tennis arenas.', 20, guidelinesY + 26);
  doc.text('4. First aid paramedics and hydration points are available at the Main Clubhouse.', 20, guidelinesY + 32);

  // Footer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'ColonyGames 2026 • Green Meadows Sports Welfare Committee • Support: sports@colonygames.internal',
    pageWidth / 2,
    286,
    { align: 'center' }
  );

  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}
