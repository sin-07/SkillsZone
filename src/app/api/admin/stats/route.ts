import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Family, Participant, Event, Registration } from '@/models';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    await connectDB();

    const [
      totalFamilies,
      totalParticipants,
      totalRegistrations,
      confirmedRegistrations,
      cancelledRegistrations,
      checkedInCount,
      events,
      recentRegistrations,
    ] = await Promise.all([
      Family.countDocuments(),
      Participant.countDocuments(),
      Registration.countDocuments(),
      Registration.countDocuments({ status: 'confirmed' }),
      Registration.countDocuments({ status: 'cancelled' }),
      Registration.countDocuments({ 'checkIn.isCheckedIn': true }),
      Event.find().sort({ sportType: 1 }),
      Registration.find().populate('familyId').sort({ createdAt: -1 }).limit(8),
    ]);

    const checkInRate = totalRegistrations > 0 ? Math.round((checkedInCount / totalRegistrations) * 100) : 0;

    return NextResponse.json({
      metrics: {
        totalFamilies,
        totalParticipants,
        totalRegistrations,
        confirmedRegistrations,
        cancelledRegistrations,
        checkedInCount,
        checkInRate,
      },
      events,
      recentRegistrations,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
