import { yupResolver } from "@hookform/resolvers/yup";
import { Close, Label } from "@mui/icons-material";
import { Avatar, Box, Button, Chip, Dialog, dialogClasses, IconButton, Input, InputAdornment, InputBase, Typography, useTheme } from "@mui/material";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { User } from "src/app/contexts/users/types";
import { RHFTextField } from "src/components/hook-form";
import FormProvider from "src/components/hook-form/form-provider";
import { RHFUpload, RHFUploadAvatar } from "src/components/hook-form/rhf-upload";
import Iconify from "src/components/iconify";
import { useBoolean } from "src/hooks/use-boolean";
import { useUsersContext } from "src/hooks/use-users-context";
import { useRouter, useSearchParams } from "next/navigation";
import * as Yup from 'yup'
import { useUser } from "src/hooks/use-user-detail";
import { useResponsive } from "src/hooks/use-responsive";
import Scrollbar from "src/components/scrollbar";
import { RHFMultiSelect, RHFSelect } from "src/components/hook-form/rhf-select";
import RHFAutocomplete from "src/components/hook-form/rhf-autocomplete";
import { useMissionsContext } from "src/hooks/use-missions-context";
import { useMission } from "src/hooks/use-mission-detail";

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
export default function MissionFormModal() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const open = useBoolean();
  const modal = searchParams.get('mission-modal');
  const edit = searchParams.get('edit')
  const isMobile = useResponsive('down', 'sm');
  const password = useBoolean();

  const {data : userList, isLoading: isLoadingUser } = useUsersContext()
  const { registerMission, updateMission } = useMissionsContext();

  const {data, isLoading, isError} = useMission(edit!);

  const badgeData = badgesMock.map(badge => ({label: badge.name, value: badge.id}))

  const theme = useTheme();

  const userFormSchema = Yup.object().shape({
    image: Yup.mixed().nullable(),
    title: Yup.string().required('Título é obrigatório'),
    description: Yup.string().required('Descreva a missão.'),
    xp: Yup.number().min(1, 'Uma missão deve ter experiência como recompensa').required('Determine a experiência concedida.'),
    gold: Yup.number().optional(),
    badges: Yup.array().optional(),
    participants: Yup.array().min(1, 'Adicione ao menos um participante.')
  })

  const methods = useForm({
    resolver: yupResolver(userFormSchema),
    defaultValues: {
      participants: [],
      badges: []
    }
  })

  const { setValue, handleSubmit, reset } = methods;

  if(!isLoading && data){
    setValue('title', data.title)
    setValue('description', data.description) 
    setValue('xp', data.xp)
    setValue('gold', data.gold)
    setValue('badges', data.badges)
    setValue('participants', data.users.map(user => ({label: user.username, value: user.id, avatar: user.avatarUrl})))

    if (data.imageUrl){
      const file = {
        preview: data.imageUrl
      }
      setValue('image', file, { shouldValidate: true })
    }
  }

  const onSubmit = handleSubmit(async(data) => {

    if(edit){
      try{
        const mappedParticipants = data.participants?.map((user) => user.value)
     
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('xp', data.xp.toString());
        data.gold && formData.append('gold', data.gold.toString());
        data.badges && formData.append('badges', JSON.stringify(data.badges));
        formData.append('participants', JSON.stringify(mappedParticipants));
        if(data.image && data.image instanceof File){
          formData.append('image', data.image);
        }
        await updateMission({id: edit, formData});
        router.push('/dashboard/missions/')
        return
      } catch (error) {

      }
    }
    try{
      const formData = new FormData();
      
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('xp', data.xp.toString());
      data.gold && formData.append('gold', data.gold.toString());
      data.badges && formData.append('badges', JSON.stringify(data.badges));
      formData.append('participants', JSON.stringify(data.participants?.map((user) => user.value)));

      if(data.image && data.image instanceof File){
        formData.append('image', data.image);
      }

      await registerMission(formData);
      router.push('/dashboard/missions/')
      return
    } catch (error) {
      
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
    router.push('?mission-modal=open', undefined)
  }


  const handleClose = () => {
    reset()
    password.onFalse();
    router.push('/dashboard/missions/', undefined)
  }

  useEffect(() => {
    if(modal === 'open'){
      !edit && reset()  
      open.onTrue()
    } else {
      open.onFalse()
    }
    }, [modal])

  const renderButton = (
    <Button onClick={handleOpenModal} variant="outlined" color='primary'>Nova Missão</Button>
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
          mt: isMobile ? 5 : 5,
          maxWidth: '60rem',
          height: isMobile ? '90vh' : '52rem',
        },
      }}
      sx={{
        [`& .${dialogClasses.container}`]: {
          alignItems: 'flex-start',
        },
      }}>
        
          <Box padding={'2rem 1.2rem'} overflow={'auto'} sx={{scrollbarWidth:'none'}}>
            <Box display={'flex'}  marginBottom={'3rem'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
              <Typography  variant="h4">Nova Missão</Typography>
              <Close fontSize={"large"} onClick={handleClose} />
            </Box>
            <FormProvider methods={methods} onSubmit={onSubmit}>
            <Box display={'flex'} flexDirection={isMobile ? 'column' : 'row'} gap={'2.5rem'}>
              <Box width={isMobile ? '21rem' : '30rem'} height={'20rem'} padding={'0'}>
                <RHFUpload  name='image' onDrop={handleDrop} sx={{height: '20rem'}}/>
              </Box>
                <Box display={'flex'} width={isMobile ? '21rem' : '30rem'} flexDirection={'column'} gap={'1rem'}>
                    <RHFTextField name='title' label='Título'/>
                    <RHFTextField name='description' label='Descrição' multiline rows={3}/>
                    <Typography variant='subtitle2'>Recompensa</Typography>
                    <RHFTextField name='xp' type="number" label='Experiência'/>
                    <RHFTextField name='gold' type="number" label='Ouro'/>
                    <RHFMultiSelect checkbox sx={{width:'100%'}} name='badges' label='Insignias' options={badgeData}/>
                    <Typography variant='subtitle2'>Participantes</Typography>
                    {!isLoadingUser &&
                      <RHFAutocomplete
                        name='participants'
                        label='Participantes'
                        multiple
                        disableCloseOnSelect
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        options={userList.users.map(user => ({label: user.username, value: user.id, avatar: user.avatarUrl}))}
                        renderOption={(props, option) => (                          
                            <li {...props}>
                              <Box  display={'flex'} flexDirection={'row'} alignItems={'center'} gap={'1rem'}>
                                <Avatar sx={{ width: 24, height: 24 }} src={option.avatar} />
                                <Typography variant='subtitle2'>{option.label}</Typography>
                              </Box>
                            </li>
                        )}
                        renderTags={(selected, getTagProps) =>
                          selected.map((option, index) => (
                            <Chip 
                              {...getTagProps({ index })}
                              key={option.value}
                              label={option.label}
                              avatar={<Avatar src={option.avatar} />}
                              size="small"
                              variant="soft"
                            />
                          ))
                        }
                      />
                    }
                    <Button fullWidth variant="contained" size="large" type='submit'>{edit ? 'Editar Missão' : 'Criar Missão'}</Button>
                </Box>     
            </Box>
            </FormProvider>
          </Box>
        

      </Dialog>
      </>
  )
}