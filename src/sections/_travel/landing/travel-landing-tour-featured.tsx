import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useLanguage } from 'src/contexts/language-context';

import { ToursType } from 'src/types/tours-type';

import TravelTourItem from '../list/travel-tour-item';

// ----------------------------------------------------------------------

type Props = {
  tours: ToursType[];
};

export default function TravelLandingTourFeatured({ tours }: Props) {

  const {renderLanguage} = useLanguage()
  

  return (
    <Container
      sx={{
        py: { xs: 5, md: 10 },
      }}
    >
      <Stack spacing={3} sx={{ textAlign: 'center' }}>
        <Typography variant="h3">{renderLanguage('თესლი ტურები', 'Featured Tours')}</Typography>

        <Typography sx={{ color: 'text.secondary' }}>
          {renderLanguage('ჩვენი დაფიჩერებული ტურები დაგეხმარებათ თქვენთვის საუკეთესო ტურის პოვნაშიიიიიი', `Our Featured Tours can help you find the trip that's perfect for you!`)}
        </Typography>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          my: { xs: 8, md: 10 },
          gap: { xs: 4, md: 3 },
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
        }}
      >
        {tours.map((tour) => (
          <TravelTourItem key={tour.id} tour={tour} />
        ))}
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Button
          component={RouterLink}
          href={paths.travel.tours}
          size="large"
          variant="outlined"
          color="inherit"
        >
          {renderLanguage('ყველა ტურის ნახვა', 'View All Tours')}
        </Button>
      </Box>
    </Container>
  );
}
