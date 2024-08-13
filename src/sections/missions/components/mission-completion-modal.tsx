import * as Yup from 'yup'
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams } from "next/navigation";

import { Close } from "@mui/icons-material";
import { Box, Chip, Avatar, Button, Dialog, useTheme, Typography, dialogClasses } from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";
import { useResponsive } from "src/hooks/use-responsive";
import { useMission } from "src/hooks/use-mission-detail";
import { useUsersContext } from "src/hooks/use-users-context";
import { useMissionsContext } from "src/hooks/use-missions-context";

import FormProvider from "src/components/hook-form/form-provider";
import RHFAutocomplete from "src/components/hook-form/rhf-autocomplete";


export default function MissionCompletionModal() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const open = useBoolean();
  const modal = searchParams.get('mission-completion');
  const mission = searchParams.get('mission')
  const isMobile = useResponsive('down', 'sm');

  const {data : userList, isLoading: isLoadingUser } = useUsersContext()
  const { updateMissionCompletion } = useMissionsContext();

  const {data: missionData, isLoading, isError} = useMission(mission!);

  const theme = useTheme();

  const userFormSchema = Yup.object().shape({
    participants: Yup.array()
  })

  const methods = useForm({
    resolver: yupResolver(userFormSchema),
    values: {
      participants: missionData?.completedBy.map(user => ({label: user.username, value: user.id, avatar: user.avatarUrl})) || []
    }
  })

  const { handleSubmit, reset } = methods;

  const onSubmit = handleSubmit(async(data) => {
      try{
        if(data.participants){
          await updateMissionCompletion({id: mission!, usersIds: data.participants.map((user: any) => user.value)});
          router.push('/dashboard/missions/')
        }
        
      } catch (error) {
        console.log(error)
      }
  })

  const handleClose = () => {
    reset()
    router.push('/dashboard/missions/', undefined)
  }

  useEffect(() => {
    if(modal === 'open'){
      if(!mission){
        reset()
      }
     open.onTrue()  
    } else {
      open.onFalse()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modal, mission, reset])

  const renderButton = (
    <Button hidden />
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
          width: '30rem',
        },
      }}
      sx={{
        [`& .${dialogClasses.container}`]: {
          alignItems: 'flex-start',
        },
      }}>
        
          <Box padding="2rem 1.2rem" overflow="auto" sx={{scrollbarWidth:'none'}}>
            <Box display="flex"  marginBottom="1rem" flexDirection="row" alignItems="center" justifyContent="space-between">
              <Typography  variant="h4">Completar Missão</Typography>
              <Close fontSize="large" onClick={handleClose} />
            </Box>
            <FormProvider methods={methods} onSubmit={onSubmit}>
              <Box display="flex" flexDirection="column" gap="1.5rem">
              <Typography variant='subtitle1'>Participantes</Typography>
                    {!isLoadingUser && missionData &&
                      <RHFAutocomplete
                        name='participants'
                        label='Completaram a missão'
                        multiple
                        disableCloseOnSelect
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        options={missionData!.users.map(user => ({label: user.username, value: user.id, avatar: user.avatarUrl}))}
                        renderOption={(props, option) => (                          
                            <li {...props}>
                              <Box  display="flex" flexDirection="row" alignItems="center" gap="1rem">
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
                    <Button fullWidth variant="contained" size="large" type='submit'>Salvar</Button>
              </Box>
            </FormProvider>
          </Box>
      </Dialog>
      </>
  )
}