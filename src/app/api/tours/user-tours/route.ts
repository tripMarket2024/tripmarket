import { NextRequest, NextResponse } from 'next/server';

import prisma from 'src/lib/prisma/prisma';

import { middleware } from '../../middleware';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const rowsPerPage = request.nextUrl.searchParams.get('rowsPerPage')!;
    const page = request.nextUrl.searchParams.get('page')!;
    const sortBy = request.nextUrl.searchParams.get('sortBy')!;
    const direction = request.nextUrl.searchParams.get('direction')!;
    const searchText = request.nextUrl.searchParams.get('searchText')!;

    const response = await middleware(request as any);
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

    const user = JSON.parse(request.headers.get('user') || '');

    const allTours = await prisma.tours.findMany({
      where: {
        travel_company_id: user.id,
      },
      take: Number(rowsPerPage),
      skip: (Number(page) - 1) * Number(rowsPerPage),
      orderBy: {
        [sortBy]: direction.toLowerCase() as 'asc' | 'desc',
      },
      include: {
        media: true,
      },
    });

    const count = await prisma.tours.count({
      where: {
        travel_company_id: user.id,
      },
    });

    return NextResponse.json(
      {
        message: 'Tour created succesfully',
        success: true,
        data: allTours,
        count,
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    if (e.errors) {
      return NextResponse.json(
        {
          message: e.errors.join(', '),
          success: false,
          status: 400,
        },
        {
          status: 400,
        }
      );
    }
    return NextResponse.json(
      {
        message: 'Internal server error',
        success: false,
        status: 500,
      },
      {
        status: 500,
      }
    );
  }
}
