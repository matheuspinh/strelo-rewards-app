'use client';

import { useState, useEffect } from 'react';

import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Box, Avatar } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { useResponsive } from 'src/hooks/use-responsive';
import { useUsersContext } from 'src/hooks/use-users-context';

import { User } from 'src/app/contexts/users/types';

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

import UserFormModal from './components/user-form-modal';
import OptionsPopover from './components/options-popover';

// ----------------------------------------------------------------------

type RowDataType = User;

// ----------------------------------------------------------------------

export default function UserView() {
  const table = useTable({
    defaultOrderBy: 'name',
    defaultRowsPerPage: 100
  });

  const isMobile = useResponsive('down', 'sm');

  const TABLE_HEAD = isMobile ? [
      { id: 'name', label: 'Usuário e ID', align: 'left' },
      { id: 'id',  label: '', align: 'right' }
    ]:[
      { id: 'name', label: 'Usuário e ID', align: 'left' },
      { id: 'gold', label: 'Moedas', align: 'right' },
      { id: 'xp', label: 'Experiência', align: 'right' },
      { id: 'id',  label: '', align: 'right' }
    ]

  const {data, isLoading} = useUsersContext()

  const [tableData, setTableData] = useState<RowDataType[]>([]);

  useEffect(() => {
    if(!isLoading ){
      setTableData(data.users);
    } 
  }, [isLoading, data]);


  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
  });

  return (
    <Box marginTop="1.625rem" borderRadius="1rem" bgcolor="background.default">
      <Stack  direction="row" alignItems="center" gap="0.625rem" sx={{ p: 3 }}>
        <Typography padding="0 15px" variant="h6">Usuários ({!isLoading && data.userCount})</Typography>
        <UserFormModal />
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
              sx={{alignItems: 'center' }}
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
                    <TableCell>
                      <Box display="flex" flexDirection="row" alignItems="center" gap="1rem">
                        <Avatar src={row.avatarUrl} />
                        <Box> 
                          <Typography variant="subtitle2" noWrap>
                            {row.username}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                            {row.email}
                          </Typography>
                        </Box>
                      </Box>       
                    </TableCell>
                    {!isMobile && 
                    <>                              
                      <TableCell align="right" sx={{width:'8.125rem'}}>{row.gold}</TableCell>
                      <TableCell align="right" sx={{width:'8.125rem'}}>{row.xp}</TableCell>
                    </>}       
                    <TableCell align="right" sx={{width:'4.375rem'}}>
                      <OptionsPopover user={row}/>
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
