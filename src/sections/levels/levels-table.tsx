'use client'

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Box, Stack, Table, Tooltip, TableRow, TableBody, TableCell, IconButton, Typography, TableContainer } from "@mui/material";

import { useResponsive } from "src/hooks/use-responsive";

import { getBorderColor } from "src/utils/getBorderColor";

import { Level, LevelsList } from "src/app/contexts/levels/types";

import Image from 'src/components/image';
import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import { useTable, emptyRows, getComparator, TableEmptyRows, TableHeadCustom, TableSelectedAction } from "src/components/table";

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
      { id: 'badgePointsRequirements', label: 'Requisitos Gerais', align: 'center' },
      { id: 'badgeHardRequirements', label: 'Conquistas de Hard Skill', align: 'center' },
      { id: 'badgeSoftRequirements', label: 'Conquistas de Soft Skill', align: 'center' },
      { id: 'options', label: '', align: 'center' },
    ]:[
      { id: 'level', label: 'Nível', align: 'left' },
      { id: 'badgePointsRequirements', label: 'Requisitos Gerais', align: 'center' },
      { id: 'badgeHardRequirements', label: 'Conquistas de Hard Skill', align: 'center' },
      { id: 'badgeSoftRequirements', label: 'Conquistas de Soft Skill', align: 'center' },
      { id: 'options', label: '', align: 'center' },
  ]

  const [tableData, setTableData] = useState<RowDataType[]>([]);

  useEffect(() => {
    if(!isLoading && data){
      setTableData(data);
    }
  }, [isLoading, data]);

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
                          <Typography variant="subtitle2">{row.xpRequired} </Typography>
                          <Typography variant="subtitle2" sx={{color:'secondary.main'}}>Exp</Typography>
                        </Box>
                          {row.specificBadge && <Box sx={{display: 'flex', alignItems:'center', gap: '4px'}}>
                          <Stack key={row.specificBadge.id} direction="row" spacing="1rem">
                            <Box padding={0} sx={{borderRadius: '15%', outline: `3px solid ${getBorderColor(row.specificBadge.classification)}`}}>
                              <Image src={row.specificBadge.imageUrl || ''} sx={{ width: 24, height: 24, borderRadius: '15%'}} />
                            </Box>
                            <Typography variant='body2'>{row.specificBadge.title}</Typography>            
                          </Stack>
                          </Box>}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display='flex' flexDirection='column' alignItems='center' gap='0.5rem'>
                        <Box sx={{display: 'flex', alignItems:'center', gap: '4px'}}>
                          <Typography variant="subtitle2">{row.goldHardSkills} </Typography>
                          <Typography variant="subtitle2" sx={{color:'secondary.main'}}>Badges Ouro HardSkill</Typography>
                        </Box>
                        <Box sx={{display: 'flex', alignItems:'center', gap: '4px'}}>
                          <Typography variant="subtitle2">{row.silverHardSkills} </Typography>
                          <Typography variant="subtitle2" sx={{color:'secondary.main'}}>Badges Prata HardSkill</Typography>
                        </Box>
                        <Box sx={{display: 'flex', alignItems:'center', gap: '4px'}}>
                          <Typography variant="subtitle2">{row.hardSkillsBadges} </Typography>
                          <Typography variant="subtitle2" sx={{color:'secondary.main'}}>Badges Totais de HardSkill</Typography>
                        </Box>
                        
                      </Box>
                      </TableCell>
                      <TableCell align="center">
                      <Box display='flex' flexDirection='column' alignItems='center' gap='0.5rem'>
                          <Box sx={{display: 'flex', alignItems:'center', gap: '4px'}}>
                              <Typography variant="subtitle2">{row.goldSoftSkills} </Typography>
                              <Typography variant="subtitle2" sx={{color:'secondary.main'}}>Badges Ouro SoftSkill</Typography>
                            </Box>
                            <Box sx={{display: 'flex', alignItems:'center', gap: '4px'}}>
                              <Typography variant="subtitle2">{row.silverSoftSkills} </Typography>
                              <Typography variant="subtitle2" sx={{color:'secondary.main'}}>Badges Prata SoftSkill</Typography>
                            </Box>
                            <Box sx={{display: 'flex', alignItems:'center', gap: '4px'}}>
                              <Typography variant="subtitle2">{row.softSkillsBadges} </Typography>
                              <Typography variant="subtitle2" sx={{color:'secondary.main'}}>Badges Totais de SoftSkill</Typography>
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