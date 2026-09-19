import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  try {
    const result = await seedDatabase();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error seeding DB:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to seed database' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
