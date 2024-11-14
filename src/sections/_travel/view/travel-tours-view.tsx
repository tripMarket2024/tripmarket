'use client';

import axios, { AxiosResponse } from 'axios';
import { useState, useEffect, useCallback } from 'react';

import Container from '@mui/material/Container';

import { useBoolean } from 'src/hooks/use-boolean';

import { ToursType } from 'src/types/tours-type';
import { ResponseInterface } from 'src/types/axios-respnse-type';

import TravelNewsletter from '../travel-newsletter';
import TravelFilters from '../filters/travel-filters';
import TravelTourList from '../list/travel-tour-list';

// ----------------------------------------------------------------------

export default function TravelToursView() {
  const loading = useBoolean(true);

  const [tours, setTours] = useState<ToursType[]>([]);

  const fetchTours = useCallback(async () => {
    try {
      const response: AxiosResponse<ResponseInterface<ToursType[]>> = await axios.get(
        '/api/tours?rowsPerPage=8&page=1&sortBy=created_date&direction=desc'
      );
      setTours(response.data.data);
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      loading.onFalse();
    }
  }, []);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  return (
    <>
      <Container>
        <TravelFilters
          sx={{
            mt: 5,
            mb: { xs: 5, md: 10 },
          }}
        />

        <TravelTourList tours={tours} loading={loading.value} />
      </Container>

      <TravelNewsletter />
    </>
  );
}
