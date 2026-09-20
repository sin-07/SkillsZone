import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Registration, Event, Participant } from '@/models';
import { generateRegistrationPDF } from '@/lib/pdf';
import { sendRegistrationConfirmationEmail } from '@/lib/email';

interface Context {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, context: Context) {
  try {
    await connectDB();
    const { id } = await context.params;

    let registration = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      registration = await Registration.findById(id).populate('familyId');
    } else {
      registration = await Registration.findOne({ registrationId: id.toUpperCase() }).populate('familyId');
    }

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const family: any = registration.familyId;

    // Fetch events and participants for rich email & PDF
    const eventIds = registration.entries.map((e: any) => e.eventId);
    const events = await Event.find({ _id: { $in: eventIds as any } });
    const eventMap = new Map(events.map((ev: any) => [ev._id.toString(), ev]));

    const participantIds = registration.entries.map((e: any) => e.participantId);
    const participants = await Participant.find({ _id: { $in: participantIds as any } });
    const partMap = new Map(participants.map((p: any) => [p._id.toString(), p]));

    const pdfEntries = registration.entries.map((entry: {
      participantId: unknown;
      eventId: unknown;
      participantName: string;
      eventTitle: string;
      sportType: string;
      sportSpecificInfo?: { role?: string; partnerName?: string; bicycleOption?: string; notes?: string };
    }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p: any = partMap.get(entry.participantId?.toString());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ev: any = eventMap.get(entry.eventId?.toString());

      const specific =
        entry.sportSpecificInfo?.role ||
        entry.sportSpecificInfo?.partnerName ||
        entry.sportSpecificInfo?.bicycleOption ||
        'Standard Entry';

      return {
        participantName: entry.participantName,
        age: p?.age,
        gender: p?.gender,
        tShirtSize: p?.tShirtSize,
        eventTitle: entry.eventTitle,
        sportType: entry.sportType,
        venue: ev?.venue || 'Society Sports Complex',
        scheduleTime: ev ? `${ev.scheduleDate} • ${ev.scheduleTime}` : 'Check Schedule',
        roleOrNotes: specific,
      };
    });

    // Generate PDF Pass
    let pdfBuffer: Buffer | undefined;
    try {
      pdfBuffer = generateRegistrationPDF({
        registrationId: registration.registrationId,
        contactName: registration.contactName,
        contactEmail: registration.contactEmail,
        contactPhone: registration.contactPhone,
        familyName: family?.familyName || registration.contactName,
        houseNumber: family?.houseNumber || '-',
        blockTower: family?.blockTower || '-',
        status: registration.status.toUpperCase(),
        createdAt: registration.createdAt,
        entries: pdfEntries,
        qrCodeDataUrl: registration.qrCodeDataUrl,
      });
    } catch (pdfErr) {
      console.error('PDF generation error while resending email:', pdfErr);
    }

    const emailSent = await sendRegistrationConfirmationEmail({
      to: registration.contactEmail.toLowerCase().trim(),
      recipientName: registration.contactName.trim(),
      registrationId: registration.registrationId,
      familyName: family?.familyName || registration.contactName,
      houseNumber: family?.houseNumber || '-',
      blockTower: family?.blockTower || '-',
      contactPhone: registration.contactPhone.trim(),
      entriesCount: registration.entries.length,
      entries: pdfEntries,
      pdfBuffer,
    });

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Email service could not dispatch confirmation email. Check SMTP settings.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Official confirmation email successfully sent to ${registration.contactEmail}`,
    });
  } catch (error) {
    console.error('Resend confirmation email error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to dispatch email' },
      { status: 500 }
    );
  }
}
