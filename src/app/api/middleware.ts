import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from 'src/lib/firebaseConfig';
import prisma from 'src/lib/prisma/prisma';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'your-secret-key';

export async function middleware(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);

    const user = await prisma.travelCompany.findFirst({
      where: {
        email: decodedToken.email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    req.headers.set('user', JSON.stringify(user));

    return NextResponse.next();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
  }
}
