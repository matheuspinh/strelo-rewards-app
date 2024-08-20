'use client';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';

import { User } from 'src/app/contexts/users/types';
import { Badge } from 'src/app/contexts/badges/types';

import Image from 'src/components/image';

import ProfileMission from './profile-mission';
// ----------------------------------------------------------------------

type Props = {
  userInfo: User;
};

export default function ProfileHome({ userInfo }: Props) {
  
  const completedMissionsSet = new Set(userInfo?.completedMissions.map(mission => mission.id) || []);
  const ongoingMissions = userInfo?.missions.filter(mission =>{ 
    return !completedMissionsSet.has(mission.id)
  });
  const softSkillBadges = userInfo?.badges.filter((badge) => badge.skillType === 'softskill');
  const hardSkillBadges = userInfo?.badges.filter((badge) => badge.skillType === 'hardskill');
  const goldBadges = userInfo?.badges.filter((badge) => badge.classification === 'gold');
  const silverBadges = userInfo?.badges.filter((badge) => badge.classification === 'silver');
  const bronzeBadges = userInfo?.badges.filter((badge) => badge.classification === 'bronze');

  const renderResources = (
    <Card sx={{ py: 3, textAlign: 'center', typography: 'h4' }}>
      <Stack
        direction="row"
      >
        <Stack width={1}>
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Experiência
          </Box>
          <Box component="span" sx={{ typography: 'subtitle' }}>
            {userInfo  && new Intl.NumberFormat('pt-BR').format(userInfo!.xp)}
          </Box>
        </Stack>

        <Stack width={1}>
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Moedas
          </Box>
          <Box component="span" sx={{ typography: 'subtitle' }}>
            {userInfo && new Intl.NumberFormat('pt-BR').format(userInfo!.gold)}
          </Box>
        </Stack>
      </Stack>
    </Card>
  );

  const renderTotalBadges = (
    <Card sx={{}}>
      <CardHeader sx={{height:'auto'}} title="Conquistas Totais"/>
      <Stack spacing={1} sx={{ p: 3 }}>
        <Stack display='flex' direction="row" gap={1}><strong>Ouro:</strong> {goldBadges?.length}</Stack>
        <Stack display='flex' direction="row" gap={1}><strong>Prata:</strong> {silverBadges?.length}</Stack>
        <Stack display='flex' direction="row" gap={1}><strong>Bronze:</strong> {bronzeBadges?.length}</Stack>
      </Stack>
    </Card>
  );

  const renderSkillBadge = (skill:string, skillBadges: Badge[]) => (
      <Card sx={{}}>
        <CardHeader sx={{height:'4.75rem'}} title={`${skill} (${skillBadges.length}) `}/>
        <Stack spacing={2} sx={{ p: 3 }}>
          {userInfo && skillBadges.map((badge) => (
            <Stack key={badge.id} direction="row" spacing="1rem">
                <Image src={badge.imageUrl || ''} sx={{ width: 24, height: 24, borderRadius: '15%' }} />
                <Typography color={badge.classification} variant='body2'>{badge.title}</Typography>            
            </Stack>
          )
          )}
        </Stack>
      </Card>
    )
  

  const renderPrivileges = (
    <Card sx={{}}>
      <CardHeader sx={{height:'4.75rem'}} title="Privilégios Ativos"/>
      <Stack spacing={2} sx={{ p: 3 }}>
        {userInfo && userInfo.privileges.map((privilege) => (
          <Stack key={privilege.id} direction="row" spacing="1rem">
              <Link variant='body2'>{privilege.title}</Link>            
          </Stack>
        )
        )}
      </Stack>
    </Card>
  )

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        <Stack spacing={3}>
          {userInfo && renderResources}

          {userInfo && renderTotalBadges}

          {userInfo && renderSkillBadge('Soft Skills' ,softSkillBadges)}

          {userInfo && renderSkillBadge('Hard Skills', hardSkillBadges)}

          {userInfo && renderPrivileges}
        </Stack>
      </Grid>

      <Grid xs={12} md={8}>
        <Stack spacing={3}>
          {ongoingMissions.length > 0 && <Card sx={{
            maxHeight: '30rem',
            overflowY: 'auto',
            scrollbarWidth: 'none',}}>
          <CardHeader sx={{height:'4.75rem'}} title="Missões em Andamento"/>
          {userInfo && ongoingMissions.map((mission) => (
            <ProfileMission key={mission.id} mission={mission} />
          ))}
          </Card>}
          {userInfo?.completedMissions.length > 0 && <Card sx={{
            maxHeight: '30rem',
            overflowY: 'auto',
            scrollbarWidth: 'none',
          }}>
          <CardHeader sx={{height:'4.75rem'}} title="Missões Concluídas"/>
          {userInfo && userInfo?.completedMissions.map((mission) => (
            <ProfileMission key={mission.id} mission={mission} />
          ))}
          </Card>}
          
        </Stack>
      </Grid>
    </Grid>
  );
}
