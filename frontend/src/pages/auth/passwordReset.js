import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';

const Page = () => {
    const router = useRouter();
    const auth = useAuth();

    const formik = useFormik({
        initialValues: {
          email: '',
          name: '',
          password: '',
          submit: null
        },
        validationSchema: Yup.object({
          email: Yup
            .string()
            .email('Must be a valid email')
            .max(255)
            .required('Email is required')
        }),
        onSubmit: async (values, helpers) => {
          try {
            await auth.resetPassword(values.email);
            alert('Please check your inbox!')
            router.push('/auth/login')
          } catch (err) {
            helpers.setStatus({ success: false });
            helpers.setErrors({ submit: err.message });
            helpers.setSubmitting(false);
          }
        }
      });
  
    return (
      <>
        <Head>
          <title>
            Register 
          </title>
        </Head>
        <Box
            sx={{
            flex: '1 1 auto',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center'
            }}
        >
            <Box
            sx={{
                maxWidth: 550,
                px: 3,
                py: '100px',
                width: '100%'
            }}
            >
            <div>
                <Stack
                spacing={1}
                sx={{ mb: 2 }}
                >
                <Typography variant="h4">
                    Reset Password
                </Typography>
                <Typography
                    color="text.secondary"
                    variant="body2"
                >
                    Go back to
                    &nbsp;
                    <Link
                    component={NextLink}
                    href="/auth/login"
                    underline="hover"
                    variant="subtitle2"
                    >
                    Log in
                    </Link>
                </Typography>
                <Typography
                    color="text.secondary"
                    variant="body2"
                >
                    Enter your email and check inbox for password reset link 
                </Typography>
                </Stack>
                <form
                noValidate
                onSubmit={formik.handleSubmit}
                >
                <Stack spacing={3}>
                    <TextField
                    error={!!(formik.touched.email && formik.errors.email)}
                    fullWidth
                    helperText={formik.touched.email && formik.errors.email}
                    label="Email Address"
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="email"
                    value={formik.values.email}
                    />
                </Stack>
                {formik.errors.submit && (
                    <Typography
                    color="error"
                    sx={{ mt: 3 }}
                    variant="body2"
                    >
                    {formik.errors.submit}
                    </Typography>
                )}
                <Button
                    fullWidth
                    size="large"
                    sx={{ mt: 3 }}
                    type="submit"
                    variant="contained"
                >
                    Continue
                </Button>
                </form>
            </div>
            </Box>
        </Box>
      </>
    );
  };
  
  Page.getLayout = (page) => (
    <AuthLayout>
      {page}
    </AuthLayout>
  );
  
  export default Page;
  
