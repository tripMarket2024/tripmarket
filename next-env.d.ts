/// <reference types="next" />
/// <reference types="next/image-types/global" />

import { JwtPayload } from 'jsonwebtoken'; // If using JWT with payloads

// Extend NextApiRequest to include a user property
declare module 'next' {
    import { NextRequest } from 'next/server';

  interface NextRequest {
    user?: string | JwtPayload;
    
  }
  
}

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
