import * as Yup from 'yup';
import { NextRequest, NextResponse } from 'next/server';

import prisma from 'src/lib/prisma/prisma';

import { RegisterCompanyDto } from './dto/register-company.dto';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      google_uid: Yup.string().required(),
    });

    const data = (await request.json()) as unknown as RegisterCompanyDto;

    await schema.validate(data, { abortEarly: false });

    const { name, email, google_uid } = data;

    const existingUser = await prisma.travelCompany.findFirst({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: 'User already exists',
          success: false,
          status: 409,
        },
        {
          status: 409,
        }
      );
    }

    const newCompany = await prisma.travelCompany.create({
      data: {
        name,
        email,
        google_uid,
      },
    });

    return NextResponse.json(
      {
        message: 'Company created succesfully',
        success: true,
        data: {
          user: newCompany,
        },
        status: 200,
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
