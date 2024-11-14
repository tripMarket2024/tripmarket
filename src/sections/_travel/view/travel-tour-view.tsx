'use client';

import { useParams } from 'next/navigation';
import axios, { AxiosResponse } from 'axios';
import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { _tours, _socials } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { SplashScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { ToursType } from 'src/types/tours-type';
import { ResponseInterface } from 'src/types/axios-respnse-type';

import TravelNewsletter from '../travel-newsletter';
import ReviewTravel from '../../review/travel/review-travel';
import TravelTourListSimilar from '../list/travel-tour-list-similar';
import TravelTourDetailsHeader from '../details/travel-tour-details-header';
import TravelTourDetailsSummary from '../details/travel-tour-details-summary';
import TravelTourDetailsGallery from '../details/travel-tour-details-gallery';
import TravelTourDetailsReserveForm from '../details/travel-tour-details-reserve-form';

// ----------------------------------------------------------------------

const _mockTour = _tours[0];

export default function TravelTourView() {
  const loading = useBoolean(true);
  const [tours, setTours] = useState<ToursType[]>([]);
  const [tour, setTour] = useState<ToursType | null>(null);

  const params = useParams();

  const { id } = params;

  console.log('router', params);

  const handleFetchTourById = useCallback(async () => {
    const data: AxiosResponse<ResponseInterface<ToursType>> = await axios.get(`/api/tours/${id}`);

    const response: AxiosResponse<ResponseInterface<ToursType[]>> = await axios.get(
      '/api/tours?rowsPerPage=8&page=1&sortBy=created_date&direction=desc'
    );
    setTours(response.data.data);

    setTour(data.data.data);
  }, [id]);

  useEffect(() => {
    handleFetchTourById();

    loading.onFalse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleFetchTourById]);

  if (loading.value) {
    return <SplashScreen />;
  }


  const tourPhotos =
    tour?.media && tour?.media.length > 0 ? tour.media.map((item) => item.url) : ['test'];

  return (
    <>
      <Container sx={{ overflow: 'hidden' }}>
        <CustomBreadcrumbs
          links={[
            { name: 'Home', href: '/' },
            { name: 'Tours', href: paths.travel.tours },
            { name: _mockTour.slug.title_eng },
          ]}
          sx={{ mt: 3, mb: 5 }}
        />

        <TravelTourDetailsGallery images={tourPhotos} />

        <Grid container columnSpacing={8} rowSpacing={5} direction="row-reverse">
          <Grid xs={12} md={5} lg={4}>
            <TravelTourDetailsReserveForm tour={_mockTour} />
          </Grid>

          <Grid xs={12} md={7} lg={8}>
            {tour && <TravelTourDetailsHeader tour={tour} />}

            <Divider sx={{ borderStyle: 'dashed', my: 5 }} />

            {tour && <TravelTourDetailsSummary tour={tour} />}

            <Stack direction="row" flexWrap="wrap" sx={{ mt: 5 }}>
              <Typography variant="subtitle2" sx={{ mt: 0.75, mr: 1.5 }}>
                Share:
              </Typography>

              <Stack direction="row" alignItems="center" flexWrap="wrap">
                {_socials.map((social) => (
                  <Button
                    key={social.value}
                    size="small"
                    variant="outlined"
                    startIcon={<Iconify icon={social.icon} />}
                    sx={{
                      m: 0.5,
                      flexShrink: 0,
                      color: social.color,
                      borderColor: social.color,
                      '&:hover': {
                        borderColor: social.color,
                        bgcolor: alpha(social.color, 0.08),
                      },
                    }}
                  >
                    {social.label}
                  </Button>
                ))}
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <Divider sx={{ my: 10 }} />

      <ReviewTravel />

      <TravelTourListSimilar tours={tours.slice(-4)} />

      <TravelNewsletter />
    </>
  );
}
