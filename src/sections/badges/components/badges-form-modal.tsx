import * as Yup from 'yup'
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { useEffect, useCallback } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams } from "next/navigation";

import { Close } from "@mui/icons-material";
import { Box, Button, Dialog, useTheme, MenuItem, Typography, dialogClasses } from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";
import { useBadge } from 'src/hooks/use-badge-detail';
import { useResponsive } from "src/hooks/use-responsive";
import { useBadgesContext } from 'src/hooks/use-badges-context';

import { RHFTextField } from "src/components/hook-form";
import { RHFSelect } from 'src/components/hook-form/rhf-select';
import FormProvider from "src/components/hook-form/form-provider";
import { RHFUploadAvatar } from "src/components/hook-form/rhf-upload";

export default function BadgesFormModal() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const open = useBoolean();
  const modal = searchParams.get('badge-modal');
  const edit = searchParams.get('edit')
  const isMobile = useResponsive('down', 'sm');
  const password = useBoolean();

  const { registerBadge, updateBadge, badgesClassifications, badgesSkillTypes } = useBadgesContext();

  const {data: badgeData, isLoading, isError} = useBadge(edit!);

  const theme = useTheme();

  const userFormSchema = Yup.object().shape({
    image: Yup.mixed().nullable(),
    title: Yup.string().required('Título é obrigatório'),
    classification: Yup.string().required('Classificação é obrigatória'),
    skillType: Yup.string().required('Tipo de habilidade é obrigatório'),
    description: Yup.string().required('Descreva a missão.'),
  })


  const methods = useForm({
    resolver: yupResolver(userFormSchema),
    values: {
      title: badgeData?.title || '',
      description: badgeData?.description || '',
      image: badgeData?.imageUrl || null,
      classification: badgeData?.classification || '',
      skillType: badgeData?.skillType || '',
    }
  })

  const { setValue, handleSubmit, reset } = methods;

  const onSubmit = handleSubmit(async(data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('classification', data.classification);
    formData.append('skillType', data.skillType);
    if(data.image && data.image instanceof File){
      formData.append('image', data.image);
    }
    try{
      if(edit){
        await updateBadge({id: edit, formData});
        toast.success('Conquista atualizada com sucesso!')
      } else {
        await registerBadge(formData);
        toast.success('Conquista criada com sucesso!')
      }
      router.push('/dashboard/badges/')
      
    } catch (error) {
      console.log(error)
      toast.error('Erro ao criar conquista')
      
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          mt: isMobile ? 5 : 15,
          overflow: 'unset',
          
        },
      }}
      sx={{
        
        [`& .${dialogClasses.container}`]: {
          alignItems: 'flex-start',
        },
      }}>

        <Box width="23.4375rem" padding="2rem 1.2rem" overflow='auto' sx={{scrollbarWidth:'none'}}>
          <Box display="flex"  marginBottom="3rem" flexDirection="row" alignItems="center" justifyContent="space-between">
            <Typography  variant="h4">{edit ? 'Editar Conquista' : 'Nova Conquista'}</Typography>
            <Close fontSize="large" onClick={handleClose} />
          </Box>
          <FormProvider methods={methods} onSubmit={onSubmit}>
          <Box display="flex" flexDirection="column" gap="2.5rem">
            <RHFUploadAvatar name='image' onDrop={handleDrop}/>
            <Box display="flex" flexDirection="column" gap="1.5rem">
              <RHFTextField name='title' label='Título'/>
              <RHFTextField name='description' multiline rows={3} label='Descrição'/>
              <RHFSelect name='classification' label='Classificação'>
                {
                  badgesClassifications.map((classification) => (
                    <MenuItem key={classification.value} value={classification.value}>{classification.label}</MenuItem>
                  ))
                }
              </RHFSelect>
              <RHFSelect name='skillType' label='Tipo de habilidade'>
                {
                  badgesSkillTypes.map((skillType) => (
                    <MenuItem key={skillType.value} value={skillType.value}>{skillType.label}</MenuItem>
                  ))
                }
              </RHFSelect>
              <Button fullWidth variant="contained" size="large" type='submit'>{edit ? 'Editar Conquista': 'Criar Conquista'}</Button>
            </Box>            
          </Box>
          </FormProvider>
        </Box>

      </Dialog>
      </>
  )
}