'use client';

import axios, { AxiosResponse } from 'axios';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';

import { _tours } from 'src/_mock';

import { ToursType } from 'src/types/tours-type';
import { ResponseInterface } from 'src/types/axios-respnse-type';

import TravelNewsletter from '../travel-newsletter';
import TravelFilters from '../filters/travel-filters';
import TravelLandingHero from '../landing/travel-landing-hero';
import TravelLandingSummary from '../landing/travel-landing-summary';
import TravelLandingTourFeatured from '../landing/travel-landing-tour-featured';

// ----------------------------------------------------------------------

export default function TravelLandingView() {

  const [tours, setTours] = useState<ToursType[]>([]);

  const fetchTours = useCallback(async () => {
    try {
      const response: AxiosResponse<ResponseInterface<ToursType[]>> = await axios.get(
        '/api/tours?rowsPerPage=8&page=1&sortBy=created_date&direction=desc'
      );
      setTours(response.data.data);
    } catch (error) {
      console.error('Error fetching tours:', error);
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <TravelLandingHero tours={tours.slice(0, 5)} />

        <Container
          sx={{
            mb: { md: 10 },
            left: { md: 0 },
            right: { md: 0 },
            bottom: { md: 0 },
            mx: { md: 'auto' },
            pt: { xs: 3, md: 0 },
            position: { md: 'absolute' },
          }}
        >
          <TravelFilters
            sx={{
              color: { md: 'common.white' },
              bgcolor: (theme) => ({
                xs: 'background.neutral',
                md: alpha(theme.palette.common.white, 0.08),
              }),
            }}
          />
        </Container>
      </Box>

      {/* <TravelLandingIntroduce /> */}

      <TravelLandingSummary />

      <TravelLandingTourFeatured tours={tours.slice(0, 4)} />

      {/* <TravelLandingFavoriteDestinations tours={_tours.slice(0, 4)} /> */}

      {/* <TravelLandingToursByCity tours={_tours.slice(0, 8)} />

      <BlogTravelLandingLatestPosts posts={_travelPosts.slice(2, 6)} />

      <TravelTestimonial testimonials={_testimonials} /> */}

      <TravelNewsletter />
    </>
  );
}
