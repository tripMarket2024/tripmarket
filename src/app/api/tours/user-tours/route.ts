import * as Yup from 'yup';
import { NextRequest, NextResponse } from 'next/server';

import prisma from 'src/lib/prisma/prisma';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const rowsPerPage = request.nextUrl.searchParams.get('rowsPerPage')!;
    const page = request.nextUrl.searchParams.get('page')!;
    const sortBy = request.nextUrl.searchParams.get('sortBy')!;
    const direction = request.nextUrl.searchParams.get('direction')!;
    const searchText = request.nextUrl.searchParams.get('searchText')!;

    return NextResponse.json(
      {
        message: 'Tour created succesfully',
        success: true,
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
