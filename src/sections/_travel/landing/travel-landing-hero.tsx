import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Image from 'src/components/image';
import { useLanguage } from 'src/contexts/language-context';

export default function TravelLandingHero() {
  const { renderLanguage } = useLanguage();

  return (
    <Box sx={{ minHeight: { xs: '70vh', md: '100vh' }, position: 'relative' }}>
      <Image
        alt="hero"
        src="https://static.vecteezy.com/system/resources/previews/007/162/596/non_2x/beautiful-blue-mountain-landscape-with-sunrise-and-sunset-in-mountains-background-dark-night-time-outdoor-and-hiking-concept-sun-in-the-sky-good-for-wallpaper-site-banner-cover-poster-free-vector.jpg"
        sx={{
          width: '100%',
          height: { xs: '100%', md: '100vh' },
          objectFit: { xs: 'contain', md: 'cover' },
          position: 'absolute',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          px: 2,
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            color: 'white',
            px: 2,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '2rem', md: '3.5rem' },
            }}
          >
            {renderLanguage(
              'იპოვე შენი იდეალური ტური - ყველა შეთავაზება ერთ სივრცეში!',
              'Find your perfect tour - Every offer in one place!'
            )}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
