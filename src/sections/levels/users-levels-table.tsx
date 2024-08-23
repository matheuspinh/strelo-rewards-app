'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Box, Avatar, Button } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { useResponsive } from 'src/hooks/use-responsive';
import { useUsersContext } from 'src/hooks/use-users-context';

import { User, UsersList } from 'src/app/contexts/users/types';

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
import { useRouter, useSearchParams } from "next/navigation";
import OptionsPopover from './components/user-modal-options-popover';
import { Level, LevelsList } from 'src/app/contexts/levels/types';

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
      { id: 'progress', label: 'Progresso ao próximo Nível', align: 'right' },
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

  const getNextLevel = (currentLevelId: string | null) => {
    return levels.find(level => level.previousLevelId === currentLevelId)
  }

  const getProgress = (user: User, nextLevel: Level | undefined) => {
    if(!nextLevel) return {
      softSkillsProgress: user.badges.filter(badge => badge.skillType === 'softskill').length,
      hardSkillsProgress: user.badges.filter(badge => badge.skillType === 'hardskill').length,
      expProgress: user.xp,
      eligibleForLevelUp: true
     }

     const softSkillBadges = user.badges.filter(badge => badge.skillType === 'softskill')
     const hardSkillBadges = user.badges.filter(badge => badge.skillType === 'hardskill')
      
    const softSkillsProgress = `${
      softSkillBadges.length}/${nextLevel.softSkillsBadges    
    }`
    const hardSkillsProgress = `${
      hardSkillBadges.length}/${nextLevel.hardSkillsBadges    
    }`
    const expProgress = `${user.xp}/${nextLevel.xpRequired}`

    const eligibleForLevelUp = softSkillBadges.length >= nextLevel.softSkillsBadges && hardSkillBadges.length >= nextLevel.hardSkillsBadges && user.xp >= nextLevel.xpRequired

    return {softSkillsProgress, hardSkillsProgress, expProgress, eligibleForLevelUp}
  }

console.log(data)

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
                    eligibleForLevelUp} = getProgress(row, nextLevel)
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
                      <TableCell align="right" sx={{}}>
                        <Box display='flex' flexDirection='column' alignItems='flex-end' gap='0.5rem'>
                          <Box sx={{display: 'flex', alignItems:'right', gap: '4px'}}>
                            <Typography variant="subtitle2">{`${softSkillsProgress}`} </Typography>
                            <Typography variant="subtitle2" sx={{color:'secondary.main'}}>Conquistas de SoftSkill</Typography>
                          </Box>
                          <Box sx={{display: 'flex', alignItems:'right', gap: '4px'}}>
                            <Typography variant="subtitle2">{hardSkillsProgress} </Typography>
                            <Typography variant="subtitle2" sx={{color:'secondary.main'}}>Conquistas de HardSkill</Typography>
                          </Box>
                          <Box sx={{display: 'flex', alignItems:'right', gap: '4px'}}>
                            <Typography variant="subtitle2">{expProgress} </Typography>
                            <Typography variant="subtitle2" sx={{color:'secondary.main'}}>Experiência</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{width:'auto'}}>
                        {row.currentLevel ? row.currentLevel.title : 'Atribua um nível para esse usuário'}
                      </TableCell>
                      <TableCell>
                        {eligibleForLevelUp && <OptionsPopover user={row} />}
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
