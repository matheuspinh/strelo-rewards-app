'use client'

import { Box, Button, IconButton, LinearProgress, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableRow, Tabs, Tooltip, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import { emptyRows, getComparator, TableEmptyRows, TableHeadCustom, TableSelectedAction, useTable } from "src/components/table";
import { useResponsive } from "src/hooks/use-responsive";
import { useLevelsContext } from "src/hooks/use-levels-context";
import { useEffect, useState } from "react";
import { Level, LevelsList } from "src/app/contexts/levels/types";
import LevelsTable from "../levels-table";
import LevelFormModal from "../components/level-modal";
import TabContext from '@mui/lab/TabContext';
import { TabList, TabPanel } from "@mui/lab";
import UsersLevelTable from "../users-levels-table";
import { useUsersContext } from "src/hooks/use-users-context";
import UserLevelModal from "../components/user-level-modal";

type RowDataType = Level

export default function LevelViews() {
  const table = useTable({
    defaultOrderBy: 'name',
    defaultRowsPerPage: 100
  });
  const [value, setValue] = useState('1');

  const isMobile = useResponsive('down', 'sm');

  const {data, isLoading} = useLevelsContext();

  const {data: usersData, isLoading: usersIsLoading} = useUsersContext();

  const [tableData, setTableData] = useState<RowDataType[]>([]);

  const getColor = (completionPercentage: number) => {
    if (completionPercentage < 40) return 'error';
    if (completionPercentage < 70) return 'warning';
    return 'success';
  };

  useEffect(() => {
    if(!isLoading && data){
      setTableData(data);
    }
  }, [isLoading, data]);

  // const handleOpenModal = () =>{
  //   router.push('?level-modal=open', undefined)
  // }

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  }

  const completion = (completedCount: number, usersCount: number) => Math.ceil((completedCount/usersCount)*100)

  return (
    <Box marginTop="1.625rem" borderRadius="1rem" bgcolor="background.default">
      <Stack  direction="row" alignItems="center" gap="0.625rem" sx={{ p: 3 }}>
        <Typography padding='0 15px' variant="h6">Níveis</Typography>
        <LevelFormModal />
        <UserLevelModal />
      </Stack> 
      <Box sx={{ width:'100%', p:0 }}>
        <TabContext value={value}>
          <TabList onChange={handleChange} sx={{paddingLeft: 4}}>
            <Tab label="Níveis" value='1'/>
            <Tab label="Usuários" value='2'/>
          </TabList>
          <Box sx={{width:'100%'}}>
          <TabPanel value='1' sx={{ p: 0 }}><LevelsTable data={data} isLoading={isLoading} /></TabPanel>
          <TabPanel value='2'sx={{ p: 0 }}><UsersLevelTable levels={data} data={usersData} isLoading={usersIsLoading}/></TabPanel>
          </Box>
        </TabContext>
      </Box>

    </Box>
 )
}
