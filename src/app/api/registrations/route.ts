import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Family, Participant, Event, Registration, User } from '@/models';
import { generateQRCodeDataUrl } from '@/lib/qrcode';
import { generateRegistrationPDF } from '@/lib/pdf';
import { sendRegistrationConfirmationEmail } from '@/lib/email';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      contactName,
      contactEmail,
      contactPhone,
      familyName,
      houseNumber,
      blockTower,
      members, // Array<{ tempId: string, fullName: string, age: number, gender: string, relation: string, tShirtSize: string }>
      allocations, // Array<{ tempMemberId: string, eventId: string, role?: string, partnerName?: string, notes?: string, bicycleOption?: string }>
      notes,
    } = body;

    // 1. Basic field presence checks
    if (!contactName || !contactEmail || !contactPhone || !familyName || !houseNumber || !blockTower) {
      return NextResponse.json({ error: 'Please provide all required personal and house details.' }, { status: 400 });
    }

    if (!members || !Array.isArray(members) || members.length === 0) {
      return NextResponse.json({ error: 'At least one family member participant must be added.' }, { status: 400 });
    }

    if (!allocations || !Array.isArray(allocations) || allocations.length === 0) {
      return NextResponse.json({ error: 'Please enroll at least one participant into a sport or event.' }, { status: 400 });
    }

    const session = await getSessionUser();

    // 2. Find or create Family
    let family = await Family.findOne({
      houseNumber: houseNumber.trim(),
      blockTower: blockTower.trim(),
    });

    if (!family) {
      family = await Family.create({
        familyName: familyName.trim(),
        houseNumber: houseNumber.trim(),
        blockTower: blockTower.trim(),
        primaryContactName: contactName.trim(),
        primaryPhone: contactPhone.trim(),
        primaryEmail: contactEmail.toLowerCase().trim(),
      });
    }

    // 3. Create or map participants
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createdParticipantsMap: Record<string, any> = {};

    for (const member of members) {
      let participant = await Participant.findOne({
        familyId: family._id,
        fullName: member.fullName.trim(),
      });

      if (!participant) {
        participant = await Participant.create({
          familyId: family._id,
          fullName: member.fullName.trim(),
          age: Number(member.age),
          gender: member.gender,
          relation: member.relation || 'Self',
          tShirtSize: member.tShirtSize || 'M',
        });
      } else {
        // Update age/tshirt if needed
        participant.age = Number(member.age);
        participant.gender = member.gender;
        participant.tShirtSize = member.tShirtSize || participant.tShirtSize;
        await participant.save();
      }

      createdParticipantsMap[member.tempId || member.fullName] = participant;
    }

    // 4. Validate Events and Age criteria
    const eventIds = Array.from(new Set(allocations.map((a: { eventId: string }) => a.eventId)));
    const events = await Event.find({ _id: { $in: eventIds } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eventMap = new Map(events.map((e: any) => [e._id.toString(), e]));

    // Check duplicate participant per event
    const seenCombos = new Set<string>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const registrationEntries: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfEntries: any[] = [];

    for (const alloc of allocations) {
      const participant = createdParticipantsMap[alloc.tempMemberId];
      if (!participant) {
        return NextResponse.json({ error: `Participant was not found for allocation.` }, { status: 400 });
      }

      const event = eventMap.get(alloc.eventId);
      if (!event) {
        return NextResponse.json({ error: `Selected event not found.` }, { status: 400 });
      }

      if (event.status === 'closed') {
        return NextResponse.json({ error: `Registration for "${event.title}" is closed.` }, { status: 400 });
      }

      if (event.registeredCount >= event.maxParticipants) {
        return NextResponse.json({ error: `"${event.title}" is already at maximum capacity.` }, { status: 400 });
      }

      // Age bracket validation
      if (participant.age < event.minAge || participant.age > event.maxAge) {
        return NextResponse.json(
          {
            error: `${participant.fullName} (Age ${participant.age}) does not meet the age requirement (${event.minAge} - ${event.maxAge} years) for "${event.title}".`,
          },
          { status: 400 }
        );
      }

      const comboKey = `${participant._id.toString()}-${event._id.toString()}`;
      if (seenCombos.has(comboKey)) {
        return NextResponse.json(
          { error: `${participant.fullName} is already selected for "${event.title}". Duplicates are not allowed.` },
          { status: 400 }
        );
      }
      seenCombos.add(comboKey);

      registrationEntries.push({
        participantId: participant._id,
        participantName: participant.fullName,
        eventId: event._id,
        eventTitle: event.title,
        sportType: event.sportType,
        sportSpecificInfo: {
          role: alloc.role || '',
          partnerName: alloc.partnerName || '',
          bicycleOption: alloc.bicycleOption || '',
          notes: alloc.notes || '',
        },
      });

      pdfEntries.push({
        participantName: participant.fullName,
        age: participant.age,
        gender: participant.gender,
        tShirtSize: participant.tShirtSize,
        eventTitle: event.title,
        sportType: event.sportType,
        venue: event.venue,
        scheduleTime: `${event.scheduleDate} • ${event.scheduleTime}`,
        roleOrNotes: alloc.role || alloc.partnerName || alloc.bicycleOption || 'General',
      });
    }

    // 5. Generate Unique Registration ID
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const registrationId = `CG26-${randomHex}`;

    // 6. Generate QR Code
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verifyPassUrl = `${appUrl}/confirmation/${registrationId}`;
    const qrData = JSON.stringify({
      id: registrationId,
      family: `${familyName} (${blockTower}-${houseNumber})`,
      count: registrationEntries.length,
      url: verifyPassUrl,
    });
    const qrCodeDataUrl = await generateQRCodeDataUrl(qrData);

    // 7. Save Registration in DB
    const registration = await Registration.create({
      registrationId,
      userId: session?.userId ? session.userId : undefined,
      familyId: family._id,
      contactName: contactName.trim(),
      contactEmail: contactEmail.toLowerCase().trim(),
      contactPhone: contactPhone.trim(),
      entries: registrationEntries,
      status: 'confirmed',
      qrCodeDataUrl,
      checkIn: { isCheckedIn: false },
      totalEntries: registrationEntries.length,
      notes: notes || '',
    });

    // 8. Update registeredCount for each event
    for (const alloc of allocations) {
      await Event.findByIdAndUpdate(alloc.eventId, { $inc: { registeredCount: 1 } });
    }

    // 9. Generate PDF Pass
    let pdfBuffer: Buffer | undefined;
    try {
      pdfBuffer = generateRegistrationPDF({
        registrationId,
        contactName: contactName.trim(),
        contactEmail: contactEmail.toLowerCase().trim(),
        contactPhone: contactPhone.trim(),
        familyName: familyName.trim(),
        houseNumber: houseNumber.trim(),
        blockTower: blockTower.trim(),
        status: 'CONFIRMED',
        createdAt: new Date(),
        entries: pdfEntries,
        qrCodeDataUrl,
      });
    } catch (pdfErr) {
      console.error('PDF generation error:', pdfErr);
    }

    // 10. Send Email in Background
    sendRegistrationConfirmationEmail({
      to: contactEmail.toLowerCase().trim(),
      recipientName: contactName.trim(),
      registrationId,
      familyName: familyName.trim(),
      houseNumber: houseNumber.trim(),
      blockTower: blockTower.trim(),
      contactPhone: contactPhone.trim(),
      entriesCount: registrationEntries.length,
      entries: pdfEntries,
      pdfBuffer,
    }).catch((emailErr) => console.error('Email send err:', emailErr));

    return NextResponse.json({
      success: true,
      registrationId,
      registration,
      verifyPassUrl,
    });
  } catch (error) {
    console.error('Submit registration error:', error);
    return NextResponse.json({ error: (error as Error).message || 'Failed to submit registration' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const session = await getSessionUser();
    const { searchParams } = new URL(req.url);
    const familyId = searchParams.get('familyId');
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};

    if (!session || session.role !== 'admin') {
      // Non-admin can only view their own family registrations
      if (session?.familyId) {
        filter.familyId = session.familyId;
      } else if (session?.userId) {
        filter.userId = session.userId;
      } else {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    } else {
      // Admin filter options
      if (familyId) filter.familyId = familyId;
      if (status && status !== 'All') filter.status = status;
      if (search) {
        filter.$or = [
          { registrationId: { $regex: search, $options: 'i' } },
          { contactName: { $regex: search, $options: 'i' } },
          { contactEmail: { $regex: search, $options: 'i' } },
          { contactPhone: { $regex: search, $options: 'i' } },
          { 'entries.participantName': { $regex: search, $options: 'i' } },
        ];
      }
    }

    const registrations = await Registration.find(filter)
      .populate('familyId')
      .sort({ createdAt: -1 });

    return NextResponse.json({ registrations });
  } catch (error) {
    console.error('Fetch registrations error:', error);
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 });
  }
}
