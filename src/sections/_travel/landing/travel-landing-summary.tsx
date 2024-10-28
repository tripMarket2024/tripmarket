import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { fShortenNumber } from 'src/utils/format-number';

import { useLanguage } from 'src/contexts/language-context';

import Image from 'src/components/image';
import CountUp from 'src/components/count-up';

// ----------------------------------------------------------------------

const SUMMARY = [
  {
    total: 130,
    description: 'Air tickets sold',
    descriptionGeo: 'აქტიური ტურისტული კომპანიები',
    icon: '/assets/icons/travel/ic_travel_tickets.svg',
  },
  {
    total: 196,
    description: 'Tours booked',
    descriptionGeo: 'აქტიური შეთავაზებები',
    icon: '/assets/icons/travel/ic_travel_booking.svg',
  },
  {
    total: 10670,
    description: 'Site visitors',
    descriptionGeo: 'გაყიდული ტურები',
    icon: '/assets/icons/travel/ic_travel_site_visitors.svg',
  },
  {
    total: 877,
    description: 'Verified hotels',
    descriptionGeo: 'ახალი მომხმარებლები',
    icon: '/assets/icons/travel/ic_travel_verified_hotels.svg',
  },
];

// ----------------------------------------------------------------------

export default function TravelLandingSummary() {
  const { renderLanguage } = useLanguage();

  return (
    <Container
      sx={{
        textAlign: 'center',
        py: { xs: 5, md: 10 },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          mx: 'auto',
          maxWidth: 480,
          mb: { xs: 8, md: 10 },
        }}
      >
        <Typography variant="h2">
          {' '}
          {renderLanguage('შენი შემდეგი თავგადასავალი იწყება აქ!', 'Your journey stars here!')}
        </Typography>

        <Typography sx={{ color: 'text.secondary' }}>
          {renderLanguage(
            'გამოიყენე შენი დრო საუკეთესო მომენტების შესაქმნელად!',
            'Use your time to create the best moments!'
          )}
        </Typography>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: { xs: 8, md: 3 },
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
        }}
      >
        {SUMMARY.map((value) => (
          <Stack key={value.description} spacing={1}>
            <Image
              alt={value.icon}
              src={value.icon}
              sx={{ mb: 3, width: 80, height: 80, mx: 'auto' }}
            />

            <Typography variant="h3">
              <CountUp
                start={value.total / 5}
                end={value.total}
                formattingFn={(newValue: number) => fShortenNumber(newValue)}
              />
            </Typography>

            <Typography sx={{ color: 'text.secondary' }}>
              {renderLanguage(value.descriptionGeo, value.description)}{' '}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Container>
  );
}
