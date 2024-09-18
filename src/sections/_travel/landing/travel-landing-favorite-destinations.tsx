import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useResponsive } from 'src/hooks/use-responsive';

import { useLanguage } from 'src/contexts/language-context';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';

import { ITourProps } from 'src/types/tour';

// ----------------------------------------------------------------------

const ROWS = [
  {
    rowText: 'First Class Flights',
    rowTextGeo: 'პირველი კლასის ფრენები'
  },
  {
    rowText: '5 Star Accommodations',
    rowTextGeo: '5 ვარსკვლავიანი თესლობბები'
  },
  {
    rowText: 'Latest Model Vehicles',
    rowTextGeo: 'ბოლო დონის ტრანსპორტი'
  },
  {
    rowText: 'Handpicked Hotels',
    rowTextGeo: 'კაი კაი სასტუმროები'
  },
  {
    rowText: 'Accesibility managment',
    rowTextGeo: 'კარგად ნარჩევი ბოზები'
  },
  {
    rowText: 'First Class Flights',
    rowTextGeo: 'კიდე რამე'
  },
];

// ----------------------------------------------------------------------

type Props = {
  tours: ITourProps[];
};

export default function TravelLandingFavoriteDestinations({ tours }: Props) {

  const {renderLanguage} = useLanguage()

  return (
    <Container
      sx={{
        py: { xs: 5, md: 10 },
      }}
    >
      <Grid
        container
        rowSpacing={{ xs: 8, md: 0 }}
        columnSpacing={{ xs: 0, md: 3 }}
        alignItems={{ md: 'center' }}
        justifyContent={{ md: 'space-between' }}
      >
        <Grid xs={12} md={4}>
          <Typography variant="h2">{renderLanguage('ჩვენი საყვარელი ადგილები!', 'Our Favorite destinations')}</Typography>

          <Typography sx={{ my: 3, color: 'text.secondary' }}>
            {renderLanguage('რაამმე გრძელი აღწერის ტექსტი, სამუშაო გაქვს საბიკ', 'Since wire-frame renderings are relatively simple and fast to calculate, they are often')}
          </Typography>

          <Stack spacing={2}>
            {ROWS.map((row) => (
              <Stack key={row.rowText} direction="row" alignItems="center" sx={{ typography: 'body1' }}>
                <Box
                  sx={{
                    mr: 2,
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                  }}
                />
                {renderLanguage(row.rowTextGeo, row.rowText)}
              </Stack>
            ))}
          </Stack>
        </Grid>

        <Grid container xs={12} md={6} spacing={{ xs: 4, md: 3 }}>
          {tours.map((tour, index) => (
            <Grid
              key={tour.id}
              xs={12}
              sm={6}
              sx={{
                ...(index === 1 && {
                  display: { md: 'inline-flex' },
                  alignItems: { md: 'flex-end' },
                }),
              }}
            >
              <DestinationItem tour={tour} order={index % 3} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
}

// ----------------------------------------------------------------------

type DestinationItemProps = {
  tour: ITourProps;
  order: number;
};

function DestinationItem({ tour, order }: DestinationItemProps) {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const { location, continent, coverUrl } = tour;

  const {renderLanguage} = useLanguage()

  return (
    <Box
      sx={{
        width: 1,
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Image
        alt={location.label}
        src={coverUrl}
        ratio={(!mdUp && '1/1') || (order && '1/1') || '4/6'}
        overlay={`linear-gradient(to bottom, ${alpha(theme.palette.common.black, 0)} 0%, ${
          theme.palette.common.black
        } 75%)`}
      />

      <Stack
        spacing={1}
        sx={{
          p: 3,
          left: 0,
          bottom: 0,
          zIndex: 9,
          color: 'common.white',
          position: 'absolute',
        }}
      >
        <TextMaxLine variant="h5" line={1}>
          {renderLanguage(location.label_ka, location.label)}
        </TextMaxLine>

        <Stack direction="row" alignItems="center">
          <Iconify icon="carbon:location" sx={{ mr: 1, color: 'primary.main' }} />
          <TextMaxLine variant="body2" line={1} sx={{ opacity: 0.72 }}>
            {renderLanguage(continent.label_ka, continent.label)}
          </TextMaxLine>
        </Stack>
      </Stack>
    </Box>
  );
}
