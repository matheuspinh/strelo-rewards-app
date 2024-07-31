import { m } from "framer-motion";

import { Close } from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Stack, MenuItem, IconButton } from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useBoolean } from "src/hooks/use-boolean";
import { useBadgesContext } from "src/hooks/use-badges-context";

import { Badge } from "src/app/contexts/badges/types";

import { varHover } from "src/components/animate";
import { usePopover } from "src/components/custom-popover";
import CustomPopover from "src/components/custom-popover/custom-popover";

const OPTIONS = [
  {
    label: 'Editar',
    linkTo: '/',
  }
]

export default function OptionsPopover({badge}: {badge:Badge}) {
  const router = useRouter();
  const popover = usePopover()

  const confirmDelete = useBoolean()
  const editBadge = useBoolean()
  const {deleteBadge} = useBadgesContext()

  const handleDelete = async () => {
    await deleteBadge(badge.id)
    confirmDelete.onFalse()
    popover.onClose()
  }

  const handleClosePopover = () => {
    popover.onClose()
    confirmDelete.onFalse()
    
  }

  const handleEdit = () => {
    router.push(`?badge-modal=open&edit=${badge.id}`, undefined)
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
          
            <MenuItem onClick={handleEdit}>
              Editar
            </MenuItem>
  
          {confirmDelete.value ? 
          (<MenuItem
            sx={{ gap:'0.5rem', display: 'flex', alignItems:'center', flexDirection: 'row' ,fontWeight: 'fontWeightBold', color: 'error.main' }}
          >   
              <Box onClick={handleDelete}>
              Confirmar Exclusão
              </Box>
              <Box 
                display="inline-flex" 
                alignItems="center" 
                sx={{
                  border: '1px solid', 
                  borderRadius: '5px', 
                  '&:hover': {
                    backgroundColor: 'error.lighter'
                  },
                  width: '22px'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  confirmDelete.onFalse()
                }}
              >
              <Close fontSize="small"  />
            </Box>
          </MenuItem>) :
          (<MenuItem onClick={confirmDelete.onTrue}
            sx={{ fontWeight: 'fontWeightBold', color: 'error.main' }}
          >
            Excluir
          </MenuItem>)
          }
        </Stack>
        
      </CustomPopover>
    </>
  )
}