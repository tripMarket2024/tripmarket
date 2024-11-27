import { NextRequest, NextResponse } from 'next/server';

import prisma from 'src/lib/prisma/prisma';
import { middleware } from 'src/app/api/middleware';


export async function GET(
  request: NextRequest,
  context: { params: { tour_id: string } }
): Promise<NextResponse> {
  try {
    const id = context.params.tour_id;

    if (!id) {
      return NextResponse.json(
        {
          message: 'Tour ID is required',
          success: false,
          status: 400,
        },
        {
          status: 400,
        }
      );
    }

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

    const foundedTour = await prisma.tours.findFirst({
      where: {
        id,
        travel_company_id: user.id,
      },
      include: {
        media: true,
        travel_company: {
          select: {
            id: true,
            email: true,
            name: true,
            profile_picture: true,
            profile_picture_url: true,
            phone: true,
            facebook: true,
            instagram: true,
            linkedin: true,
            twitter: true,
            website: true,
          },
        },
        tour_features: {
          include: {
            tour_feature: {
              select: {
                name_ka: true,
                name_eng: true,
                id: true,
              },
            },
          },
        },
      },
    });

    if (!foundedTour) {
      return NextResponse.json(
        {
          message: 'Tour Not Found',
          success: false,
          status: 404,
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        message: 'Tour fetched succesfully',
        success: true,
        data: foundedTour,
      },
      {
        status: 200,
      }
    );
  } catch (e) {

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
