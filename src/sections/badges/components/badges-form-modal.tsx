import * as Yup from 'yup'
import { useForm } from "react-hook-form";
import { useEffect, useCallback } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams } from "next/navigation";

import { Close } from "@mui/icons-material";
import { Box, Chip, Avatar, Button, Dialog, useTheme, Typography, dialogClasses, InputAdornment, IconButton } from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";
import { useResponsive } from "src/hooks/use-responsive";
import { useMission } from "src/hooks/use-mission-detail";
import { useUsersContext } from "src/hooks/use-users-context";
import { useMissionsContext } from "src/hooks/use-missions-context";

import { RHFTextField } from "src/components/hook-form";
import { RHFUpload, RHFUploadAvatar } from "src/components/hook-form/rhf-upload";
import FormProvider from "src/components/hook-form/form-provider";
import { RHFMultiSelect } from "src/components/hook-form/rhf-select";
import RHFAutocomplete from "src/components/hook-form/rhf-autocomplete";
import Iconify from 'src/components/iconify';
import { useBadgesContext } from 'src/hooks/use-badges-context';
import image from 'src/components/image';

export const badgesMock = [
  { id: '1', name: 'Badge 1'},
  { id: '2', name: 'Badge 2'},
  { id: '3', name: 'Badge 3'},
  { id: '4', name: 'Badge 4'},
  { id: '5', name: 'Badge 5'},
  { id: '6', name: 'Badge 6'},
  { id: '7', name: 'Badge 7'},
  { id: '8', name: 'Badge 8'},
  { id: '9', name: 'Badge 9'},
  { id: '10', name: 'Badge 10'},
]
export default function BadgesFormModal() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const open = useBoolean();
  const modal = searchParams.get('badge-modal');
  const edit = searchParams.get('edit')
  const isMobile = useResponsive('down', 'sm');
  const password = useBoolean();

  const { registerBadge } = useBadgesContext();

  const {data: missionData, isLoading, isError} = useMission(edit!);

  const badgeData = badgesMock.map(badge => ({label: badge.name, value: badge.id}))

  const theme = useTheme();

  const userFormSchema = Yup.object().shape({
    image: Yup.mixed().nullable(),
    title: Yup.string().required('Título é obrigatório'),
    description: Yup.string().required('Descreva a missão.'),
  })

  const methods = useForm({
    resolver: yupResolver(userFormSchema),
  })

  const { setValue, handleSubmit, reset } = methods;

  if(!isLoading && missionData){
    setValue('title', missionData.title)
    setValue('description', missionData.description) 

    if (missionData.imageUrl){
      const file = {
        preview: missionData.imageUrl
      }
      setValue('image', file, { shouldValidate: true })
    }
  }

  const onSubmit = handleSubmit(async(data) => {
    if(edit){
      try{
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        if(data.image && data.image instanceof File){
          formData.append('image', data.image);
        }
        // await updateMission({id: edit, formData});
        router.push('/dashboard/badges/')
        return
      } catch (error) {
        console.log(error)
      }
    }
    try{
      const formData = new FormData();
      
      formData.append('title', data.title);
      formData.append('description', data.description);
      if(data.image && data.image instanceof File){
        formData.append('image', data.image);
      }

      await registerBadge(formData);
      router.push('/dashboard/badges/')
      
    } catch (error) {
      console.log(error)
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
      }
    },
    [setValue]
  );

  const handleOpenModal = () =>{
    router.push('?badge-modal=open', undefined)
  }


  const handleClose = () => {
    reset()
    password.onFalse();
    router.push('/dashboard/badges/', undefined)
  }

  useEffect(() => {
    if(modal === 'open'){
      if(!edit){
        reset()
      }  
      open.onTrue()
    } else {
      open.onFalse()
    }
    }, [modal, edit, reset])

  const renderButton = (
    <Button onClick={handleOpenModal} variant="outlined" color='primary'>Nova Conquista</Button>
  )

  return (
    <>
    {renderButton}

    <Dialog
      open={open.value}
      onClose={handleClose}
      transitionDuration={{
        enter: theme.transitions.duration.shortest,
        exit: 0,
      }}
      PaperProps={{
        sx: {
          mt: 15,
          overflow: 'unset',
        },
      }}
      sx={{
        
        [`& .${dialogClasses.container}`]: {
          alignItems: 'flex-start',
        },
      }}>

        <Box height="40rem" width="23.4375rem" padding="2rem 1.2rem">
          <Box display="flex"  marginBottom="3rem" flexDirection="row" alignItems="center" justifyContent="space-between">
            <Typography  variant="h4">Nova Conquista</Typography>
            <Close fontSize="large" onClick={handleClose} />
          </Box>
          <FormProvider methods={methods} onSubmit={onSubmit}>
          <Box display="flex" flexDirection="column" gap="2.5rem">
            <RHFUploadAvatar name='image' onDrop={handleDrop}/>
            <Box display="flex" flexDirection="column" gap="1.5rem">
              <RHFTextField name='title' label='Título'/>
              <RHFTextField name='description' multiline rows={3} label='Descrição'/>
              <Button fullWidth variant="contained" size="large" type='submit'>Criar Conquista</Button>
            </Box>            
          </Box>
          </FormProvider>
        </Box>

      </Dialog>
      </>
  )
}