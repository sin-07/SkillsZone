import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Registration, Participant, Family } from '@/models';
import { getSessionUser } from '@/lib/auth';
import * as XLSX from 'xlsx';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const view = searchParams.get('view') || 'roster'; // 'roster' | 'registrations'

    if (view === 'roster') {
      // Export all athletes with their events and t-shirt sizes
      const registrations = await Registration.find({ status: { $ne: 'cancelled' } }).populate('familyId');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rows: any[] = [];
      for (const reg of registrations) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fam: any = reg.familyId;
        for (const entry of reg.entries) {
          const part = await Participant.findById(entry.participantId);
          rows.push({
            'Registration ID': reg.registrationId,
            'Athlete Name': entry.participantName,
            'Age': part?.age || '-',
            'Gender': part?.gender || '-',
            'Relation': part?.relation || '-',
            'T-Shirt Size': part?.tShirtSize || '-',
            'Sport / Event': entry.eventTitle,
            'Sport Type': entry.sportType,
            'Role / Notes': entry.sportSpecificInfo?.role || entry.sportSpecificInfo?.partnerName || entry.sportSpecificInfo?.bicycleOption || '-',
            'Family Name': fam?.familyName || '-',
            'Block / Tower': fam?.blockTower || '-',
            'House / Flat No': fam?.houseNumber || '-',
            'Contact Phone': reg.contactPhone,
            'Contact Email': reg.contactEmail,
            'Check-In Status': reg.checkIn?.isCheckedIn ? 'Checked In' : 'Pending',
            'Registered Date': new Date(reg.createdAt).toLocaleDateString('en-IN'),
          });
        }
      }

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="ColonyGames_Athlete_Roster_2026.csv"',
        },
      });
    } else {
      // Export registrations overview
      const registrations = await Registration.find().populate('familyId').sort({ createdAt: -1 });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rows = registrations.map((reg: any) => ({
        'Registration ID': reg.registrationId,
        'Primary Contact': reg.contactName,
        'Email': reg.contactEmail,
        'Phone': reg.contactPhone,
        'Family Name': reg.familyId?.familyName || '-',
        'Block / Tower': reg.familyId?.blockTower || '-',
        'House Number': reg.familyId?.houseNumber || '-',
        'Total Entries': reg.totalEntries,
        'Status': reg.status.toUpperCase(),
        'Checked In': reg.checkIn?.isCheckedIn ? 'Yes' : 'No',
        'Registered At': new Date(reg.createdAt).toLocaleString('en-IN'),
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="ColonyGames_Registrations_Summary_2026.csv"',
        },
      });
    }
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Failed to export CSV report' }, { status: 500 });
  }
}

// Formatted date and time outputs according to Indian Standard Time (IST)
