import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Announcement } from '@/models';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    const announcements = await Announcement.find().sort({ isPinned: -1, publishedAt: -1 });
    return NextResponse.json({ announcements });
  } catch (error) {
    console.error('Fetch announcements error:', error);
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
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
    const { title, content, priority, category, isPinned } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const announcement = await Announcement.create({
      title: title.trim(),
      content: content.trim(),
      priority: priority || 'normal',
      category: category || 'general',
      isPinned: Boolean(isPinned),
      publishedAt: new Date(),
    });

    return NextResponse.json({ success: true, announcement }, { status: 201 });
  } catch (error) {
    console.error('Create announcement error:', error);
    return NextResponse.json({ error: (error as Error).message || 'Failed to create announcement' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Announcement ID required' }, { status: 400 });
    }

    await Announcement.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    return NextResponse.json({ error: 'Failed to delete announcement' }, { status: 500 });
  }
}
