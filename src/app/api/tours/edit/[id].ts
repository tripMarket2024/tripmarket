import * as Yup from 'yup';
import { NextRequest, NextResponse } from 'next/server';

import prisma from 'src/lib/prisma/prisma';

import { middleware } from '../../middleware';
import { EditTourDto } from '../dto/edit-tour.dto';

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

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

    const UpdateTourSchema = Yup.object().shape({
      country: Yup.string().nullable(),
      city: Yup.string().nullable(),
      start_date: Yup.date().nullable(),
      end_date: Yup.date().nullable(),
      price: Yup.number().nullable().positive('Price must be a positive number'),
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
      name: Yup.string().nullable(),
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
    console.log(response, 'JJJJJJJJJJJJJJJJJJJ');

    const data = (await request.json()) as EditTourDto;
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
