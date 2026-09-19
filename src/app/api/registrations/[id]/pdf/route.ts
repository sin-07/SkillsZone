import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Registration, Family, Event, Participant } from '@/models';
import { generateRegistrationPDF } from '@/lib/pdf';

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: Context) {
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

    // Fetch full events and participants to populate pass
    const eventIds = registration.entries.map((e: any) => e.eventId);
    const events = await Event.find({ _id: { $in: eventIds as any } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eventMap = new Map(events.map((ev: any) => [ev._id.toString(), ev]));

    const participantIds = registration.entries.map((e: any) => e.participantId);
    const participants = await Participant.find({ _id: { $in: participantIds as any } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

      const specific = entry.sportSpecificInfo?.role ||
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

    const pdfBuffer = generateRegistrationPDF({
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

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ColonyGames_Pass_${registration.registrationId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Download PDF error:', error);
    return NextResponse.json({ error: 'Failed to generate pass PDF' }, { status: 500 });
  }
}
