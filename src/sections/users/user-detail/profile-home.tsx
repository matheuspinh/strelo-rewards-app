'use client';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import { Typography, LinearProgress } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import { getBorderColor } from 'src/utils/getBorderColor';

import { User } from 'src/app/contexts/users/types';
import { Badge } from 'src/app/contexts/badges/types';
import { GoldMedal, BronzeMedal, SilverMedal } from 'src/assets/icons/medals-icons';

import Image from 'src/components/image';

import ProfileMission from './profile-mission';
// ----------------------------------------------------------------------

type Props = {
  userInfo: User;
};

export default function ProfileHome({ userInfo }: Props) {
  const isMobile = useResponsive('down', 'md');
  const completedMissionsSet = new Set(userInfo?.completedMissions.map(mission => mission.id) || []);
  const ongoingMissions = userInfo?.missions.filter(mission =>!completedMissionsSet.has(mission.id));

  const softSkillBadges = userInfo?.badges.filter((badge) => badge.skillType === 'softskill');
  const hardSkillBadges = userInfo?.badges.filter((badge) => badge.skillType === 'hardskill');
  const goldBadges = userInfo?.badges.filter((badge) => badge.classification === 'gold');
  const silverBadges = userInfo?.badges.filter((badge) => badge.classification === 'silver');
  const bronzeBadges = userInfo?.badges.filter((badge) => badge.classification === 'bronze');
  const hardSkillGoldBadges = goldBadges?.filter((badge) => badge.classification === 'gold');
  const hardSkillSilverBadges = silverBadges?.filter((badge) => badge.classification === 'silver');
  const softSkillGoldBadges = goldBadges?.filter((badge) => badge.classification === 'gold');
  const softSkillSilverBadges = silverBadges?.filter((badge) => badge.classification === 'silver');
  const nextLevelSpecificBadge = userInfo?.nextLevel?.specificBadge;
  const userHasSpecificBadge = userInfo?.badges.find(badge => badge.id === nextLevelSpecificBadge?.id);

  const completion = (current: number, max: number) => {
    if(current > max) return 100;
    return Math.ceil((current / max) * 100);
  }


  const renderLeveling = () => 
    // if(!userInfo.nextLevel){
    //   return null;
    // }
    
     (<Card>
      <CardHeader sx={{height:'4.75rem'}} title="Progresso:"/>
      <Stack spacing={5} sx={{ pl: 3, pb: 2, pr: isMobile ? 3 : 0 }} direction={isMobile ? 'column' : 'row'} flexWrap="wrap">
        <Box>
          <Typography variant='h6' fontWeight="400">Próximo Nível</Typography>
          <Typography variant='h5'>{userInfo && userInfo.nextLevel.title}</Typography>
        </Box>
          <Box>
            <Typography>Experiência </Typography>
            <LinearProgress variant='determinate' value={completion(userInfo?.xp, userInfo?.nextLevel.xpRequired)}/>
            <Typography sx={{fontSize:'12px', fontWeight: '400', color:'secondary.main'}} marginTop='0.5rem' align='left'>
              {userInfo?.xp}/{userInfo?.nextLevel.xpRequired}{'  '}
              ({completion(userInfo?.xp, userInfo?.nextLevel.xpRequired)}%)
            </Typography>
          </Box>
          <Box>
            <Typography>Badges Soft Skill </Typography>
            <LinearProgress variant='determinate' value={completion(softSkillBadges?.length, userInfo?.nextLevel.softSkillsBadges)}/>
            <Typography sx={{fontSize:'12px', fontWeight: '400', color:'secondary.main'}} marginTop='0.5rem' align='left'>
              {softSkillBadges?.length}/{userInfo?.nextLevel.softSkillsBadges}{'  '}
              ({completion(softSkillBadges?.length, userInfo?.nextLevel.softSkillsBadges)}%)
            </Typography>
          </Box>
          <Box>
            <Typography>Badges Hard Skill </Typography>
            <LinearProgress variant='determinate' value={completion(hardSkillBadges?.length, userInfo?.nextLevel.hardSkillsBadges)}/>
            <Typography sx={{fontSize:'12px', fontWeight: '400', color:'secondary.main'}} marginTop='0.5rem' align='left'>
              {hardSkillBadges?.length}/{userInfo?.nextLevel.hardSkillsBadges}{'  '}
              ({completion(hardSkillBadges?.length, userInfo?.nextLevel.hardSkillsBadges)}%)
            </Typography>
          </Box>
          <Box>
            <Typography>Badges Ouro Soft Skill </Typography>
            <LinearProgress variant='determinate' value={completion(softSkillGoldBadges?.length, userInfo?.nextLevel.silverSoftSkills)}/>
            <Typography sx={{fontSize:'12px', fontWeight: '400', color:'secondary.main'}} marginTop='0.5rem' align='left'>
              {softSkillGoldBadges?.length}/{userInfo?.nextLevel.silverSoftSkills}{'  '}
              ({completion(softSkillGoldBadges?.length, userInfo?.nextLevel.silverSoftSkills)}%)
            </Typography>
          </Box>
          <Box>
          <Typography>Badges Prata Soft Skill </Typography>
            <LinearProgress variant='determinate' value={completion(softSkillSilverBadges?.length, userInfo?.nextLevel.silverSoftSkills)}/>
            <Typography sx={{fontSize:'12px', fontWeight: '400', color:'secondary.main'}} marginTop='0.5rem' align='left'>
              {softSkillSilverBadges.length}/{userInfo?.nextLevel.silverSoftSkills}{'  '}
              ({completion(softSkillSilverBadges?.length, userInfo?.nextLevel.silverSoftSkills)}%)
            </Typography>
          </Box>
          <Box>
          <Typography>Badges Ouro Hard Skill </Typography>
            <LinearProgress variant='determinate' value={completion(hardSkillGoldBadges?.length, userInfo?.nextLevel.goldHardSkills)}/>
            <Typography sx={{fontSize:'12px', fontWeight: '400', color:'secondary.main'}} marginTop='0.5rem' align='left'>
              {hardSkillGoldBadges.length}/{userInfo?.nextLevel.goldHardSkills}{'  '}
              ({completion(hardSkillGoldBadges?.length, userInfo?.nextLevel.goldHardSkills)}%)
            </Typography>
          </Box>
          <Box>
            <Typography>Badges Prata Hard Skill </Typography>
            <LinearProgress variant='determinate' value={completion(hardSkillSilverBadges?.length, userInfo?.nextLevel.silverHardSkills)}/>
            <Typography sx={{fontSize:'12px', fontWeight: '400', color:'secondary.main'}} marginTop='0.5rem' align='left'>
              {hardSkillSilverBadges.length}/{userInfo?.nextLevel.silverHardSkills}{'  '}
              ({completion(hardSkillSilverBadges?.length, userInfo?.nextLevel.hardSkillsBadges)}%)
            </Typography>
          </Box>
          {nextLevelSpecificBadge && 
            <Stack key={nextLevelSpecificBadge?.id} alignItems="center" direction="row" spacing="1rem" sx={{
              ...(!userHasSpecificBadge && {opacity: 0.5, filter: 'grayscale(70%)'}),
            }}>
              <Box padding={0} sx={{borderRadius: '15%'}}>
                <Image src={nextLevelSpecificBadge?.imageUrl || ''} sx={{ width: 32, height: 32, outline: `3px solid ${getBorderColor(nextLevelSpecificBadge?.classification)}`, borderRadius: '15%'}} />
              </Box>
                <Typography variant='subtitle1'>{nextLevelSpecificBadge?.title}</Typography>            
            </Stack>
          }
        <Box />
      </Stack>
    </Card>)


  const renderResources = (
    <Card sx={{ py: 3, textAlign: 'center', typography: 'h4' }}>
      <Stack
        direction="row"
      >
        <Stack width={1}>
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Nível
          </Box>
          <Box component="span" sx={{ typography: 'h6' }}>
            {userInfo.currentLevel ? userInfo.currentLevel.title : 'N/A'}
          </Box>
        </Stack>
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
        <Stack display='flex' direction="row" gap={1}><GoldMedal/> <strong>Ouro:</strong> {goldBadges?.length}</Stack>
        <Stack display='flex' direction="row" gap={1}><SilverMedal/><strong>Prata:</strong> {silverBadges?.length}</Stack>
        <Stack display='flex' direction="row" gap={1}><BronzeMedal/><strong>Bronze:</strong> {bronzeBadges?.length}</Stack>
      </Stack>
    </Card>
  );

  const renderSkillBadge = (skill:string, skillBadges: Badge[]) => (
      <Card sx={{}}>
        <CardHeader sx={{height:'4.75rem'}} title={`${skill} (${skillBadges.length}) `}/>
        <Stack spacing={2} sx={{ p: 3 }}>
          {userInfo && skillBadges.map((badge) => (
            <Stack key={badge.id} direction="row" spacing="1rem">
              <Box padding={0} sx={{borderRadius: '15%', outline: `3px solid ${getBorderColor(badge.classification)}`}}>
                <Image src={badge.imageUrl || ''} sx={{ width: 24, height: 24, borderRadius: '15%'}} />
                </Box>
                <Typography variant='body2'>{badge.title}</Typography>            
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
        {userInfo.nextLevel && renderLeveling()}
         <Card sx={{
            maxHeight: '30rem',
            overflowY: 'auto',
            scrollbarWidth: 'none',}}>
          <CardHeader sx={{height:'4.75rem'}} title="Missões em Andamento"/>
          {userInfo && ongoingMissions.map((mission:any) => (
            <ProfileMission key={mission.id} mission={mission} />
          ))}
          </Card>
          <Card sx={{
            maxHeight: '30rem',
            overflowY: 'auto',
            scrollbarWidth: 'none',
          }}>
          <CardHeader sx={{height:'4.75rem'}} title="Missões Concluídas"/>
          {userInfo && userInfo?.completedMissions.map((mission:any) => (
            <ProfileMission key={mission.id} mission={mission} />
          ))}
          </Card>
          
        </Stack>
      </Grid>
    </Grid>
  );
}
