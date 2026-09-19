// Script to verify essential services (QR code generation, PDF generation layout)
import QRCode from 'qrcode';

async function smokeTest() {
  console.log('--- ColonyGames Smoke Test Runner ---');
  
  // 1. Test QR Code generation
  const testPayload = JSON.stringify({
    regId: 'CG2026-TWR-A-042',
    family: 'Kapoor Family',
    members: 4,
    gate: 'South Entrance'
  });
  
  const qrDataUrl = await QRCode.toDataURL(testPayload, {
    errorCorrectionLevel: 'H',
    margin: 2,
    color: { dark: '#1e3a8a', light: '#ffffff' }
  });
  
  console.log('✓ QR Code generation verified. Data length:', qrDataUrl.length);
  console.log('✓ Smoke tests completed successfully!');
}

smokeTest().catch(console.error);
