import * as Yup from 'yup';
import { NextRequest, NextResponse } from 'next/server';

import prisma from 'src/lib/prisma/prisma';

import { middleware } from '../middleware';
import { CreateAgentDto } from './dto/create-tour-agent.dto';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const CreateAgentSchema = Yup.object().shape({
      name: Yup.string().required('Name is required'),
      last_name: Yup.string().required('Last name is required'),
      description_ka: Yup.string().nullable(),
      description_eng: Yup.string().nullable(),
      address: Yup.string().nullable(),
      phone: Yup.string()
        .nullable()
        .matches(/^[0-9]+$/, 'Phone number is not valid'),
      email: Yup.string().nullable().email('Invalid email format'),
      website: Yup.string().nullable().url('Must be a valid URL'),
      facebook: Yup.string().nullable().url('Must be a valid URL'),
      telegram: Yup.string().nullable().url('Must be a valid URL'),
      instagram: Yup.string().nullable().url('Must be a valid URL'),
      youtube: Yup.string().nullable().url('Must be a valid URL'),
      twitter: Yup.string().nullable().url('Must be a valid URL'),
      linkedin: Yup.string().nullable().url('Must be a valid URL'),
      profile_picture: Yup.string().nullable(),
      profile_picture_url: Yup.string().nullable().url('Must be a valid URL'),
      travel_company_id: Yup.string().required('Travel company ID is required'),
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

    const data = (await request.json()) as unknown as CreateAgentDto;

    await CreateAgentSchema.validate(data, { abortEarly: false });

    const newAgent = await prisma.tourAgent.create({
      data: {
        ...data,
        travel_company_id: user.id,
      },
    });

    return NextResponse.json(
      {
        message: 'Agent created succesfully',
        success: true,
        data: newAgent,
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
