import { useState, useCallback, useEffect } from 'react'
import axios from 'axios'

import TableHeader from 'src/views/apps/user/list/TableHeader'
import EditCharge from './EditCharge';
import AddCharge from 'src/pages/user/charges/AddCharge';
import { Avatar, Box, Button, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography, useTheme} from '@mui/material';
import { blue } from '@mui/material/colors';
import Icon from 'src/@core/components/icon';
import React from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SidebarAddCharge from 'src/pages/user/charges/AddCharge';
import { capitalizeFirstLetter } from 'src/utilities';

interface Docu {
  _id: string
  name: string
  description: string
}

interface CellType {
  row: Docu
}

function Row(props: { row: Docu }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  
const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState<boolean>(false);
const [userIdToDelete, setUserIdToDelete] = useState<string>('');


const handleDeleteCancelled = () => {
  setIsDeleteConfirmationOpen(false);
};
const handleDelete = (userId: string) => {
  setUserIdToDelete(userId);
  setIsDeleteConfirmationOpen(true);
};

const handleDeleteConfirmed = async () => {
  setIsDeleteConfirmationOpen(false);
  // Aquí puedes ejecutar la lógica de eliminación del usuario usando el userIdToDelete
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_PERSONAL}/${userIdToDelete}`);
// Actualizar la lista de usuarios después de eliminar uno
  } catch (error) {
    console.error(error);
  }
};
const theme = useTheme();


  return (
  <>
  
  <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center">{capitalizeFirstLetter(row.name)}</TableCell>
        <TableCell align="center">{capitalizeFirstLetter(row.description)}</TableCell>
      </TableRow>
      <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f48fb1' } }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10} >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div" >
                LISTA DE CARGOS
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow sx={{
                    '&:nth-of-type(odd)': {
                      backgroundColor: open ? theme.palette.mode === 'dark' ? '#5c6bc0' : '#E0F2FE' : theme.palette.mode === 'dark' ? '#616161' : '#795548',
                    },
                  }}>
                    <TableCell align="center">Acciones</TableCell>
                    <TableCell align="center">Nombre</TableCell>
                    <TableCell align="center">Descripcion</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                      
                      <TableCell align="center">
                        <EditCharge userId={row._id}/>
                        <Button onClick={ ()=> handleDelete(row._id) }
                          style={{color:'red',borderRadius:'150px'}} >
                            <Icon icon='mdi:delete-outline' fontSize={20} />
                          </Button>
                      </TableCell>
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">{row.description}</TableCell> 
                    </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
    <Dialog open={isDeleteConfirmationOpen} onClose={handleDeleteCancelled}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro que deseas eliminar este cargo?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancelled} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirmed} color="primary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
  </>  
  );
}


export default function CollapsibleTable() {
  const[data,setData]=useState<Docu[]>([])
  const [addChargeOpen, setAddChargeOpen] = useState<boolean>(false)
  const [editChargeOpen, setEditChargeOpen] = useState<boolean>(false)
  const toggleAddCharge = () => setAddChargeOpen(!addChargeOpen)
  const toggleEditCharge = () => setEditChargeOpen(!editChargeOpen)
  const theme = useTheme();
  useEffect(() => {  
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const { data } = await axios.get<Docu[]>(`${process.env.NEXT_PUBLIC_PERSONAL_CHARGE}`);
      // const filteredData = response.data.filter(user => user.isActive);
      
      setData( data ); // Guarda los datos filtrados en el estado 'data'
    } catch (error) {
      console.log(error);
    }
  };

    function toggleAddUserCharge(): void {
        throw new Error('Function not implemented.');
    }

  return (
    <>
    <SidebarAddCharge open={addChargeOpen} toggle={toggleAddCharge} />
    <TableContainer component={Paper}>
      
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow  sx={{
                      '&:nth-of-type(odd)': {
                        backgroundColor: open ? theme.palette.mode === 'dark' ? '#5c6bc0' : '#E0F2FE' : theme.palette.mode === 'dark' ? '#5c6bc0' : '#ffffff',
                      },
                    }}>
          
            <TableCell />
            <TableCell align="center">NOMBRE</TableCell>
            <TableCell align="center">DESCRIPCION</TableCell>
           
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
}