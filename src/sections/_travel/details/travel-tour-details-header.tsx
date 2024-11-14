import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { fShortenNumber } from 'src/utils/format-number';

import { _socials } from 'src/_mock';
import { useLanguage } from 'src/contexts/language-context';

import Iconify from 'src/components/iconify';

import { ITourProps } from 'src/types/tour';
import { TourType } from 'src/types/tour-type';
import { ToursType } from 'src/types/tours-type';

// ----------------------------------------------------------------------

type Props = {
  tour: ToursType;
};

export default function TravelTourDetailsHeader({ tour }: Props) {
  const { city, country, name } = tour;

  const [open, setOpen] = useState<HTMLElement | null>(null);

  const handleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(null);
  }, []);

  const { renderLanguage } = useLanguage();

  return (
    <>
      <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          mb: 3,
        }}
      >
        <Typography variant="h3" component="h1" sx={{ flexGrow: 1, pr: { md: 10 } }}>
          {renderLanguage(name, name)}
        </Typography>

        <Stack direction="row" alignItems="center" flexShrink={0}>
          <IconButton onClick={handleOpen} color={open ? 'primary' : 'default'}>
            <Iconify icon="carbon:share" />
          </IconButton>
        </Stack>
      </Stack>

      <Stack spacing={3} direction={{ xs: 'column', md: 'row' }}>
        <Stack spacing={0.5} direction="row" alignItems="center">
          <Iconify icon="carbon:star-filled" sx={{ color: 'warning.main' }} />
        </Stack>

        <Stack direction="row" alignItems="center" sx={{ typography: 'body2' }}>
          <Iconify icon="carbon:location" sx={{ mr: 0.5 }} />{' '}
          {renderLanguage(city || '', city || '')}
        </Stack>
      </Stack>

      <Popover
        open={!!open}
        onClose={handleClose}
        anchorEl={open}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        slotProps={{
          paper: {
            sx: { width: 220 },
          },
        }}
      >
        {_socials.map((social) => (
          <MenuItem key={social.value} onClick={handleClose}>
            <Iconify icon={social.icon} width={24} sx={{ mr: 1, color: social.color }} />
            Share via {social.label}
          </MenuItem>
        ))}
      </Popover>
    </>
  );
}
