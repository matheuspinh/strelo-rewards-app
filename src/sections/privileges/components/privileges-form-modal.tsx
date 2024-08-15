import * as Yup from 'yup'
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams } from "next/navigation";

import { Close } from "@mui/icons-material";
import { Box, Button, Dialog, useTheme, MenuItem, Typography, dialogClasses } from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";
import { usePrivilege } from 'src/hooks/use-privilege-detail';
import { useBadgesContext } from 'src/hooks/use-badges-context';
import { usePrivilegesContext } from 'src/hooks/use-privileges-context';

import { RHFTextField } from "src/components/hook-form";
import { RHFSelect } from 'src/components/hook-form/rhf-select';
import FormProvider from "src/components/hook-form/form-provider";
import { toast } from 'react-toastify';


export default function PrivilegesModal() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const open = useBoolean();
  const modal = searchParams.get('privilege-modal');
  const edit = searchParams.get('edit')
  const password = useBoolean();


  const {registerPrivilege, updatePrivilege} = usePrivilegesContext();

  const {data: privilegeData, isLoading, isError} = usePrivilege(edit!);

  const {data: badges, isLoading: isBadgesLoading} = useBadgesContext()

  const theme = useTheme();

  const userFormSchema = Yup.object().shape({
    title: Yup.string().required('Título é obrigatório'),
    description: Yup.string().required('Descrição é inválida'),
    xp: Yup.number().required('Experiência é obrigatória'),
    gold: Yup.number().required('Ouro é obrigatório'),
    requiredBadgeId: Yup.string(),
  })

  const methods = useForm({
    resolver: yupResolver(userFormSchema),
  })

  const { setValue, handleSubmit, reset, setError } = methods;

  if(!isLoading && privilegeData){
    setValue('title', privilegeData.title)
    setValue('description', privilegeData.description)
    setValue('xp', privilegeData.xp)
    setValue('gold', privilegeData.gold)
    setValue('requiredBadgeId', privilegeData.requiredBadge.id)
  }

  const onSubmit = handleSubmit(async(data) => {
    if(edit){
      try{
        await updatePrivilege({id: edit, patchData: data});
        reset()
        password.onFalse();
        router.push('/dashboard/privileges')
        toast.success('Privilégio atualizado com sucesso!')
       return
      } catch (error) {
        toast.error('Erro ao atualizar privilégio')
        return
      }
    }

    try{
      await registerPrivilege(data);
      reset()
      password.onFalse();
      router.push('/dashboard/privileges')
      toast.success('Privilégio criado com sucesso!')
      return
    } catch (error) {
      toast.error('Erro ao criar privilégio')
      return
    }
  })

  const handleOpenModal = () =>{
    router.push('?privilege-modal=open', undefined)
  }

  const handleClose = () => {
    reset()
    password.onFalse();
    router.push('/dashboard/privileges')
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
    <Button onClick={handleOpenModal} variant="outlined" color='primary'>Novo Privilégio</Button>
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
          height: 'fit-content',
        },
      }}
      sx={{
        
        [`& .${dialogClasses.container}`]: {
          alignItems: 'flex-start',
        },
      }}>

        <Box width="23.4375rem" padding="2rem 1.2rem">
          <Box display="flex"  marginBottom="3rem" flexDirection="row" alignItems="center" justifyContent="space-between">
            <Typography  variant="h4">{edit ? "Editar Privilégio" : "Novo Privilégio"}</Typography>
            <Close fontSize="large" onClick={handleClose} />
          </Box>
          <FormProvider methods={methods} onSubmit={onSubmit}>
          <Box display="flex" flexDirection="column" gap="2.5rem">
            <Box display="flex" flexDirection="column" gap="1.5rem">
              <RHFTextField name='title' label='Título'/>
              <RHFTextField name='description' multiline rows={3} label='Descrição'/>
              <Typography variant="subtitle2">Requisitos</Typography>
              <RHFTextField name='xp' label='Experiência' type='number'/>
              <RHFTextField name='gold' label='Ouro' type='number'/>
              <RHFSelect  name='requiredBadgeId' label='Conquista' sx={{width:'100%'}}>
                {!isBadgesLoading && badges.badges.map((badge) => (
                  <MenuItem value={badge.id} key={badge.id}>
                    {badge.title}
                  </MenuItem>
                ))}
              </RHFSelect>
              <Button fullWidth variant="contained" size="large" type='submit'>{edit? 'Editar Privilégio' : 'Criar Privilégio'}</Button>
            </Box>            
          </Box>
          </FormProvider>
        </Box>

      </Dialog>
      </>
  )
}