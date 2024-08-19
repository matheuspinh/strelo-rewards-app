'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Stack, Table, Tooltip, TableRow, TableBody, TableCell, IconButton, TableContainer } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';
import { useBadgesContext } from 'src/hooks/use-badges-context';

import { Badge } from 'src/app/contexts/badges/types';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useTable, emptyRows, getComparator, TableEmptyRows, TableHeadCustom, TableSelectedAction } from 'src/components/table';

import OptionsPopover from './components/options-popover';
import BadgesFormModal from './components/badges-form-modal';


//

type RowDataType = Badge;

export default function BadgesView() {
  const table = useTable({
    defaultOrderBy: 'name',
    defaultRowsPerPage: 100
  });

  const isMobile = useResponsive('down', 'sm');

  const TABLE_HEAD = isMobile ? [
      { id: 'badges', label: 'Conquistas', align: 'left' },
      { id: 'id',  label: '', align: 'center' } 
    ]:[
      { id: 'badges', label: 'Conquistas', align: 'left' },
      { id: 'earnedCount', label: 'Conquistaram', align: 'center' },
      { id: 'id',  label: '', align: 'center' }
    ]

  const {data, isLoading} = useBadgesContext()

  const [tableData, setTableData] = useState<RowDataType[]>([]);

  useEffect(() => {
    if(!isLoading && data){
      setTableData(data.badges);
    }
  }, [isLoading, data]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
  });

  return (
    <Box marginTop="1.625rem" borderRadius="1rem" bgcolor="background.default">
    <Stack  direction="row" alignItems="center" gap="0.625rem" sx={{ p: 3 }}>
      <Typography padding='0 15px' variant="h6">Conquistas ({!isLoading && data && data.badgesCount})</Typography>
      <BadgesFormModal />
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
          <Table size="medium">
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
                    onClick={(e) => e.stopPropagation()}
                  >
                    <TableCell sx={{padding: '1rem'}}>
                      <Box display="flex" flexDirection="row" alignItems="center" gap="1rem">
                        <Image width="4rem" height="4rem" borderRadius="0.75rem" src={row.imageUrl}/>
                        <Box> 
                          <Typography color={row.classification} variant="subtitle2" noWrap>
                            {row.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                            {row.description}
                          </Typography>
                        </Box>
                      </Box>       
                    </TableCell>
                    {!isMobile && 
                    <TableCell align="center" sx={{padding: '0rem 2.8125rem', width: '8.75rem'}}>
                        {row.earnedBy.length}
                      </TableCell>}       
                    <TableCell align="right" sx={{width:'4.25rem'}}>
                      <OptionsPopover badge={row}/>
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