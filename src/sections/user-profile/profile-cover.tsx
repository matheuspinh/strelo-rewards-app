import * as Yup from 'yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { usePathname } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ListItemText from '@mui/material/ListItemText';
import { alpha, useTheme } from '@mui/material/styles';

import { useUser } from 'src/hooks/use-user-detail';
import { useUsersContext } from 'src/hooks/use-users-context';

import { bgGradient } from 'src/theme/css';

import FormProvider from 'src/components/hook-form/form-provider';
import { RHFUploadAvatar } from 'src/components/hook-form/rhf-upload';

// ----------------------------------------------------------------------

export default function ProfileCover({ name, role, coverUrl }: any) {
  const theme = useTheme();
  const pathname = usePathname()
  const user = pathname.split('/').filter(Boolean).pop()

  const userFormSchema = Yup.object().shape({
    image: Yup.mixed().nullable(),
  })

  const { data: userData, isLoading } = useUser(user!);
  const { updateUser } = useUsersContext();

  const methods = useForm({
    resolver: yupResolver(userFormSchema)
  })

  const { setValue, handleSubmit, reset, setError } = methods;

  if(!isLoading && userData){
    setValue('image', userData.avatarUrl)
  }

  const onSubmit = handleSubmit(async(data)=> {
    try {
      const formData = new FormData()
      if(data.image && data.image instanceof File){
        formData.append('image', data.image)
      }
      await updateUser(({id: user!, formData: data}))
    } catch (error) {
      console.error(error)
    }
  })

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('image', newFile, { shouldValidate: true });
        onSubmit()
      }
    },
    [setValue, onSubmit]
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.primary.darker, 0.8),
          imgUrl: coverUrl,
        }),
        height: 1,
        color: 'common.white',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          left: { md: 24 },
          bottom: { md: 24 },
          zIndex: { md: 10 },
          pt: { xs: 6, md: 0 },
          position: { md: 'absolute' },
        }}
      >
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <RHFUploadAvatar
            onDrop={handleDrop}
            name='image'
            sx={{
              mx: 'auto',
              width: { xs: 64, md: 128 },
              height: { xs: 64, md: 128 },
              border: `solid 2px ${theme.palette.common.white}`,
            }}
          />
        </FormProvider>


        <ListItemText
          sx={{
            mt: 3,
            ml: { md: 3 },
            textAlign: { xs: 'center', md: 'unset' },
          }}
          primary={name}
          secondary={role}
          primaryTypographyProps={{
            typography: 'h4',
          }}
          secondaryTypographyProps={{
            mt: 0.5,
            color: 'inherit',
            component: 'span',
            typography: 'body2',
            sx: { opacity: 0.48 },
          }}
        />
      </Stack>
    </Box>
  );
}
