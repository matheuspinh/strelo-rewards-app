'use client';

import * as Yup from 'yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useSettingsContext } from 'src/components/settings';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFUploadAvatar } from 'src/components/hook-form/rhf-upload';

// ----------------------------------------------------------------------

export default function OneView() {
  const settings = useSettingsContext();
  const schema = Yup.object().shape({
    avatar: Yup.mixed().nullable().required('Avatar is required')
  })


  const methods = useForm({
    resolver: yupResolver(schema)
  })

  const { setValue, handleSubmit } = methods;

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('avatar', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const onSubmit = handleSubmit(async(data) => {})


  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4"> Page One </Typography>
      <FormProvider onSubmit={onSubmit} methods={methods}>
        <RHFUploadAvatar onDrop={handleDrop} name='avatar'/>
        <Button type='submit'>Submit</Button>
      </FormProvider>
    </Container>
  );
}