import { NextRequest, NextResponse } from 'next/server';

import prisma from 'src/lib/prisma/prisma';

import { middleware } from '../../middleware';

export async function GET(req: NextRequest) {
  const response = await middleware(req as any);
  if (response instanceof NextResponse && !response.ok) {
    return NextResponse.json(
      {
        message: 'Unauthorized',
        success: false,
        status: 401,
      },
      {
        status: 401,
      }
    );
  }

  const user = JSON.parse(req.headers.get('user') || '');

  if (!user) {
    return NextResponse.json(
      {
        message: 'Unauthorized',
        success: false,
        status: 401,
      },
      {
        status: 401,
      }
    );
  }

  const foundedUser = await prisma.travelCompany.findFirst({
    where: { id: user.id },
    select: {
      address: true,
      email: true,
      facebook: true,
      id: true,
      instagram: true,
      linkedin: true,
      name: true,
      phone: true,
      profile_picture: true,
      profile_picture_url: true,
      twitter: true,
      description_eng: true,
      description_ka: true,
      created_date: true,
      telegram: true,
      website: true,
      youtube: true,
    },
  });

  return NextResponse.json(
    {
      message: 'User info',
      success: true,
      data: foundedUser,
      status: 200,
    },
    {
      status: 200,
    }
  );
}
