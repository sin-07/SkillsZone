import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User, Family, Participant, Registration, Notification } from '@/models';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.userId).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let family = null;
    let members: unknown[] = [];
    let registrations: unknown[] = [];

    if (user.familyId) {
      family = await Family.findById(user.familyId);
      members = await Participant.find({ familyId: user.familyId });
      registrations = await Registration.find({
        $or: [{ familyId: user.familyId }, { userId: user._id }],
      }).sort({ createdAt: -1 });
    } else {
      registrations = await Registration.find({ userId: user._id }).sort({ createdAt: -1 });
    }

    const notifications = await Notification.find({ userId: user._id }).sort({ createdAt: -1 }).limit(10);

    return NextResponse.json({
      user,
      family,
      members,
      registrations,
      notifications,
    });
  } catch (error) {
    console.error('User dashboard error:', error);
    return NextResponse.json({ error: 'Failed to load user dashboard' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.userId);
    if (!user || !user.familyId) {
      return NextResponse.json({ error: 'Please update your family details first' }, { status: 400 });
    }

    const body = await req.json();
    const { fullName, age, gender, relation, tShirtSize, emergencyContact, medicalNotes } = body;

    if (!fullName || !age || !gender) {
      return NextResponse.json({ error: 'Full name, age, and gender are required' }, { status: 400 });
    }

    const participant = await Participant.create({
      familyId: user.familyId,
      fullName: fullName.trim(),
      age: Number(age),
      gender,
      relation: relation || 'Other',
      tShirtSize: tShirtSize || 'M',
      emergencyContact: emergencyContact || '',
      medicalNotes: medicalNotes || '',
    });

    return NextResponse.json({ success: true, participant }, { status: 201 });
  } catch (error) {
    console.error('Add family member error:', error);
    return NextResponse.json({ error: (error as Error).message || 'Failed to add family member' }, { status: 500 });
  }
}
