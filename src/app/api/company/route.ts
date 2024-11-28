import * as Yup from 'yup';
import { NextRequest, NextResponse } from 'next/server';

import prisma from 'src/lib/prisma/prisma';

import { middleware } from '../middleware';
import { UpdateCompanyDto } from './[company-id]/dto/update-company.dto';

const checkIfExcists = (newProperty: any, oldProperty: any) => {
  if (newProperty) {
    return newProperty;
  }
  return oldProperty;
};

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const UpdateCompanySchema = Yup.object().shape({
      name: Yup.string().nullable(),
      description_ka: Yup.string().nullable(),
      description_eng: Yup.string().nullable(),
      address: Yup.string().nullable(),
      phone: Yup.string()
        .nullable()
        .matches(/^[0-9]+$/, 'Phone number must contain only digits'),
      password: Yup.string().nullable().min(8, 'Password must be at least 8 characters long'),
      email: Yup.string().nullable().email('Must be a valid email address'),
      website: Yup.string().nullable().url('Must be a valid URL'),
      facebook: Yup.string().nullable().url('Must be a valid URL'),
      telegram: Yup.string().nullable().url('Must be a valid URL'),
      instagram: Yup.string().nullable().url('Must be a valid URL'),
      youtube: Yup.string().nullable().url('Must be a valid URL'),
      twitter: Yup.string().nullable().url('Must be a valid URL'),
      linkedin: Yup.string().nullable().url('Must be a valid URL'),
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

    const foundedCompany = await prisma.travelCompany.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!foundedCompany) {
      return NextResponse.json(
        {
          message: 'Company Not Found',
          success: false,
          status: 404,
        },
        {
          status: 404,
        }
      );
    }

    const data = (await request.json()) as unknown as UpdateCompanyDto;

    await UpdateCompanySchema.validate(data, { abortEarly: false });

    const updatedAgency = await prisma.travelCompany.update({
      where: {
        id: user.id,
      },
      data: {
        name: checkIfExcists(data.name, foundedCompany.name),
        description_ka: checkIfExcists(data.description_ka, foundedCompany.description_ka),
        description_eng: checkIfExcists(data.description_eng, foundedCompany.description_eng),
        address: checkIfExcists(data.address, foundedCompany.address),
        phone: checkIfExcists(data.phone, foundedCompany.phone),
        email: checkIfExcists(data.email, foundedCompany.email),
        website: checkIfExcists(data.website, foundedCompany.website),
        facebook: checkIfExcists(data.facebook, foundedCompany.facebook),
        telegram: checkIfExcists(data.telegram, foundedCompany.telegram),
        instagram: checkIfExcists(data.instagram, foundedCompany.instagram),
        youtube: checkIfExcists(data.youtube, foundedCompany.youtube),
        twitter: checkIfExcists(data.twitter, foundedCompany.twitter),
        linkedin: checkIfExcists(data.linkedin, foundedCompany.linkedin),
        profile_picture: checkIfExcists(data.profile_picture, foundedCompany.profile_picture),
        profile_picture_url: checkIfExcists(
          data.profile_picture_url,
          foundedCompany.profile_picture_url
        ),
      },
    });

    return NextResponse.json(
      {
        message: 'Company updated succesfully',
        success: true,
        data: updatedAgency,
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
