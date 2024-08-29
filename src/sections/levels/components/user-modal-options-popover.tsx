import { m } from "framer-motion";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Stack, MenuItem, IconButton } from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useBoolean } from "src/hooks/use-boolean";

import { User } from "src/app/contexts/users/types";

import { varHover } from "src/components/animate";
import { usePopover } from "src/components/custom-popover";
import CustomPopover from "src/components/custom-popover/custom-popover";

const OPTIONS = [
  {
    label: 'Editar',
    linkTo: '/',
  }
]

export default function OptionsPopover({user}: {user:User}) {
  const router = useRouter();
  const popover = usePopover()

  const confirmDelete = useBoolean()

  const handleClosePopover = () => {
    popover.onClose()
    confirmDelete.onFalse()
    
  }
  
  const handleLevelUp = () =>{
    router.push(`?level-user-modal=open&user=${user.id}`, undefined)
    handleClosePopover()
  }

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          background: 
          (popover.open && {
            background: (theme) => theme.palette.grey[100],
          }),
        }}
      >
        <MoreVertIcon />
      </IconButton>

      <CustomPopover open={popover.open} onClose={handleClosePopover} sx={{ width: 200, p: 0 }}>
        <Stack sx={{ p: 1 }}>

            <MenuItem onClick={handleLevelUp}>
              Promover Usuário
            </MenuItem>

        </Stack>
        
      </CustomPopover>
    </>
  )
}