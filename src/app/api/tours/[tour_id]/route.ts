import * as Yup from 'yup';
import { NextRequest, NextResponse } from 'next/server';

import prisma from 'src/lib/prisma/prisma';

import { middleware } from '../../middleware';
import { EditTourDto } from '../dto/edit-tour.dto';
import { start } from 'nprogress';

const checkIfExcists = (newProperty: any, oldProperty: any) => {
  if (newProperty) {
    return newProperty;
  }
  return oldProperty;
};

export async function PATCH(
  request: NextRequest,
  context: { params: { tour_id: string } }
): Promise<NextResponse> {
  try {
    const id = context.params.tour_id;

    console.log(context.params.tour_id, 'this is ID');

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

    const EditTourSchema = Yup.object().shape({
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

    const user = JSON.parse(request.headers.get('user') || '');

    const data = (await request.json()) as unknown as EditTourDto;

    await EditTourSchema.validate(data, { abortEarly: false });

    const {
      country,
      end_date,
      price,
      start_date,
      city,
      description_eng,
      description_ka,
      name,
      discount,
    } = data;

    const foundedTour = await prisma.tours.findFirst({
      where: {
        id,
        travel_company_id: user.id,
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

    const editedTour = await prisma.tours.update({
      where: {
        id: foundedTour.id,
      },
      data: {
        country: checkIfExcists(country, foundedTour.country),
        end_date: checkIfExcists(end_date, foundedTour.end_date),
        price: checkIfExcists(price, foundedTour.price),
        start_date: checkIfExcists(start_date, foundedTour.start_date),
        city: checkIfExcists(city, foundedTour.city),
        description_eng: checkIfExcists(description_eng, foundedTour.description_eng),
        description_ka: checkIfExcists(description_ka, foundedTour.description_ka),
        name: checkIfExcists(name, foundedTour.name),
        discount: checkIfExcists(discount, foundedTour.discount),
      },
    });

    return NextResponse.json(
      {
        message: 'Tour updated succesfully',
        success: true,
        data: editedTour,
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
