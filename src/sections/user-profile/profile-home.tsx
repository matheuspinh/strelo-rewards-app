'use client';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';

import { User } from 'src/app/contexts/users/types';

import Image from 'src/components/image';

import ProfileMission from './profile-mission';
// ----------------------------------------------------------------------

type Props = {
  userInfo: User;
};

export default function ProfileHome({ userInfo }: Props) {
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

  const renderAchievements = (
    <Card sx={{}}>
      <CardHeader sx={{height:'4.75rem'}} title="Conquistas"/>
      <Stack spacing={2} sx={{ p: 3 }}>
        {userInfo && userInfo.badges.map((badge) => (
          <Stack key={badge.id} direction="row" spacing="1rem">
              <Image src={badge.imageUrl || ''} sx={{ width: 24, height: 24, borderRadius: '15%' }} />
              <Typography variant='body2'>{badge.title}</Typography>            
          </Stack>
        )
        )}
      </Stack>
    </Card>
  );

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

          {userInfo && renderAchievements}

          {userInfo && renderPrivileges}
        </Stack>
      </Grid>

      <Grid xs={12} md={8}>
        <Stack spacing={3}>
          {userInfo && userInfo.missions.map((mission) => (
            <ProfileMission key={mission.id} mission={mission} />
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
}
