import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Registration } from '@/models';
import { getSessionUser } from '@/lib/auth';

interface Context {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, context: Context) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Gatekeeper / Admin access required' }, { status: 403 });
    }

    await connectDB();
    const { id } = await context.params;

    let registration = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      registration = await Registration.findById(id).populate('familyId');
    } else {
      registration = await Registration.findOne({ registrationId: id.toUpperCase() }).populate('familyId');
    }

    if (!registration) {
      return NextResponse.json({ error: 'Invalid pass or registration not found' }, { status: 404 });
    }

    if (registration.status === 'cancelled') {
      return NextResponse.json({ error: 'This registration has been cancelled.' }, { status: 400 });
    }

    const wasAlreadyCheckedIn = registration.checkIn?.isCheckedIn;

    registration.checkIn = {
      isCheckedIn: true,
      checkedInAt: registration.checkIn?.checkedInAt || new Date(),
      checkedInBy: session.name || 'Admin',
    };

    await registration.save();

    return NextResponse.json({
      success: true,
      alreadyCheckedIn: wasAlreadyCheckedIn,
      message: wasAlreadyCheckedIn ? 'Athlete already checked-in previously' : 'Athlete check-in successful!',
      registration,
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json({ error: (error as Error).message || 'Failed to process check-in' }, { status: 500 });
  }
}
