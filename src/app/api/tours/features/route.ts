import { NextRequest, NextResponse } from 'next/server';

import prisma from 'src/lib/prisma/prisma';

import { CreateTourFeatureDto } from './dto/create-tour-feature.dto';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const data = (await request.json()) as unknown as CreateTourFeatureDto;

    const foundedTourFeature = await prisma.tourFeatures.findFirst({
      where: {
        name_eng: data.name_eng,
        name_ka: data.name_ka,
      },
    });

    if (foundedTourFeature) {
      return NextResponse.json(
        {
          message: 'Tour feature already exists',
          success: false,
          status: 400,
        },
        {
          status: 400,
        }
      );
    }

    const newTourFeature = await prisma.tourFeatures.create({
      data: {
        name_eng: data.name_eng,
        name_ka: data.name_ka,
      },
    });

    return NextResponse.json(
      {
        message: 'Tour feature created succesfully',
        success: true,
        data: newTourFeature,
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

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const allFeatures = await prisma.tourFeatures.findMany();

    return NextResponse.json(
      {
        message: 'Tour features fetched succesfully',
        success: true,
        data: allFeatures,
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
