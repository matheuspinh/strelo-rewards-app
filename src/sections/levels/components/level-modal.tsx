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

import { RHFTextField } from "src/components/hook-form";
import FormProvider from "src/components/hook-form/form-provider";
import { useLevelsContext } from 'src/hooks/use-levels-context';
import { RHFSelect } from 'src/components/hook-form/rhf-select';

export default function LevelFormModal() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const open = useBoolean();
  const modal = searchParams.get('level-modal');
  const edit = searchParams.get('edit')
  const isMobile = useResponsive('down', 'sm');
  const password = useBoolean();

  const { registerLevel, data } = useLevelsContext();

  // const {data: badgeData, isLoading, isError} = useBadge(edit!);

  const level = [] as any;

  const theme = useTheme();

  const levelFormSchema = Yup.object().shape({
    title: Yup.string().required('Título é obrigatório'),
    softSkillsBadges: Yup.number().required('Quantidade de conquistas de soft skills é obrigatório'),
    hardSkillsBadges: Yup.number().required('Quantidade de conquistas de hard skills é obrigatório'),
    xpRequired: Yup.number().required('Quantidade de xp é obrigatório'),
    previousLevelId: Yup.string().optional(),
    // goldReward: Yup.number().optional(),
  })


  const methods = useForm({
    resolver: yupResolver(levelFormSchema),
    values: {
      title: level?.title || '',
      softSkillsBadges: level?.softSkillsBadges || '',
      hardSkillsBadges: level?.hardSkillsBadges  || '',
      xpRequired: level?.xpRequired || '',
      // goldReward: level?.goldReward || null,
      previousLevelId: level?.previousLevelId || '',
    }
  })

  const { setValue, handleSubmit, reset } = methods;

  const onSubmit = handleSubmit(async(data) => {
    console.log('click')
    console.log(data)
    try{
      if(edit){
        await registerLevel({id: edit, data});
        toast.success('Conquista atualizada com sucesso!')
      } else {
        await registerLevel(data);
        toast.success('Nível criado com sucesso!')
      }
      router.push('/dashboard/levels/')
      
    } catch (error) {
      console.log(error)
      toast.error('Erro ao criar nível')
      
    }
  })

  const handleOpenModal = () =>{
    router.push('?level-modal=open', undefined)
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

  const renderButton = (
    <Button onClick={handleOpenModal} variant="outlined" color='primary'>Novo Nível</Button>
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
            <Typography  variant="h4">{edit ? 'Editar Nível' : 'Novo Nível'}</Typography>
            <Close fontSize="large" onClick={handleClose} />
          </Box>
          <FormProvider methods={methods} onSubmit={onSubmit}>
            <Box display="flex" flexDirection="column" gap="2.5rem">
              <Box display="flex" flexDirection="column" gap="1.5rem">
                <RHFTextField name='title' label='Título'/>
                <RHFTextField type='number' name='softSkillsBadges' label='Quantidade de conquistas de soft skills'/>
                <RHFTextField type='number' name='hardSkillsBadges' label='Quantidade de conquistas de hard skills'/>
                <RHFTextField type='number' name='xpRequired' label='Quantidade de xp'/>
                <RHFSelect name='previousLevelId' label='Nível Anterior'>
                  {data?.map((level: any) => {
                    console.log(level)
                    if(level.nextLevel.length === 0){
                      return <MenuItem value={level.id}>{level.title}</MenuItem>
                    }
                  })}
                </RHFSelect>
                <Button fullWidth variant="contained" size="large" type='submit'>{edit ? 'Editar Nível': 'Criar Nível'}</Button>
              </Box>            
            </Box>
          </FormProvider>
        </Box>

      </Dialog>
      </>
  )
}