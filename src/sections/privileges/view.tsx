'use client';

import { useState, useEffect } from 'react';

import { Box } from '@mui/material';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { useResponsive } from 'src/hooks/use-responsive';
import { usePrivilegesContext } from 'src/hooks/use-privileges-context';

import { Privilege } from 'src/app/contexts/privileges/types';

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

import OptionsPopover from './components/options-popover';
import PrivilegesModal from './components/privileges-form-modal';
import PrivilegeUserModal from './components/privilege-user-modal';

type RowDataType = Privilege;

// ----------------------------------------------------------------------

export default function PrivilegesView() {
  const table = useTable({
    defaultOrderBy: 'name',
    defaultRowsPerPage: 100
  });

  const isMobile = useResponsive('down', 'sm');

  const TABLE_HEAD = isMobile ? [
      { id: 'title', label: 'Privilégios', align: 'left' },
      { id: 'id',  label: '', align: 'right' }
    ]:[
      { id: 'title', label: 'Privilégios', align: 'left' },
      { id: 'requirements', label: 'Requisitos necessários', align: 'center' },
      { id: 'earnedBY', label: 'Conquistaram', align: 'center' },
      { id: 'id',  label: '', align: 'right' }
    ]

  const { data, isLoading } = usePrivilegesContext();

  const [tableData, setTableData] = useState<RowDataType[]>([]);

  useEffect(() => {
    if(!isLoading ){
      setTableData(data.privileges);
    } 
  }, [isLoading, data]);


  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
  });

  return (
    <Box marginTop="1.625rem" borderRadius="1rem" bgcolor="background.default">
      <Stack  direction="row" alignItems="center" gap="0.625rem" sx={{ p: 3 }}>
        <Typography padding="0 15px" variant="h6">Privilégios ({!isLoading && data.privilegesCount})</Typography>
        <PrivilegesModal />
      </Stack>

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
              sx={{alignItems: 'center', textWrap: 'nowrap'}}
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
                  >
                    <TableCell>
                      <Box display="flex" flexDirection="row" alignItems="center" gap="1rem">
                        <Box> 
                          <PrivilegeUserModal privilege={row} />
                          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                            {row.description}
                          </Typography>
                        </Box>
                      </Box>       
                    </TableCell>
                    {!isMobile && 
                    <>                              
                     <TableCell align="center" sx={{padding: '0rem 2.8125rem', width: '8.75rem'}}>
                        <Box display="flex" flexDirection="column" alignItems="center" gap="0.5rem">
                         <Box display="flex">
                            <ul style={{padding: '0'}}>
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

                                <li>
                                  <Box sx={{display: 'flex', alignItems:'center', gap: '4px'}}>
                                    <Typography variant="subtitle2"> {row.requiredBadge ? 1: 0}</Typography>
                                    <Typography variant="subtitle2" sx={{color:'secondary.main'}}>Badge</Typography>
                                  </Box>
                                </li>

                            </ul>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{width:'8.125rem'}}>{row.users.length}</TableCell>
                    </>}       
                    <TableCell align="right" sx={{width:'4.375rem'}}>
                      <OptionsPopover privilege={row}/>
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
