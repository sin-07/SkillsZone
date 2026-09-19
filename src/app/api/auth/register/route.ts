import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User, Family } from '@/models';
import { hashPassword, signAuthToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, password, phone, familyName, houseNumber, blockTower } = body;

    if (!name || !email || !password || !phone) {
      return NextResponse.json({ error: 'Name, email, password, and phone are required.' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    // Check or create Family
    let familyId;
    if (familyName && houseNumber && blockTower) {
      let family = await Family.findOne({
        houseNumber: houseNumber.trim(),
        blockTower: blockTower.trim(),
      });

      if (!family) {
        family = await Family.create({
          familyName: familyName.trim(),
          houseNumber: houseNumber.trim(),
          blockTower: blockTower.trim(),
          primaryContactName: name.trim(),
          primaryPhone: phone.trim(),
          primaryEmail: normalizedEmail,
        });
      }
      familyId = family._id;
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone.trim(),
      role: 'user',
      familyId,
    });

    const token = signAuthToken({
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      familyId: familyId?.toString(),
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        familyId,
      },
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: (error as Error).message || 'Failed to register account' }, { status: 500 });
  }
}
