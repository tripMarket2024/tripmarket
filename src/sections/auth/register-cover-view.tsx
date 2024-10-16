'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useAuthContext } from 'src/contexts/auth-context';

// ----------------------------------------------------------------------

export default function RegisterCoverView() {
  const passwordShow = useBoolean();

  const RegisterSchema = Yup.object().shape({
    name: Yup.string()
      .required('Full name is required')
      .min(6, 'Mininum 6 characters'),
    email: Yup.string().required('Email is required').email('That is not an email'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password should be of minimum 6 characters length'),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password')], "Password's not match"),
  });

  const defaultValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const { register } = useAuthContext();

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await register({
        email: data.email,
        password: data.password,
        name: data.name,
      });
      reset();
      console.log('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const renderHead = (
    <Stack
      sx={{
        pb: 5,
        pt: { xs: 5, md: 10 },
        textAlign: { xs: 'center', md: 'left' },
      }}
    >
      <Typography variant="h3" paragraph>
        Get Started
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {`Already have an account? `}
        <Link component={RouterLink} href={paths.loginCover} variant="subtitle2" color="primary">
          Login
        </Link>
      </Typography>
    </Stack>
  );

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2.5}>
        <RHFTextField name="name" label="Company Name" />

        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={passwordShow.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={passwordShow.onToggle} edge="end">
                  <Iconify icon={passwordShow.value ? 'carbon:view' : 'carbon:view-off'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <RHFTextField
          name="confirmPassword"
          label="Confirm Password"
          type={passwordShow.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={passwordShow.onToggle} edge="end">
                  <Iconify icon={passwordShow.value ? 'carbon:view' : 'carbon:view-off'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Register
        </LoadingButton>

        <Typography variant="caption" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
          {`I agree to `}
          <Link color="text.primary" href="#" underline="always">
            Terms of Service
          </Link>
          {` and `}
          <Link color="text.primary" href="#" underline="always">
            Privacy Policy.
          </Link>
        </Typography>
      </Stack>
    </FormProvider>
  );

  return (
    <>
      <Logo />

      {renderHead}

      {renderForm}
    </>
  );
}
