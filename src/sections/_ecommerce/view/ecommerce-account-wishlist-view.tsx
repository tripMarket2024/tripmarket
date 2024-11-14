'use client';

import Typography from '@mui/material/Typography';

import { _tours } from 'src/_mock';

import TravelTourList from 'src/sections/_travel/list/travel-tour-list';

// ----------------------------------------------------------------------

export default function EcommerceAccountWishlistView() {
  return (
    <>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Tours
      </Typography>

      {/* <TravelTourList tours={_tours} loading={false} /> */}
    </>
  );
}
