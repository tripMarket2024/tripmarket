import * as Yup from 'yup';
import { NextRequest, NextResponse } from 'next/server';

import prisma from 'src/lib/prisma/prisma';

const checkIfExcists = (newProperty: any, oldProperty: any) => {
  if (newProperty) {
    return newProperty;
  }
  return oldProperty;
};

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

    const foundedTour = await prisma.tours.findUnique({
      where: {
        id,
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
