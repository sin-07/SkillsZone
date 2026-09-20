import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import { generateRegistrationPDF } from '../src/lib/pdf.ts';
import { generateConfirmationEmailHtml } from '../src/lib/email.ts';

async function run() {
  console.log('--- Testing PDF and Email Generation ---');

  // Generate sample QR code data url
  const qrData = JSON.stringify({
    id: 'CG-2026-9876',
    family: 'Sharma Residence (Tower A - Flat 402)',
    count: 3,
    url: 'http://localhost:3000/confirmation/CG-2026-9876',
  });
  const qrCodeDataUrl = await QRCode.toDataURL(qrData, { margin: 1, width: 200 });

  const sampleData = {
    registrationId: 'CG-2026-9876',
    contactName: 'Rajesh Sharma',
    contactEmail: 'rajesh.sharma@example.com',
    contactPhone: '+91 98234 11223',
    familyName: 'Sharma Residence',
    houseNumber: '402',
    blockTower: 'Tower A',
    status: 'CONFIRMED',
    createdAt: new Date('2026-09-20T10:30:00Z'),
    qrCodeDataUrl,
    entriesCount: 3,
    entries: [
      {
        participantName: 'Aarav Sharma',
        age: 16,
        gender: 'Male',
        tShirtSize: 'L',
        eventTitle: 'Box Cricket League (T10)',
        sportType: 'Cricket',
        venue: 'Main Sports Oval',
        scheduleTime: 'Oct 15 • 08:00 AM',
        roleOrNotes: 'All-Rounder',
      },
      {
        participantName: 'Meera Sharma',
        age: 14,
        gender: 'Female',
        tShirtSize: 'M',
        eventTitle: '100m Sprint Championship',
        sportType: 'Race',
        venue: 'Running Track A',
        scheduleTime: 'Oct 16 • 09:30 AM',
        roleOrNotes: 'Heat 2, Lane 4',
      },
      {
        participantName: 'Rajesh Sharma',
        age: 44,
        gender: 'Male',
        tShirtSize: 'XL',
        eventTitle: 'Badminton Doubles Open',
        sportType: 'Badminton',
        venue: 'Clubhouse Court 1',
        scheduleTime: 'Oct 17 • 04:00 PM',
        roleOrNotes: 'Partner: Sunil Verma',
      },
    ],
  };

  // 1. Test PDF Generation
  console.log('Generating PDF pass...');
  const pdfBuffer = generateRegistrationPDF(sampleData);
  console.log(`PDF generated successfully. Size: ${pdfBuffer.length} bytes.`);

  if (pdfBuffer.length < 5000) {
    throw new Error(`PDF size is suspiciously small: ${pdfBuffer.length} bytes`);
  }
  const pdfHeader = pdfBuffer.slice(0, 5).toString();
  if (pdfHeader !== '%PDF-') {
    throw new Error(`Invalid PDF header: ${pdfHeader}`);
  }
  console.log('PDF Header verified: %PDF-');

  const outDir = path.resolve(process.cwd(), 'scripts', 'test-output');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const pdfPath = path.join(outDir, 'test-pass.pdf');
  fs.writeFileSync(pdfPath, pdfBuffer);
  console.log(`Saved test PDF pass to: ${pdfPath}`);

  // 2. Test Email HTML Generation
  console.log('Generating Email HTML...');
  const emailHtml = generateConfirmationEmailHtml(sampleData);
  console.log(`Email HTML generated successfully. Length: ${emailHtml.length} characters.`);

  // Validation checks for Email HTML
  if (!emailHtml.includes('COLONY') || !emailHtml.includes('GAMES')) {
    throw new Error('Email HTML missing COLONYGAMES branding');
  }
  if (!emailHtml.includes('#dc2626')) {
    throw new Error('Email HTML missing Swiss red #dc2626 branding');
  }
  if (!emailHtml.includes('#111111')) {
    throw new Error('Email HTML missing Swiss black #111111 branding');
  }
  if (!emailHtml.includes('#f4f4f0')) {
    throw new Error('Email HTML missing Swiss eggshell canvas #f4f4f0');
  }
  if (!emailHtml.includes('CG-2026-9876')) {
    throw new Error('Email HTML missing registration ID');
  }
  if (!emailHtml.includes('Aarav Sharma') || !emailHtml.includes('Box Cricket League (T10)')) {
    throw new Error('Email HTML missing athlete entries');
  }

  // Check for broken contrast bugs (e.g. #ffffff text inside #ffffff bg)
  if (emailHtml.includes('color: #ffffff; font-size: 20px; margin-top: 0;') || emailHtml.includes('color: #cbd5e1; font-size: 15px;')) {
    throw new Error('Detected old broken contrast styles in email HTML');
  }

  const emailPath = path.join(outDir, 'test-email.html');
  fs.writeFileSync(emailPath, emailHtml, 'utf8');
  console.log(`Saved test Email HTML to: ${emailPath}`);

  console.log('--- ALL CHECKS PASSED SUCCESSFULLY ---');
}

run().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
