
import Card from '@mui/material/Card';
import { Box, Stack, Typography } from '@mui/material';

import { Mission } from 'src/app/contexts/missions/types';

import Image from 'src/components/image/image';

// ----------------------------------------------------------------------

interface Props {
  mission: Mission;
}

export default function ProfileMission({ mission }: Props) {

  return (
    <Card>
      <Box>
        <Stack p="1.5rem" spacing="1rem">
          <Stack alignItems="center" spacing="1rem" direction="row" >
            <Image src={mission.imageUrl || ''} alt={mission.title} borderRadius="12px" width={64} height={64}/>
            <Stack spacing="4px">
              <Typography variant="subtitle1">{mission.title}</Typography>
              <Typography color="GrayText" variant="caption">{mission.description}</Typography>
            </Stack>
          </Stack>
          <Stack>
            <Typography variant="subtitle2">Recompensas</Typography>
            <Typography variant="body2">1. Exp: {mission.xp}</Typography>
            <Typography variant="body2">2. Gold: {mission.gold}</Typography>
            <Typography variant="body2">3. Badge: {mission.badges[0].title}</Typography>
            
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
}
