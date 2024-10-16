import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

import prisma from 'src/lib/prisma/prisma';

import { LogInCredentialsDto } from './dto/log-in.dto';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    const data = (await request.json()) as unknown as LogInCredentialsDto;

    await schema.validate(data, { abortEarly: false });

    const { email, password } = data;

    const existingUser = await prisma.travelCompany.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          message: 'Invalid Credentials',
          success: false,
          status: 403,
        },
        {
          status: 403,
        }
      );
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
        return NextResponse.json(
          {
            message: 'Invalid Credentials',
            success: false,
            status: 403,
          },
          {
            status: 403,
          }
        );
      }

    const token = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.NEXT_PUBLIC_JWT_SECRET || '',
      { expiresIn: '1h' }
    );

    return NextResponse.json(
      {
        message: 'Login success',
        success: true,
        data: {
          user: existingUser,
          token
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
