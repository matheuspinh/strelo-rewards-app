import * as Yup from 'yup'
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams } from "next/navigation";

import { Close } from "@mui/icons-material";
import { Box, Button, Dialog, useTheme, Typography, dialogClasses, MenuItem } from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";
import { useResponsive } from "src/hooks/use-responsive";

import FormProvider from "src/components/hook-form/form-provider";
import { useLevelsContext } from 'src/hooks/use-levels-context';
import { RHFSelect } from 'src/components/hook-form/rhf-select';

export default function UserLevelModal() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const open = useBoolean();
  const modal = searchParams.get('level-user-modal');
  const user = searchParams.get('user')
  const edit = searchParams.get('edit')
  const isMobile = useResponsive('down', 'sm');
  const password = useBoolean();

  const { registerLevel } = useLevelsContext();

  // const {data: badgeData, isLoading, isError} = useBadge(edit!);

  const level = [] as any;

  const theme = useTheme();

  const userLevelFormSchema = Yup.object().shape({
    level: Yup.string().required('Usuário é obrigatório'),
  })


  const methods = useForm({
    resolver: yupResolver(userLevelFormSchema),
    values: {
      level: '',
    }
  })

  const { levelUpUser, data, isLoading } = useLevelsContext();

  const { handleSubmit, reset } = methods;
  
  const onSubmit = handleSubmit(async(data) => {
    console.log(data)
    try{
      await levelUpUser({userId: user!, levelId: data.level});
      router.push('/dashboard/levels/')
      
    } catch (error) {
      console.log(error)
      toast.error('Erro ao criar nível')
      
    }
  })

  const handleOpenModal = () =>{
    router.push('?level-user-modal=open', undefined)
  }


  const handleClose = () => {
    reset()
    password.onFalse();
    router.push('/dashboard/levels/', undefined)
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


  return (
    <>
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
            <Typography  variant="h4">{edit ? 'Editar Nível' : 'Novo Nível'}</Typography>
            <Close fontSize="large" onClick={handleClose} />
          </Box>
          <FormProvider methods={methods} onSubmit={onSubmit}>
            <Box display="flex" flexDirection="column" gap="2.5rem">
              <Box display="flex" flexDirection="column" gap="1.5rem">  
                <RHFSelect name='level' label='Nível'>
                  {!isLoading && data?.map((level) => <MenuItem value={level.id}>{level.title}</MenuItem>)}
                </RHFSelect>                
                <Button fullWidth variant="contained" size="large" type='submit'>Atribuir Nível</Button>
              </Box>            
            </Box>
          </FormProvider>
        </Box>
      </Dialog>
      </>
  )
}