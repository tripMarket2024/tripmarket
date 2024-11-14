import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { useLanguage } from 'src/contexts/language-context';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';

import { ITourProps } from 'src/types/tour';
import { Media, Tours } from '@prisma/client';
import { title } from 'process';
import dayjs from 'dayjs';
import { ToursType } from 'src/types/tours-type';

// ----------------------------------------------------------------------

type Props = {
  tour: ToursType;
};

export default function TravelTourItem({ tour }: Props) {
  const {
    city,
    country,
    created_date,
    description_eng,
    description_ka,
    discount,
    end_date,
    features,
    id,
    name,
    price,
    start_date,
    travel_company_id,
    updated_date,
  } = tour;

  const [favorite, setFavorite] = useState(false);

  const handleChangeFavorite = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFavorite(event.target.checked);
  }, []);

  console.log('tour', tour);

  const { renderLanguage } = useLanguage();

  const tourPhoto = tour?.media?.length > 0 ? tour.media[0] : { url: '', type: '', image_name: '' };

  return (
    <Card>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          pt: 1.5,
          pl: 2,
          pr: 1.5,
          top: 0,
          width: 1,
          zIndex: 9,
          position: 'absolute',
        }}
      >
        <Stack
          spacing={0.5}
          direction="row"
          sx={{
            px: 1,
            borderRadius: 0.75,
            typography: 'subtitle2',
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          }}
        >
          {discount && discount > 0 && (
            <Box
              sx={{
                color: 'grey.500',
                textDecoration: 'line-through',
                mr: 0.5,
              }}
            >
              {fCurrency(discount)}
            </Box>
          )}
          {fCurrency(price)}
        </Stack>

        <Checkbox
          color="error"
          checked={favorite}
          onChange={handleChangeFavorite}
          icon={<Iconify icon="carbon:favorite" />}
          checkedIcon={<Iconify icon="carbon:favorite-filled" />}
          sx={{ color: 'common.white' }}
        />
      </Stack>

      <Image alt={tourPhoto.image_name} src={tourPhoto.url} ratio="1/1" />

      <Stack spacing={0.5} sx={{ p: 2.5 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {renderLanguage(city || '', city || '')}
        </Typography>

        <Link component={RouterLink} href={paths.travel.tour} color="inherit">
          <TextMaxLine variant="h6" persistent>
            {renderLanguage(name, name)}
          </TextMaxLine>
        </Link>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Stack direction="row" alignItems="center" sx={{ p: 2.5 }}>
        <Stack
          flexGrow={1}
          direction="row"
          alignItems="center"
          sx={{ typography: 'body2', color: 'text.disabled' }}
        >
          <Iconify icon="carbon:time" width={16} sx={{ mr: 1 }} />{' '}
          {dayjs(new Date(start_date)).format('MM/DD/YYYY')} -{' '}
          {dayjs(new Date(end_date)).format('MM/DD/YYYY')}
        </Stack>

        <Stack spacing={0.5} direction="row" alignItems="center">
          <Iconify icon="carbon:star-filled" sx={{ color: 'warning.main' }} />
          {/* <Box sx={{ typography: 'h6' }}>
            {Number.isInteger(ratingNumber) ? `${ratingNumber}.0` : ratingNumber}
          </Box> */}
        </Stack>
      </Stack>
    </Card>
  );
}
