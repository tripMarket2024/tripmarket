import parser from 'html-react-parser';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { Language, useLanguage } from 'src/contexts/language-context';

import Iconify, { IconifyProps } from 'src/components/iconify';

import { ToursType } from 'src/types/tours-type';
import { features } from 'process';
import { Chip } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  tour: ToursType;
};

export default function TravelTourDetailsSummary({ tour }: Props) {
  const { description_ka, description_eng, travel_company } = tour;

  const { language, renderLanguage } = useLanguage();

  return (
    <Stack spacing={5}>
      <Box
        sx={{
          rowGap: 2.5,
          columnGap: 3,
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          },
        }}
      >
        <OverviewItem icon="carbon:user" label="Contact name" text={travel_company?.name} />
        <OverviewItem
          icon="carbon:mobile"
          label="Contact phone"
          text={travel_company?.phone || 'ტელეფონის ნომერი არ არის მითითებული'}
        />
      </Box>

      <Stack spacing={2}>
        <Typography variant="h5">Tour Description</Typography>
        <Typography>
          {parser(language === Language.KA ? description_ka || '' : description_eng || '')}
        </Typography>
      </Stack>

      <Stack spacing={2}>
        <Typography variant="h5">Tour Highlights</Typography>
      </Stack>
      <Box sx={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        {tour.tour_features.map((feature) => (
          <Chip
            label={renderLanguage(feature.tour_feature.name_ka, feature.tour_feature.name_eng)}
          />
        ))}
      </Box>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type OverviewItemProp = {
  text: string;
  label: string;
  icon: IconifyProps;
};

function OverviewItem({ icon, label, text = '-' }: OverviewItemProp) {
  return (
    <Stack spacing={1.5} direction="row" alignItems="flex-start">
      <Iconify icon={icon} width={24} />
      <Stack spacing={0.5}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {label}
        </Typography>
        <Typography>{text}</Typography>
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type HighlightItemProps = {
  label: string;
  text: string;
};

function HighlightItem({ label, text }: HighlightItemProps) {
  return (
    <Stack spacing={1}>
      <Typography
        variant="subtitle1"
        sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}
      >
        <Box
          component="span"
          sx={{
            width: 12,
            height: 2,
            borderRadius: 1,
            bgcolor: 'currentColor',
            mr: 1.5,
          }}
        />
        {label}
      </Typography>
      <Typography>{text}</Typography>
    </Stack>
  );
}
