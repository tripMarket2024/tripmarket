import * as Yup from 'yup';
import { NextRequest, NextResponse } from 'next/server';

import prisma from 'src/lib/prisma/prisma';

import { middleware } from '../middleware';
import { CreateTourDto } from './dto/create-tour.dto';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const CreateTourSchema = Yup.object().shape({
      country: Yup.string().required('Country is required'),
      city: Yup.string().nullable(),
      start_date: Yup.date().required('Start date is required'),
      end_date: Yup.date().required('End date is required'),
      price: Yup.number().required('Price is required').positive('Price must be a positive number'),
      description_ka: Yup.string().nullable(),
      description_eng: Yup.string().nullable(),
      tour_features: Yup.array()
        .of(
          Yup.object().shape({
            id: Yup.string().required('Feature ID is required'),
            created_date: Yup.date().required('Feature created date is required'),
            name_ka: Yup.string().required('Feature name in Georgian is required'),
            name_eng: Yup.string().required('Feature name in English is required'),
          })
        )
        .nullable(),
      media: Yup.array()
        .of(
          Yup.object().shape({
            url: Yup.string().url('Must be a valid URL').required('Media URL is required'),
            type: Yup.string().required('Media type is required'),
            image_name: Yup.string().required('Image name is required'),
          })
        )
        .nullable(),
      tour_agent_id: Yup.string().nullable(),
      name: Yup.string().required('Name is required'),
      discount: Yup.number().nullable().min(0, 'Discount must be at least 0'),
    });

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

    const data = (await request.json()) as unknown as CreateTourDto;

    await CreateTourSchema.validate(data, { abortEarly: false });

    const {
      country,
      end_date,
      media,
      price,
      start_date,
      tour_agent_id,
      city,
      description_eng,
      description_ka,
      name,
      discount,
    } = data;

    const newTour = await prisma.tours.create({
      data: {
        country,
        end_date,
        name,
        price,
        start_date,
        city,
        description_eng,
        description_ka,
        discount,
        travel_company_id: user.id,
        features: 'none',
      },
    });

    if (data.tour_features) {
      await prisma.tourFeaturesTours.createMany({
        data: data.tour_features.map((feature) => ({
          tour_feature_id: feature.id,
          tour_id: newTour.id,
        })),
      });
    }

    if (tour_agent_id) {
      const foundedAgent = await prisma.tourAgent.findUnique({
        where: {
          id: tour_agent_id,
        },
      });

      if (!foundedAgent) {
        return NextResponse.json(
          {
            message: 'Tour agent not found',
            success: false,
            status: 404,
          },
          {
            status: 404,
          }
        );
      }

      await prisma.toursAgents.create({
        data: {
          tour_agent_id,
          tour_id: newTour.id,
        },
      });
    }

    if (media) {
      await prisma.media.createMany({
        data: media.map((m) => ({
          url: m.url,
          type: m.type,
          image_name: m.image_name,
          tour_id: newTour.id,
        })),
      });
    }

    const updatedTour = await prisma.tours.findUnique({
      where: {
        id: newTour.id,
      },
      include: {
        media: true,
        tours_agents: {
          include: {
            tour_agent: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Tour created succesfully',
        success: true,
        data: updatedTour,
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
    const rowsPerPage = request.nextUrl.searchParams.get('rowsPerPage')!;
    const page = request.nextUrl.searchParams.get('page')!;
    const sortBy = request.nextUrl.searchParams.get('sortBy')!;
    const direction = request.nextUrl.searchParams.get('direction')!;
    const searchText = request.nextUrl.searchParams.get('searchText')!;

    const allTours = await prisma.tours.findMany({
      take: Number(rowsPerPage),
      skip: (Number(page) - 1) * Number(rowsPerPage),
      orderBy: {
        [sortBy]: direction.toLowerCase() as 'asc' | 'desc',
      },
      include: {
        media: true,
      }
    });

    const count = await prisma.tours.count();

    return NextResponse.json(
      {
        message: 'Tours fetched succesfully',
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
