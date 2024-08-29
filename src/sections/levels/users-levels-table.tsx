'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Box, Avatar } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { ArrowUpward } from '@mui/icons-material';
import TableContainer from '@mui/material/TableContainer';

import { useResponsive } from 'src/hooks/use-responsive';

import { getBorderColor } from 'src/utils/getBorderColor';

import { User, UsersList } from 'src/app/contexts/users/types';
import { Level, LevelsList } from 'src/app/contexts/levels/types';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import {
  useTable,
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
} from 'src/components/table';

import OptionsPopover from './components/user-modal-options-popover';

// ----------------------------------------------------------------------

type RowDataType = User;

// ----------------------------------------------------------------------

export default function UsersLevelTable({levels ,data, isLoading}: {levels: LevelsList, data: UsersList, isLoading: boolean}) {
  const table = useTable({
    defaultOrderBy: 'name',
    defaultRowsPerPage: 100
  });

  const isMobile = useResponsive('down', 'sm');

  const TABLE_HEAD = isMobile ? [
      { id: 'name', label: 'Usuário e ID', align: 'left' },
      { id: 'currentLevel', label: 'Nível', align: 'right' },
      { id: 'id',  label: '', align: 'right' }
    ]:[
      { id: 'name', label: 'Usuário e ID', align: 'left' },
      { id: 'progress', label: 'Progresso Geral  ao próximo Nível', align: 'right' },
      { id: 'badgeProgress', label: 'Classificação de Badges ao próximo Nível', align: 'right' },
      { id: 'currentLevel', label: 'Nível', align: 'right' },
      { id: 'id',  label: '', align: 'right' }
    ]

  const [tableData, setTableData] = useState<RowDataType[]>([]);
  const router = useRouter()


  const handleLevelUp = () =>{
    router.push('?level-user-modal=open&level=', undefined)
  }

  useEffect(() => {
    if(!isLoading ){
      setTableData(data.users);
    } 
  }, [isLoading, data]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
  })


  const getNextLevel = (currentLevelId: string | null) => levels.find(level => level.previousLevelId === currentLevelId)

  const getProgress = (user: User, nextLevel: Level | undefined) => {
    if(!nextLevel) return {
      softSkillsProgress: user.badges.filter(badge => badge.skillType === 'softskill').length,
      hardSkillsProgress: user.badges.filter(badge => badge.skillType === 'hardskill').length,
      goldHardSkillsProgress: user.badges.filter(badge => badge.classification === 'gold').length,
      silverHardSkillsProgress: user.badges.filter(badge => badge.classification === 'silver').length,
      goldSoftSkillsProgress: user.badges.filter(badge => badge.classification === 'gold').length,
      silverSoftSkillsProgress: user.badges.filter(badge => badge.classification === 'silver').length,
      expProgress: user.xp,
      specificBadgeProgress: undefined,
      eligibleForLevelUp: true
    }


    const softSkillBadges = user.badges.filter(badge => badge.skillType === 'softskill')
    const hardSkillBadges = user.badges.filter(badge => badge.skillType === 'hardskill')
    const goldHardSkills = hardSkillBadges.filter(badge => badge.classification === 'gold')
    const silverHardSkills = hardSkillBadges.filter(badge => badge.classification === 'silver')
    const goldSoftSkills = softSkillBadges.filter(badge => badge.classification === 'gold')
    const silverSoftSkills = softSkillBadges.filter(badge => badge.classification === 'silver')
    const specificBadge = nextLevel.specificBadgeId ? nextLevel.specificBadge : undefined
      
    const specificBadgeProgress = specificBadge && user.badges.findIndex(badge => badge.id === specificBadge.id)

    const softSkillsProgress = `${
      softSkillBadges.length}/${nextLevel.softSkillsBadges    
    }`
    const hardSkillsProgress = `${
      hardSkillBadges.length}/${nextLevel.hardSkillsBadges    
    }`
    const goldHardSkillsProgress = `${
      goldHardSkills.length}/${nextLevel.goldHardSkills    
    }`
    const silverHardSkillsProgress = `${
      silverHardSkills.length}/${nextLevel.silverHardSkills    
    }`
    const goldSoftSkillsProgress = `${
      goldSoftSkills.length}/${nextLevel.goldSoftSkills    
    }`
    const silverSoftSkillsProgress = `${
      silverSoftSkills.length}/${nextLevel.silverSoftSkills    
    }`
    const expProgress = `${user.xp}/${nextLevel.xpRequired}`

    const eligibleForLevelUp =
    softSkillBadges.length >= nextLevel.softSkillsBadges &&
    hardSkillBadges.length >= nextLevel.hardSkillsBadges &&
    user.xp >= nextLevel.xpRequired &&
    goldHardSkills.length >= nextLevel.goldHardSkills &&
    silverHardSkills.length >= nextLevel.silverHardSkills &&
    goldSoftSkills.length >= nextLevel.goldSoftSkills &&
    silverSoftSkills.length >= nextLevel.silverSoftSkills

    return {softSkillsProgress, hardSkillsProgress, expProgress, eligibleForLevelUp, silverHardSkillsProgress, goldHardSkillsProgress, silverSoftSkillsProgress, goldSoftSkillsProgress, specificBadge, specificBadgeProgress}
  }

  return (
      <TableContainer sx={{ position: 'relative', borderRadius: '1rem', overflow: 'unset', boxShadow: '0px 12px 24px 0px #919EAB1F' }}>
        <TableSelectedAction
          numSelected={table.selected.length}
          rowCount={tableData.length}
          onSelectAllRows={(checked) =>
            table.onSelectAllRows(
              checked,
              tableData.map((row) => row.id)
            )
          }
          action={
            <Tooltip title="Delete">
              <IconButton color="primary">
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
          }
        />

        <Scrollbar>
          <Table size="medium">
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              sx={{alignItems: 'center' }}
            />

            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => {
                  const nextLevel = getNextLevel(row.currentLevel?.id)
                  const {
                    softSkillsProgress,
                    hardSkillsProgress,
                    expProgress,
                    eligibleForLevelUp,
                    goldHardSkillsProgress,
                    silverHardSkillsProgress,
                    goldSoftSkillsProgress,
                    silverSoftSkillsProgress,
                    specificBadge,
                    specificBadgeProgress
                  } = getProgress(row, nextLevel)
                  return (
                  <TableRow
                    hover
                    key={row.id}
                  >
                    <TableCell>
                      <Link style={{textDecoration:'none', color:'black'}} href={`/dashboard/users/${row.id}`}>
                      <Box display="flex" flexDirection="row" alignItems="center" gap="1rem">
                        <Avatar src={row.avatarUrl} />
                        <Box> 
                          <Typography variant="subtitle2" noWrap>
                            {row.username}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                          {row.currentLevel ? row.currentLevel.title : 'Atribua um nível para esse usuário'}
                          </Typography>
                        </Box>
                      </Box>
                      </Link>       
                    </TableCell>
                    {!isMobile && 
                    <>                              
                      <TableCell align="right">
                        <Box display='flex' flexDirection='column' alignItems='flex-end' gap='0.5rem'>
                          <Box sx={{display: 'flex', alignItems:'right', gap: '4px'}}>
                            <Typography variant="subtitle2">{`${softSkillsProgress}`} </Typography>
                            <Typography variant="subtitle2" sx={{color:'secondary.main'}}>Badges de SoftSkill</Typography>
                          </Box>
                          <Box sx={{display: 'flex', alignItems:'right', gap: '4px'}}>
                            <Typography variant="subtitle2">{hardSkillsProgress} </Typography>
                            <Typography variant="subtitle2" sx={{color:'secondary.main'}}>Badges de HardSkill</Typography>
                          </Box>
                          <Box sx={{display: 'flex', alignItems:'right', gap: '4px'}}>
                            <Typography variant="subtitle2">{expProgress} </Typography>
                            <Typography variant="subtitle2" sx={{color:'secondary.main'}}>Experiência</Typography>
                          </Box>
                          {specificBadge && <Box sx={{display: 'flex', alignItems:'center', gap: '4px',
                            ...(specificBadgeProgress === -1 && {filter: 'grayscale(50%)',
                              opacity: 0.5})
                          }}>
                          <Stack key={specificBadge.id} direction="row" spacing="1rem">
                            <Box padding={0} sx={{ borderRadius: '15%', outline: `3px solid 
                              ${getBorderColor(specificBadge.classification)}`}}>
                              <Image src={specificBadge.imageUrl || ''} sx={{ width: 24, height: 24, borderRadius: '15%'}} />
                            </Box>
                            <Typography variant='subtitle2'>{specificBadge.title}</Typography>            
                          </Stack>
                          </Box>}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                      <Box display='flex' flexDirection='column' alignItems='flex-end' gap='0.5rem'>
                          <Box sx={{display: 'flex', alignItems:'right', gap: '4px'}}>
                            <Typography variant="subtitle2">{`${goldHardSkillsProgress}`} </Typography>
                            <Typography variant="subtitle2" sx={{color:'secondary.main'}}>Badges Ouro de Hard Skills</Typography>
                          </Box>
                          <Box sx={{display: 'flex', alignItems:'right', gap: '4px'}}>
                            <Typography variant="subtitle2">{`${silverHardSkillsProgress}`} </Typography>
                            <Typography variant="subtitle2" sx={{color:'secondary.main'}}>Badges Prata de Hard Skills</Typography>
                          </Box>
                          <Box sx={{display: 'flex', alignItems:'right', gap: '4px'}}>
                            <Typography variant="subtitle2">{`${goldSoftSkillsProgress}`} </Typography>
                            <Typography variant="subtitle2" sx={{color:'secondary.main'}}>Badges Ouro de Soft Skills</Typography>
                          </Box>
                          <Box sx={{display: 'flex', alignItems:'right', gap: '4px'}}>
                            <Typography variant="subtitle2">{`${silverSoftSkillsProgress}`} </Typography>
                            <Typography variant="subtitle2" sx={{color:'secondary.main'}}>Badges Prata de Soft Skills</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{width:'auto'}}>
                        {row.currentLevel ? row.currentLevel.title : 'Atribua um nível para esse usuário'}
                      </TableCell>
                      <TableCell>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <OptionsPopover user={row} />
                        {eligibleForLevelUp && <ArrowUpward color='primary' onClick={handleLevelUp}/>}
                        </Box>
                      </TableCell>
                    </>}       
                   
                  </TableRow>
                )})}

              <TableEmptyRows
                emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
              />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
}: {
  inputData: RowDataType[];
  comparator: (a: any, b: any) => number;
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);

    if (order !== 0) return order;

    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}
