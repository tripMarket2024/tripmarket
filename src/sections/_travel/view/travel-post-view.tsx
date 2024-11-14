'use client';

import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { _tags, _mock, _categories, _travelPosts } from 'src/_mock';

import Markdown from 'src/components/markdown';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TravelNewsletter from '../travel-newsletter';
import TravelLatestPosts from '../../blog/travel/travel-latest-posts';

// ----------------------------------------------------------------------

export default function TravelPostView() {
  const { title, description, author, tags, content } = _travelPosts[0];

  return (
    <>
      <Container>
        <CustomBreadcrumbs
          sx={{ my: 3 }}
          links={[
            { name: 'Home', href: '/' },
            { name: 'Blog', href: paths.travel.posts },
            { name: title },
          ]}
        />
      </Container>

      <Divider sx={{ mb: { xs: 6, md: 10 } }} />

      <Container>
        <Grid container spacing={{ md: 8 }}>
          <Grid xs={12} md={8}>
            <Typography variant="h5" sx={{ mb: 5 }}>
              {description}
            </Typography>

            <Markdown content={content} firstLetter />

            <Divider sx={{ mt: 8 }} />
          </Grid>
        </Grid>
      </Container>

      <TravelLatestPosts posts={_travelPosts.slice(0, 4)} />

      <TravelNewsletter />
    </>
  );
}
