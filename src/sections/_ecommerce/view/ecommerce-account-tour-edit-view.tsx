'use client';

import dayjs from 'dayjs';
import * as Yup from 'yup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios, { AxiosResponse } from 'axios';
import { Media, TourFeatures } from '@prisma/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import { ref, deleteObject, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { countries } from 'src/assets/data';
import { storage } from 'src/firebase/firebase';
import { StorageName } from 'src/enums/storage-enum';
import { useAuthContext } from 'src/contexts/auth-context';
import { useLanguage } from 'src/contexts/language-context';
import { EditTourDto } from 'src/app/api/tours/dto/edit-tour.dto';
import {
  CreateTourMedia,
} from 'src/app/api/tours/dto/create-tour.dto';

import FormProvider from 'src/components/hook-form';
import { SplashScreen } from 'src/components/loading-screen';

import FileUpload from 'src/sections/file-upload/file-upload';

import { ToursType } from 'src/types/tours-type';
import { ResponseInterface } from 'src/types/axios-respnse-type';

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

export default function EditTourView() {
  const { user } = useAuthContext();

  const [files, setFiles] = React.useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = React.useState<CreateTourMedia[]>([]);
  const [features, setFeatures] = useState<TourFeatures[]>([]);
  const loading = useBoolean(true);
  const [selectedTour, setTour] = useState<ToursType | null>(null);
  const [exsistingImages, setExsistingImages] = useState<Media[]>([]);

  const pageParams = useParams();

  const { id } = pageParams;

  const defaultValues = {
    start_date: dayjs(selectedTour?.start_date).toISOString(),
    end_date: dayjs(selectedTour?.end_date).toISOString(),
    country: selectedTour?.country || '',
    city: selectedTour?.city || '',
    description_ka: selectedTour?.description_ka || '',
    description_eng: selectedTour?.description_eng || '',
    name: selectedTour?.name || '',
    price: selectedTour?.price || 0,
    discount: selectedTour?.discount || null,
    images: '',
    selected_features: [],
  };

  const methods = useForm({
    resolver: yupResolver(EcommerceAccountPersonalSchema),
    defaultValues,
  });

  const router = useRouter();

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    control,
    watch,
    setValue,
  } = methods;

  const handleFetchTourById = useCallback(async () => {
    const data: AxiosResponse<ResponseInterface<ToursType>> = await axios.get(
      `/api/tours/user-tours/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );

    if (!data.data.success) {
      router.push('/');
    }

    setValue('start_date', dayjs(data.data.data.start_date).toISOString());
    setValue('end_date', dayjs(data.data.data.end_date).toISOString());
    setValue('country', data.data.data.country);
    setValue('city', data.data.data.city || '');
    setValue('description_ka', data.data.data.description_ka || '');
    setValue('description_eng', data.data.data.description_eng || '');
    setValue('name', data.data.data.name);
    setValue('price', data.data.data.price);
    setValue(
      'selected_features',
      data.data.data.tour_features.map((item) => ({
        id: item.tour_feature.id,
        created_date: new Date(),
        name_eng: item.tour_feature.name_eng,
        name_ka: item.tour_feature.name_ka,
      }))
    );
    setExsistingImages(data.data.data.media || []);
    setTour(data.data.data);
  }, [id, setValue, router]);

  useEffect(() => {
    handleFetchTourById();

    loading.onFalse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleFetchTourById]);

  const handleRemoveImageFromStorage = async (imageName: string): Promise<void> => {
    const photoRef = ref(storage, `${StorageName.TourImages}/${imageName}`);

    await deleteObject(photoRef);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      loading.setValue(true);
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

      const dataToStore: EditTourDto = {
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

      const imagesToRemove = [] as string[];

      selectedTour?.media.map((item) => {
        const foundMedia = exsistingImages.find((exsistMedia) => item.id === exsistMedia.id);
        if (!foundMedia) {
          imagesToRemove.push(item.id);
          return item;
        }
        return item;
      });

      dataToStore.media_to_delete = imagesToRemove;

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
                  (error) => reject(error),
                  async () => {
                    try {
                      const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                      resolve({
                        url: downloadUrl,
                        image_name: `${file.name}${uuid}`,
                        type: file.type,
                      });
                    } catch (error) {
                      reject(error);
                    }
                  }
                );
              } else {
                resolve(null);
              }
            })
        );

        const resolvedImages = (await Promise.all(uploadPromises)).filter(
          Boolean
        ) as CreateTourMedia[];

        dataToStore.media = resolvedImages;

        await axios.patch(`/api/tours/${selectedTour?.id}`, dataToStore, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        router.push(`${paths.travel.tour}/${selectedTour?.id}`);
        loading.setValue(false);
        return;
      }

      await axios.patch(`/api/tours/${selectedTour?.id}`, dataToStore, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      selectedTour?.media.forEach(async (item) => {
        const foundMedia = exsistingImages.find((exsistMedia) => item.id === exsistMedia.id);
        if (!foundMedia) {
          await handleRemoveImageFromStorage(item.image_name);
        }
      });

      loading.setValue(false);

      router.push(`${paths.travel.tour}/${selectedTour?.id}`);
    } catch (error) {
      console.error(error);
    }
  });

  const handleFetchFeatures = useCallback(async () => {
    const tours: AxiosResponse<ResponseInterface<TourFeatures[]>> =
      await axios.get('/api/tours/features');

    setFeatures(tours.data.data);
  }, []);

  useEffect(() => {
    handleFetchFeatures();
  }, [handleFetchFeatures]);

  const { renderLanguage } = useLanguage();

  if (loading.value || !selectedTour) {
    return <SplashScreen />;
  }

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Edit {selectedTour.name}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <FileUpload
          files={files}
          setFiles={setFiles}
          exsistingFiles={exsistingImages}
          setExsistingFiles={setExsistingImages}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
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
            defaultValue={selectedTour?.tour_features.map((item) => ({
              id: item.tour_feature.id,
              created_date: new Date(),
              name_eng: item.tour_feature.name_eng,
              name_ka: item.tour_feature.name_ka,
            }))}
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
