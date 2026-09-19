import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Result, Family, Event } from '@/models';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (eventId) filter.eventId = eventId;

    const results = await Result.find(filter).sort({ publishedAt: -1 });

    // Calculate leaderboard / medal tally by family
    const familyLeaderboard = await Family.find()
      .sort({ points: -1, 'medals.gold': -1, 'medals.silver': -1, 'medals.bronze': -1 })
      .limit(20);

    // Calculate block / tower tally
    const towerPointsMap: Record<string, { points: number; gold: number; silver: number; bronze: number; families: number }> = {};
    const allFamilies = await Family.find();

    for (const fam of allFamilies) {
      const tower = fam.blockTower || 'Other';
      if (!towerPointsMap[tower]) {
        towerPointsMap[tower] = { points: 0, gold: 0, silver: 0, bronze: 0, families: 0 };
      }
      towerPointsMap[tower].points += fam.points || 0;
      towerPointsMap[tower].gold += fam.medals?.gold || 0;
      towerPointsMap[tower].silver += fam.medals?.silver || 0;
      towerPointsMap[tower].bronze += fam.medals?.bronze || 0;
      towerPointsMap[tower].families += 1;
    }

    const towerLeaderboard = Object.entries(towerPointsMap)
      .map(([tower, stats]) => ({ tower, ...stats }))
      .sort((a, b) => b.points - a.points || b.gold - a.gold);

    return NextResponse.json({
      results,
      familyLeaderboard,
      towerLeaderboard,
    });
  } catch (error) {
    console.error('Fetch results error:', error);
    return NextResponse.json({ error: 'Failed to fetch results and leaderboard' }, { status: 500 });
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
    const { eventId, category, winners, notes } = body;

    if (!eventId || !winners || !Array.isArray(winners) || winners.length === 0) {
      return NextResponse.json({ error: 'Event ID and at least one winner entry required' }, { status: 400 });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Process winners and assign points
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedWinners = winners.map((w: any) => {
      let points = 5;
      let medal: 'Gold' | 'Silver' | 'Bronze' = 'Bronze';
      if (w.rank === 1) {
        points = 10;
        medal = 'Gold';
      } else if (w.rank === 2) {
        points = 7;
        medal = 'Silver';
      }

      return {
        rank: w.rank,
        medal,
        participantId: w.participantId || undefined,
        participantName: w.participantName || 'Athlete',
        familyId: w.familyId || undefined,
        familyName: w.familyName || 'Independent',
        houseNumber: w.houseNumber || '',
        blockTower: w.blockTower || '',
        scoreOrTime: w.scoreOrTime || '-',
        pointsAwarded: points,
        notes: w.notes || '',
      };
    });

    const result = await Result.create({
      eventId: event._id,
      eventTitle: event.title,
      category: category || event.category,
      sportType: event.sportType,
      winners: formattedWinners,
      publishedAt: new Date(),
      notes: notes || '',
    });

    // Update family points and medals tally
    for (const w of formattedWinners) {
      if (w.familyId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const incUpdate: any = { points: w.pointsAwarded };
        if (w.medal === 'Gold') incUpdate['medals.gold'] = 1;
        if (w.medal === 'Silver') incUpdate['medals.silver'] = 1;
        if (w.medal === 'Bronze') incUpdate['medals.bronze'] = 1;

        await Family.findByIdAndUpdate(w.familyId, { $inc: incUpdate });
      }
    }

    // Mark event as completed if final results
    event.status = 'completed';
    await event.save();

    return NextResponse.json({ success: true, result }, { status: 201 });
  } catch (error) {
    console.error('Save results error:', error);
    return NextResponse.json({ error: (error as Error).message || 'Failed to record results' }, { status: 500 });
  }
}
