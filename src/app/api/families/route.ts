import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Family, Participant, Registration } from '@/models';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const session = await getSessionUser();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const tower = searchParams.get('tower');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (tower && tower !== 'All') {
      filter.blockTower = tower;
    }
    if (search) {
      filter.$or = [
        { familyName: { $regex: search, $options: 'i' } },
        { houseNumber: { $regex: search, $options: 'i' } },
        { blockTower: { $regex: search, $options: 'i' } },
        { primaryContactName: { $regex: search, $options: 'i' } },
        { primaryPhone: { $regex: search, $options: 'i' } },
      ];
    }

    const families = await Family.find(filter).sort({ blockTower: 1, houseNumber: 1 });

    // If admin or user requesting members
    const familyData = await Promise.all(
      families.map(async (fam) => {
        const membersCount = await Participant.countDocuments({ familyId: fam._id });
        const regCount = await Registration.countDocuments({ familyId: fam._id });
        return {
          ...fam.toObject(),
          membersCount,
          regCount,
        };
      })
    );

    return NextResponse.json({ families: familyData });
  } catch (error) {
    console.error('Fetch families error:', error);
    return NextResponse.json({ error: 'Failed to fetch families' }, { status: 500 });
  }
}
