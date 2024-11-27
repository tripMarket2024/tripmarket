'use client';

import axios, { AxiosResponse } from 'axios';
import { useState, useEffect, useCallback } from 'react';

import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';

import { SplashScreen } from 'src/components/loading-screen';

import TravelTourList from 'src/sections/_travel/list/travel-tour-list';

import { ToursType } from 'src/types/tours-type';
import { ResponseInterface } from 'src/types/axios-respnse-type';

// ----------------------------------------------------------------------

export default function EcommerceAccountWishlistView() {
  const loading = useBoolean(true);

  const [tours, setTours] = useState<ToursType[]>([]);

  const fetchTours = useCallback(async () => {
    try {
      const response: AxiosResponse<ResponseInterface<ToursType[]>> = await axios.get(
        '/api/tours/user-tours?rowsPerPage=8&page=1&sortBy=created_date&direction=desc',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      setTours(response.data.data);
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      loading.onFalse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  if (loading.value) {
    return <SplashScreen />;
  }
  return (
    <>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Tours
      </Typography>

      <TravelTourList tours={tours} loading={false} isAuth />
    </>
  );
}
