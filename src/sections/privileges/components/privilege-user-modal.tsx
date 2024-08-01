import { useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Box, Dialog, useTheme, Typography, dialogClasses, TableContainer, Table, TableBody, TableRow, TableCell, Stack, Tooltip, IconButton, Avatar } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { useBoolean } from "src/hooks/use-boolean";
import { usePrivilege } from 'src/hooks/use-privilege-detail';
import { Privilege } from 'src/app/contexts/privileges/types';
import Scrollbar from "src/components/scrollbar/scrollbar";
import TableEmptyRows from "src/components/table/table-empty-rows";
import { emptyRows, getComparator } from "src/components/table/utils";
import { TableHeadCustom, TableSelectedAction, useTable } from "src/components/table";
import Iconify from "src/components/iconify/iconify";
import OptionsPopover from "./options-popover";
import { useResponsive } from "src/hooks/use-responsive";

interface RowDataType {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  gold: number;
  xp: number;
}

export default function PrivilegeUserModal({privilege}: {privilege:Privilege}) {
  const table = useTable({
    defaultOrderBy: 'name',
    defaultRowsPerPage: 100
  });
  const router = useRouter()
  const searchParams = useSearchParams();
  const open = useBoolean();
  const modal = searchParams.get('privilege-users');
  const user = searchParams.get('privilege')
  const isMobile = useResponsive('down', 'sm');
  const [tableData, setTableData] = useState<RowDataType[]>([]);
  const {data: privilegeData, isLoading} = usePrivilege(user!);

  const TABLE_HEAD = isMobile ?
  [
    { id: 'title', label: 'Nome e Título', align: 'left' },
    { id: 'progress',  label: 'Progresso', align: 'right' }
  ]:[
    { id: 'title', label: 'Nome e Título', align: 'left' },
    { id: 'progress',  label: 'Progresso', align: 'right' },
    { id: 'id',  label: '', align: 'right' }
  ]

  const theme = useTheme();

  const handleOpenModal = () =>{
    router.push(`?privilege-users=open&privilege=${privilege.id}`, undefined)
  }

  const handleClose = () => {
    router.push('/dashboard/privileges')
  }

  useEffect(() => {
    if(modal === 'open'){
      if(!isLoading && privilegeData){
        setTableData(privilegeData.users)
        console.log(privilegeData.users)
      }
      open.onTrue()
    } else {
      open.onFalse()
    }
  }, [modal, isLoading])
  
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
  });


  const renderButton = (
    <Typography onClick={handleOpenModal} variant="subtitle2" sx={{cursor:'pointer'}}>{privilege.title}</Typography>
  )

  return (
    <>
    {renderButton}

    <Dialog
      open={open.value}
      onClose={handleClose}
      transitionDuration={{
        enter: theme.transitions.duration.shortest,
        exit: 0,
      }}

      PaperProps={{
        sx: {
          mt: 15,
          overflow: 'unset',
          height: 'fit-content',
          width: '30rem',
        },
      }}
      sx={{
        [`& .${dialogClasses.container}`]: {
          alignItems: 'flex-start',
        },
      }}>

<Box marginTop="1.625rem" borderRadius="1rem" bgcolor="background.default">
      <Stack  direction="row" alignItems="center" gap="0.625rem" sx={{ p: 3 }}>
        <Typography padding="0 15px" variant="h6">Usuários ({!isLoading && tableData && tableData.length})</Typography>
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
              {dataFiltered.length === 0 ? 
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="subtitle2" sx={{color: 'text.secondary'}}>Nenhum usuário encontrado</Typography>
                </TableCell>
              </TableRow>
              :dataFiltered
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
                        <Avatar src={row.avatarUrl} sx={{ width: 40, height: 40 }} />
                        <Box> 
                          <Typography variant="subtitle2" > {row.username} </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                            {row.email}
                          </Typography>
                        </Box>
                      </Box>       
                    </TableCell>
                    <>                              
                     <TableCell align="center" sx={{padding: '0rem 2.8125rem', width: '8.75rem'}}>
                        <Box display="flex" flexDirection="column" alignItems="center" gap="0.5rem">
                         <Box display="flex">
                            <ul style={{ listStyleType: 'none' }}>
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
                            </ul>
                          </Box>
                        </Box>
                      </TableCell>
                      {!isMobile &&
                      <TableCell align="right" sx={{width:'4.375rem'}}>
                        <MoreVertIcon/>
                      </TableCell>
                      }      
                    </>                      
                  </TableRow>
                ))}

              <TableEmptyRows
                emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
              />
            </TableBody>
          </Table>
      </TableContainer>
    </Box>
      </Dialog>
      </>
  )
}

//------------------------------
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