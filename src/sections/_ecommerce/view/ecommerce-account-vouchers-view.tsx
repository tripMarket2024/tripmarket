'use client';

import dayjs from 'dayjs';
import * as Yup from 'yup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

import FormProvider from 'src/components/hook-form';
import FileUpload from 'src/sections/file-upload/file-upload';
import React from 'react';
import { CreateTourMedia } from 'src/app/api/tours/dto/create-tour.dto';

const EcommerceAccountPersonalSchema = Yup.object().shape({
  start_date: Yup.string().required('Start date is required'),
  end_date: Yup.string().required('End date is required'),
  location: Yup.string().required('Location is required'),
  description: Yup.string().required('Description is required'),
  price: Yup.number().required('Price is required'),
  discount: Yup.number().nullable(),
  images: Yup.string().nullable(), // Changed to single URL for simplicity
});

const defaultValues = {
  start_date: dayjs(new Date()).toISOString(),
  end_date: dayjs(new Date()).toISOString(),
  location: '',
  description: '',
  price: 0,
  discount: null,
  images: '',
};

export default function EcommerceAccountPersonalView() {
  const methods = useForm({
    resolver: yupResolver(EcommerceAccountPersonalSchema),
    defaultValues,
  });

  const [files, setFiles] = React.useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = React.useState<CreateTourMedia[]>([]);

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('DATA:', data);
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
    } catch (error) {
      console.error(error);
    }
  });

  const handleRemoveImage = (imageToRemove: CreateTourMedia) => {
    const filteredPhotos = uploadedImages.filter((photo) => photo.url !== imageToRemove.url);

    setUploadedImages(filteredPhotos);
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Add Tour
      </Typography>

      <Box sx={{ mb: 3 }}>
        {/* <Controller
          name="images"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Image URL" fullWidth variant="outlined" margin="normal" />
          )}
        /> */}
        <FileUpload files={files} setFiles={setFiles} />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Location" fullWidth variant="outlined" margin="normal" />
          )}
        />
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="start_date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Start Date"
                  sx={{ width: '100%' }}
                  onChange={(date) => field.onChange(date)}
                  value={dayjs(field.value) || null}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="end_date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  sx={{ width: '100%' }}
                  label="End Date"
                  onChange={(date) => field.onChange(date)}
                  value={dayjs(field.value) || null}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3 }}>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Description
              </Typography>
              <ReactQuill
                {...field}
                theme="snow"
                onChange={field.onChange}
                value={field.value || ''}
                modules={QuillModules}
                formats={QuillFormats}
              />
            </Box>
          )}
        />
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Price"
                type="number"
                fullWidth
                variant="outlined"
                margin="normal"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="discount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Discount"
                type="number"
                fullWidth
                variant="outlined"
                margin="normal"
              />
            )}
          />
        </Grid>
      </Grid>

      <LoadingButton
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Save Changes
      </LoadingButton>
    </FormProvider>
  );
}

const QuillModules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['bold', 'italic', 'underline'],
    [{ align: [] }],
    ['link'],
    ['clean'],
  ],
};

const QuillFormats = [
  'header',
  'font',
  'list',
  'bullet',
  'bold',
  'italic',
  'underline',
  'align',
  'link',
];
