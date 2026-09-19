import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Event } from '@/models';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const sportType = searchParams.get('sportType');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};

    if (category && category !== 'All') {
      filter.category = category;
    }
    if (sportType && sportType !== 'All') {
      filter.sportType = sportType;
    }
    if (status && status !== 'All') {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sportType: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
      ];
    }

    const events = await Event.find(filter).sort({ scheduleDate: 1, scheduleTime: 1 });
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Fetch events error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();
    const {
      title,
      sportType,
      category,
      description,
      rules,
      minAge,
      maxAge,
      teamSize,
      maxParticipants,
      venue,
      scheduleDate,
      scheduleTime,
      status,
      bannerImage,
      iconName,
    } = body;

    if (!title || !sportType || !venue || !scheduleDate || !scheduleTime) {
      return NextResponse.json({ error: 'Title, sport type, venue, date and time are required' }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existingSlug = await Event.findOne({ slug });
    const finalSlug = existingSlug ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const event = await Event.create({
      title: title.trim(),
      slug: finalSlug,
      sportType,
      category: category || 'Individual',
      description: description || '',
      rules: Array.isArray(rules) ? rules : (rules ? rules.split('\n').filter(Boolean) : []),
      minAge: Number(minAge) || 5,
      maxAge: Number(maxAge) || 80,
      teamSize: Number(teamSize) || 1,
      maxParticipants: Number(maxParticipants) || 32,
      registeredCount: 0,
      venue: venue.trim(),
      scheduleDate,
      scheduleTime,
      status: status || 'open',
      bannerImage: bannerImage || '',
      iconName: iconName || 'Trophy',
    });

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json({ error: (error as Error).message || 'Failed to create event' }, { status: 500 });
  }
}
