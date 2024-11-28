'use client';

import axios from 'axios';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { sendPasswordResetEmail, getAuth } from 'firebase/auth';

import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import { app } from 'src/firebase/firebase';
import { useAuthContext } from 'src/contexts/auth-context';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useState } from 'react';

export default function EcommerceAccountPersonalView() {
  const passwordShow = useBoolean();

  // Schema based on UpdateCompanyDto
  const UpdateCompanySchema = Yup.object().shape({
    name: Yup.string().required(),
    // description_ka: Yup.string().nullable(),
    // description_eng: Yup.string().nullable(),
    // address: Yup.string().nullable(),
    // phone: Yup.string()
    //   .nullable()
    //   .matches(/^[0-9]+$/, 'Phone number must contain only digits'),
    // password: Yup.string().nullable().min(8, 'Password must be at least 8 characters long'),
    // email: Yup.string().nullable().email('Must be a valid email address'),
    // website: Yup.string().nullable().url('Must be a valid URL'),
    // facebook: Yup.string().nullable().url('Must be a valid URL'),
    // telegram: Yup.string().nullable().url('Must be a valid URL'),
    // instagram: Yup.string().nullable().url('Must be a valid URL'),
    // youtube: Yup.string().nullable().url('Must be a valid URL'),
    // twitter: Yup.string().nullable().url('Must be a valid URL'),
    // linkedin: Yup.string().nullable().url('Must be a valid URL'),
  });

  const { user } = useAuthContext();

  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [message, setMessage] = useState('');

  const defaultValues = {
    name: user ? user?.name : '',
    email: user ? user?.email : '',
    phone: user ? user?.phone : '',
    address: user ? user?.address : '',
    website: user ? user?.website : '',
    facebook: user ? user?.facebook : '',
    telegram: user ? user?.telegram : '',
    instagram: user ? user?.instagram : '',
    youtube: user ? user?.youtube : '',
    twitter: user ? user?.twitter : '',
    linkedin: user ? user?.linkedin : '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateCompanySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await axios.patch(`/api/company`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      reset();
    } catch (error) {
      console.error(error);
    }
  });

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!user) return;
      setIsPasswordReset(true);
      await sendPasswordResetEmail(getAuth(app), user?.email);
      setMessage('Password reset email sent. Please check your email.');
      setIsPasswordReset(false);
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Update Company Information
      </Typography>

      <Box
        rowGap={2.5}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
      >
        <RHFTextField name="name" label="Company Name" />
        <RHFTextField name="email" label="Email Address" disabled/>
        <RHFTextField name="phone" label="Phone Number" />
        <RHFTextField name="address" label="Street Address" />
        <RHFTextField name="website" label="Website" />
        <RHFTextField name="facebook" label="Facebook" />
        <RHFTextField name="telegram" label="Telegram" />
        <RHFTextField name="instagram" label="Instagram" />
        <RHFTextField name="youtube" label="YouTube" />
        <RHFTextField name="twitter" label="Twitter" />
        <RHFTextField name="linkedin" label="LinkedIn" />
      </Box>

      <Stack spacing={3} sx={{ my: 5 }}>
        <Typography variant="h5"> Change Password </Typography>
        <LoadingButton onClick={handlePasswordReset} variant="contained" loading={isPasswordReset}>
          Change Password
        </LoadingButton>
        <Typography>
          {message}
        </Typography>
      </Stack>

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
