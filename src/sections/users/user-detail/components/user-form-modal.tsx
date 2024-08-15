import * as Yup from 'yup'
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { useEffect, useCallback } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { Close } from "@mui/icons-material";
import { Box, Button, Dialog, useTheme, IconButton, Typography, dialogClasses, InputAdornment } from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";
import { useUser } from "src/hooks/use-user-detail";
import { useUsersContext } from "src/hooks/use-users-context";

import Iconify from "src/components/iconify";
import { RHFTextField } from "src/components/hook-form";
import FormProvider from "src/components/hook-form/form-provider";
import { RHFUploadAvatar } from "src/components/hook-form/rhf-upload";



export default function UserFormModal() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const open = useBoolean();
  const modal = searchParams.get('user-modal');
  const pathname = usePathname()
  const user = pathname.split('/').filter(Boolean).pop()
  const edit = user;
  const password = useBoolean();

  const { updateUser} = useUsersContext();

  const {data: userData, isLoading, isError} = useUser(edit!);

  const theme = useTheme();

  const userFormSchema = Yup.object().shape({
    image: Yup.mixed().nullable(),
    username: Yup.string().required('Nome é obrigatório'),
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
    password: Yup.string().required('Senha é obrigatória'),
  })

  const methods = useForm({
    values: {
      username: userData?.username || '',
      email: userData?.email || '',
      password: '',
      image: userData?.avatarUrl || null
    },
    resolver: yupResolver(userFormSchema)
  })

  const { setValue, handleSubmit, reset, setError } = methods;

  const onSubmit = handleSubmit(async(data) => {
      try{
        const formData = new FormData();
        formData.append('username', data.username);
        formData.append('email', data.email);
        formData.append('password', data.password);
        if(data.image && data.image instanceof File){
          formData.append('image', data.image);
        }
        await updateUser({id: edit!, formData});
        reset()
        password.onFalse();
        toast.success('Informações atualizadas com sucesso')
        router.push(pathname)
       
      } catch (error) {
        if (error.message){
          if(error.message.includes('E-mail')){
            setError('email', {message: 'E-mail já cadastrado'})
        }
        toast.error('Erro ao atualizar informações')
        
      }
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
    router.push('?user-modal=open', undefined)
  }


  const handleClose = () => {
    reset()
    password.onFalse();
    router.push(pathname)
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
    <Iconify 
      alignSelf="center"
      icon="line-md:pencil"
      onClick={handleOpenModal}
      sx={{
        cursor: 'pointer',
        opacity: 0.5,
        transition: 'opacity 0.3s',
        '&:hover': {
          opacity: 1,
        },
      }}
    />
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
            <Typography  variant="h4">Editar Usuário</Typography>
            <Close fontSize="large" onClick={handleClose} />
          </Box>
          <FormProvider methods={methods} onSubmit={onSubmit}>
          <Box display="flex" flexDirection="column" gap="2.5rem">
            <RHFUploadAvatar name='image' onDrop={handleDrop}/>
            <Box display="flex" flexDirection="column" gap="1.5rem">
              <RHFTextField name='username' label='Nome'/>
              <RHFTextField name='email' label='E-mail'/>
              <RHFTextField 
              name='password'
              label='Senha' 
              type={password.value ? 'text' : 'password'}
              InputProps={{
              endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}/>
              <Button fullWidth variant="contained" size="large" type='submit'>Editar Usuário</Button>
            </Box>            
          </Box>
          </FormProvider>
        </Box>

      </Dialog>
      </>
  )
}