import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Registration, Event, Family } from '@/models';
import { getSessionUser } from '@/lib/auth';

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: Context) {
  try {
    await connectDB();
    const { id } = await context.params;

    // Search by registrationId or MongoDB _id
    let registration = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      registration = await Registration.findById(id).populate('familyId');
    } else {
      registration = await Registration.findOne({ registrationId: id.toUpperCase() }).populate('familyId');
    }

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    return NextResponse.json({ registration });
  } catch (error) {
    console.error('Fetch registration error:', error);
    return NextResponse.json({ error: 'Failed to fetch registration pass' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: Context) {
  try {
    await connectDB();
    const session = await getSessionUser();
    const { id } = await context.params;
    const body = await req.json();
    const { status, notes } = body;

    let registration = await Registration.findOne({
      $or: [{ registrationId: id.toUpperCase() }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    // Check permissions: Admin can do anything, User can only cancel their own registration
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const isOwner =
      session.userId === registration.userId?.toString() ||
      session.familyId === registration.familyId?.toString();

    if (!isOwner && session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized to modify this registration' }, { status: 403 });
    }

    // If cancelling, decrement event counts
    if (status === 'cancelled' && registration.status !== 'cancelled') {
      for (const entry of registration.entries) {
        await Event.findByIdAndUpdate(entry.eventId, { $inc: { registeredCount: -1 } });
      }
      registration.status = 'cancelled';
    } else if (status && session.role === 'admin') {
      registration.status = status;
    }

    if (notes !== undefined) {
      registration.notes = notes;
    }

    await registration.save();
    return NextResponse.json({ success: true, registration });
  } catch (error) {
    console.error('Update registration error:', error);
    return NextResponse.json({ error: (error as Error).message || 'Failed to update registration' }, { status: 500 });
  }
}
