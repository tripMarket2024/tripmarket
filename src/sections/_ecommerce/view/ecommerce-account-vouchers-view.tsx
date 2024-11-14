'use client';

import dayjs from 'dayjs';
import * as Yup from 'yup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios, { AxiosResponse } from 'axios';
import { TourFeatures } from '@prisma/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import React, { useState, useEffect, useCallback } from 'react';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

import { countries } from 'src/assets/data';
import { StorageName } from 'src/enums/storage-enum';
import { useAuthContext } from 'src/contexts/auth-context';
import { useLanguage } from 'src/contexts/language-context';
import { CreateTourDto, CreateTourMedia } from 'src/app/api/tours/dto/create-tour.dto';

import FormProvider from 'src/components/hook-form';

import FileUpload from 'src/sections/file-upload/file-upload';

import { ResponseInterface } from 'src/types/axios-respnse-type';
import { storage } from 'src/firebase/firebase';
import { useRouter } from 'next/navigation';
import { paths } from 'src/routes/paths';
import { ToursType } from 'src/types/tours-type';

const EcommerceAccountPersonalSchema = Yup.object().shape({
  start_date: Yup.string().required('Start date is required'),
  end_date: Yup.string().required('End date is required'),
  country: Yup.string().required('Country is required'),
  city: Yup.string().required('City is required'),
  description_ka: Yup.string(),
  description_eng: Yup.string(),
  price: Yup.number().required('Price is required'),
  discount: Yup.number().nullable(),
  selected_features: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.string().required('Feature ID is required'),
        created_date: Yup.date().required('Feature created date is required'),
        name_ka: Yup.string().required('Feature name in Georgian is required'),
        name_eng: Yup.string().required('Feature name in English is required'),
      })
    )
    .nullable(),
  name: Yup.string().required('Name is required'),
  // images: Yup.string().nullable(), // Changed to single URL for simplicity
});

const defaultValues = {
  start_date: dayjs(new Date()).toISOString(),
  end_date: dayjs(new Date()).toISOString(),
  country: '',
  city: '',
  description_ka: '',
  description_eng: '',
  name: '',
  price: 0,
  discount: null,
  images: '',
  selected_features: [],
};

export default function EcommerceAccountPersonalView() {
  const methods = useForm({
    resolver: yupResolver(EcommerceAccountPersonalSchema),
    defaultValues,
  });

  const { user } = useAuthContext();

  const [files, setFiles] = React.useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = React.useState<CreateTourMedia[]>([]);
  const [features, setFeatures] = useState<TourFeatures[]>([]);

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    control,
    getValues,
    watch,
    setValue,
  } = methods;

  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('DATA TO SEND ON THE BACKEND:', data);

      const {
        city,
        country,
        end_date,
        price,
        start_date,
        description_eng,
        description_ka,
        discount,
        selected_features,
        name,
      } = data;

      const dataToStore: CreateTourDto = {
        country,
        end_date: new Date(end_date),
        start_date: new Date(start_date),
        name,
        price,
        city,
        description_eng,
        description_ka,
        discount,
        tour_features: selected_features?.map((tour) => ({
          id: tour.id,
          created_date: new Date(tour.created_date),
          name_eng: tour.name_eng,
          name_ka: tour.name_ka,
        })),
      };

      if (files.length) {
        const uploadPromises = files.map(
          (file) =>
            new Promise((resolve, reject) => {
              const storageName = StorageName.TourImages;
              const uuid = new Date().getTime().toString();

              if (file) {
                const imageRef = ref(storage, `${storageName}/${file.name}${uuid}`);
                const metadata = { contentType: file.type };
                const uploadTask = uploadBytesResumable(imageRef, file, metadata);

                uploadTask.on(
                  'state_changed',
                  (snapshot) => {
                    switch (snapshot.state) {
                      case 'paused':
                        console.log('Upload is paused');
                        break;
                      case 'running':
                        console.log('Upload is running');
                        break;
                      default:
                        break;
                    }
                  },
                  (error) => reject(error), // Reject the promise if there’s an error
                  async () => {
                    try {
                      const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                      resolve({
                        url: downloadUrl,
                        image_name: file.name,
                        type: file.type,
                      }); // Resolve the promise with the uploaded image details
                    } catch (error) {
                      reject(error);
                    }
                  }
                );
              } else {
                resolve(null); // Resolve with null if no file
              }
            })
        );

        const resolvedImages = (await Promise.all(uploadPromises)).filter(
          Boolean
        ) as CreateTourMedia[];

        dataToStore.media = resolvedImages as CreateTourMedia[];

        console.log('DATA TO STORE:', dataToStore, uploadedImages);

        const addedTour: AxiosResponse<ResponseInterface<ToursType>> = await axios.post(
          '/api/tours',
          dataToStore,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );

        reset();

        router.push(`${paths.travel.tour}/${addedTour.data.data.id}`);

        return;
      }

      const addedTour: AxiosResponse<ResponseInterface<ToursType>> = await axios.post(
        '/api/tours',
        dataToStore,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      reset();

      router.push(`${paths.travel.tour}/${addedTour.data.data.id}`);
    } catch (error) {
      console.error(error);
    }
  });

  const handleRemoveImage = (imageToRemove: CreateTourMedia) => {
    const filteredPhotos = uploadedImages.filter((photo) => photo.url !== imageToRemove.url);

    setUploadedImages(filteredPhotos);
  };

  const handleFetchFeatures = useCallback(async () => {
    const tours: AxiosResponse<ResponseInterface<TourFeatures[]>> =
      await axios.get('/api/tours/features');

    setFeatures(tours.data.data);
  }, []);

  useEffect(() => {
    handleFetchFeatures();
  }, [handleFetchFeatures]);

  const { renderLanguage } = useLanguage();

  console.log('Files:', files);

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
        {/* <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Country" fullWidth variant="outlined" margin="normal" />
          )}
        /> */}
        {/* <CountrySelect
          fullWidth
          hiddenLabel
          popupIcon={null}
          controller={control}
          placeholder="Select country"
          options={countries.map((option) => option.label)}
          getOptionLabel={(option) => option}
        /> */}
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Name" fullWidth variant="outlined" margin="normal" />
          )}
        />
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              options={countries.map((option) => option.label)} // Your country data
              getOptionLabel={(option) => option}
              isOptionEqualToValue={(option, value) => option === value}
              onChange={(_, data) => field.onChange(data)} // This ensures value is properly updated
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Country"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
              )}
            />
          )}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="City" fullWidth variant="outlined" margin="normal" />
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
          name="description_ka"
          control={control}
          render={({ field }) => (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Description Ka
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

      <Box sx={{ mb: 3 }}>
        <Controller
          name="description_eng"
          control={control}
          render={({ field }) => (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Description Eng
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
        <Grid item xs={12} sm={6}>
          <Autocomplete
            multiple
            id="tags-standard"
            options={features}
            getOptionLabel={(option) => renderLanguage(option.name_ka, option.name_eng)}
            // defaultValue={[top100Films[13]]}
            onChange={(_, data) => {
              setValue('selected_features', data);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Multiple values"
                placeholder="Favorites"
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
