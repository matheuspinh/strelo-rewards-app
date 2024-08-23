'use client'

import { Box, Button, IconButton, LinearProgress, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import { emptyRows, getComparator, TableEmptyRows, TableHeadCustom, TableSelectedAction, useTable } from "src/components/table";
import { useResponsive } from "src/hooks/use-responsive";
import { useEffect, useState } from "react";
import { Level, LevelsList } from "src/app/contexts/levels/types";
import OptionsPopover from "./components/level-modal-options-popover";

type RowDataType = Level

export default function LevelsTable({data, isLoading}: {data: LevelsList, isLoading: boolean}) {
  const table = useTable({
    defaultOrderBy: 'name',
    defaultRowsPerPage: 100
  });
  const router = useRouter()

  const isMobile = useResponsive('down', 'sm');

  const TABLE_HEAD = isMobile ? [
    { id: 'level', label: 'Nível', align: 'left' },
      { id: 'badgePointsRequirements', label: 'Skills Necessárias', align: 'center' },
      { id: 'xpRequirements', label: 'Exp Necessária', align: 'center' },
      { id: 'options', label: '', align: 'center' },
    ]:[
      { id: 'level', label: 'Nível', align: 'left' },
      { id: 'badgePointsRequirements', label: 'Skills Necessárias', align: 'center' },
      { id: 'xpRequirements', label: 'Exp Necessária', align: 'center' },
      { id: 'options', label: '', align: 'center' },
  ]

  const [tableData, setTableData] = useState<RowDataType[]>([]);

  useEffect(() => {
    if(!isLoading && data){
      setTableData(data);
    }
  }, [isLoading, data]);

  const completion = (completedCount: number, usersCount: number) => Math.ceil((completedCount/usersCount)*100)

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
  });
  return (

      <TableContainer sx={{ borderRadius:'1rem', position: 'relative', overflow: 'unset', boxShadow: '0px 12px 24px 0px #919EAB1F' }}>
      <TableSelectedAction
          numSelected={table.selected.length}
          rowCount={tableData.length}
          onSelectAllRows={(checked) =>
            table.onSelectAllRows(
              checked,
              tableData.map((row) => row.id.toString())
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
                          <Typography variant="subtitle2" noWrap>
                            {row.title}
                          </Typography>
                      </Box>       
                    </TableCell>   
                    <TableCell align="center">
                      <Box display='flex' flexDirection='column' alignItems='center' gap='0.5rem'>
                          <Box sx={{display: 'flex', alignItems:'center', gap: '4px'}}>
                              <Typography variant="subtitle2">{row.softSkillsBadges} </Typography>
                              <Typography variant="subtitle2" sx={{color:'secondary.main'}}>Pontos de SoftSkill</Typography>
                            </Box>
                            <Box sx={{display: 'flex', alignItems:'center', gap: '4px'}}>
                              <Typography variant="subtitle2">{row.hardSkillsBadges} </Typography>
                              <Typography variant="subtitle2" sx={{color:'secondary.main'}}>Pontos de HardSkill</Typography>
                            </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display='flex' flexDirection='column' alignItems='center' gap='0.5rem'>
                          <Box sx={{display: 'flex', alignItems:'center', gap: '4px'}}>
                              <Typography variant="subtitle2">{row.xpRequired} </Typography>
                              <Typography variant="subtitle2" sx={{color:'secondary.main'}}>Exp</Typography>
                            </Box>
                      </Box>
                      </TableCell>
                      <TableCell align="center">
                        <OptionsPopover level={row}/>
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
 )
}

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