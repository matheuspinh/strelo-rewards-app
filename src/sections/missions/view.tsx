'use client';

import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useSettingsContext } from 'src/components/settings';
import { Avatar, IconButton, LinearProgress, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip } from '@mui/material';
import Scrollbar from 'src/components/scrollbar';
import { emptyRows, getComparator, TableEmptyRows, TableHeadCustom, TableSelectedAction, useTable } from 'src/components/table';
import OptionsPopover from './components/options-popover';
import Iconify from 'src/components/iconify';
import { useEffect, useState } from 'react';
import { useResponsive } from 'src/hooks/use-responsive';
import { id } from 'date-fns/locale';
import { set } from 'nprogress';
import Image from 'src/components/image';
import MissionFormModal from './components/mission-form-modal';
import { useMissionsContext } from 'src/hooks/use-missions-context';
import { Mission } from 'src/app/contexts/missions/types';


//

type RowDataType = Mission;

const tableMock = [
  { 
    id: 1,
    mission: 'Missão 1',
    description: 'Descrição da missão 1',
    gold: 100,
    xp: 100,
    badgesCount: 1,
    completedCount: 34,
    usersCount: 300,
    image: 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg',
  },
  { 
    id: 2,
    mission: 'Missão 1',
    description: 'Descrição da missão 1',
    gold: 100,
    xp: 100,
    badgesCount: 1,
    completedCount: 50,
    usersCount: 100,
    image: 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg',
  },
  { 
    id: 3,
    mission: 'Missão 1',
    description: 'Descrição da missão 1',
    gold: 100,
    xp: 100,
    badgesCount: 1,
    completedCount: 70,
    usersCount: 100,
    image: 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg',
  }
]

const TABLE_HEAD = [
  { id: 'name', label: 'Usuário e ID', align: 'left' },
  { id: 'gold', label: 'Moedas', align: 'right' },
  { id: 'xp', label: 'Experiência', align: 'right' },
  { id: 'id',  label: '', align: 'right' }, 
];
// ----------------------------------------------------------------------

export default function MissionViews() {
  const table = useTable({
    defaultOrderBy: 'name',
    defaultRowsPerPage: 100
  });

  const isMobile = useResponsive('down', 'sm');

  const TABLE_HEAD = isMobile ? [
      { id: 'mission', label: 'Missão', align: 'left' },
      { id: 'id',  label: '', align: 'center' } 
    ]:[
      { id: 'mission', label: 'Missão', align: 'left' },
      { id: 'rewards', label: 'Premiação', align: 'center' },
      { id: 'completed', label: 'Completaram', align: 'center' },
      { id: 'id',  label: '', align: 'center' }
    ]

  const {data, isLoading} = useMissionsContext()

  const [tableData, setTableData] = useState<RowDataType[]>([]);

  useEffect(() => {
    !isLoading && data && setTableData(data.missions);
  }, [isLoading, data]);

  const completion = (completedCount: number, usersCount: number) => {
    return Math.ceil((completedCount/usersCount)*100);
  }

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
  });

  return (
    <>
    
    <Box marginTop={'1.625rem'} borderRadius={'1rem'} bgcolor={'background.default'}>
    <Stack  direction="row" alignItems="center" gap={'0.625rem'} sx={{ p: 3 }}>
      <Typography padding={'0 15px'} variant="h6">Missões ({!isLoading && data.missionCount})</Typography>
      <MissionFormModal />
    </Stack>  
      <TableContainer sx={{ borderRadius:'1rem', position: 'relative', overflow: 'unset', boxShadow: '0px 12px 24px 0px #919EAB1F' }}>
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
          <Table size={'medium'}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              sx={{alignItems: 'center'}}
              
            />

            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => (
                  <TableRow
                    hover
                    key={row.id}
                    onClick={() => console.log('soon')}
                  >
                    <TableCell sx={{padding: '1rem'}}>
                      <Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={'1rem'}>
                        <Image width={'4rem'} height={'4rem'} borderRadius={'0.75rem'} src={row.imageUrl}/>
                        <Box> 
                          <Typography variant="subtitle2" noWrap>
                            {row.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                            {row.description}
                          </Typography>
                        </Box>
                      </Box>       
                    </TableCell>
                    {!isMobile && 
                    <>                              
                      <TableCell align="right" sx={{padding: '0rem 2.8125rem', width: '8.75rem'}}>
                        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} gap={'0.5rem'}>
                         <Box display={'flex'}>
                            <ul>
                              <li>
                                <Box sx={{display: 'flex', alignItems:'center', gap: '4px'}}>
                                  <Typography variant="subtitle2">{row.gold} </Typography>
                                  <Typography variant="subtitle2" sx={{color:'secondary.main'}}>Gold</Typography>
                                </Box>
                              </li>
                              <li>
                                <Box sx={{display: 'flex', alignItems:'center', gap: '4px'}}>
                                  <Typography variant="subtitle2">{row.xp} </Typography>
                                  <Typography variant="subtitle2" sx={{color:'secondary.main'}}>Exp</Typography>
                                </Box>
                              </li>
                              {row.badgesCount > 0 &&
                                <li>
                                  <Box sx={{display: 'flex', alignItems:'center', gap: '4px'}}>
                                    <Typography variant="subtitle2">{row.badgesCount} </Typography>
                                    <Typography variant="subtitle2" sx={{color:'secondary.main'}}>Badges</Typography>
                                  </Box>
                                </li>
                              }
                            </ul>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ padding: '0rem 1rem', width:'10rem'}}>
                        <LinearProgress color={
                          completion(row.completedBy.length, row.users.length) <40? 'error':
                          completion(row.completedBy.length, row.users.length) <70? 'warning':
                          'success'
                        } sx={{width: '5rem', height: '0.5rem'}} variant='determinate' value={completion(row.completedBy.length, row.users.length)}/>
                        <Typography sx={{fontSize:'12px', fontWeight: '400', color:'secondary.main'}} marginTop='0.5rem' align='left'>
                          {row.completedBy.length}/{row.users.length}{'  '}
                          ({completion(row.completedBy.length, row.users.length)}%)
                        </Typography>
                      </TableCell>
                    </>}       
                    <TableCell align="right" sx={{width:'4.25rem'}}>
                      <OptionsPopover mission={row}/>
                    </TableCell>
                      
                  </TableRow>
                ))}

              <TableEmptyRows
                emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
              />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Box>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
}: {
  inputData: any[];
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