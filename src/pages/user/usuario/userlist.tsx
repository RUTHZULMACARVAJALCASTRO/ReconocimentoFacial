import { useState, useCallback, useEffect } from 'react'
import axios from 'axios'
import AddUserDrawer from 'src/pages/user/usuario/AddUserDrawer';
import {Box, Button, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography} from '@mui/material'
import EditUserDrawer from './EditUserDrawer';
import Icon from 'src/@core/components/icon';
import React from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { capitalizeFirstLetter } from 'src/utilities';
import { useTheme } from '@mui/material/styles';

interface Docu {
  _id: string
  name: string
  lastName: string
  ci: string
  email: string
  phone: string
  address: string
  nationality: string
  unity: string
  charge: string
  schedule: string
  file: string
  isActive:boolean
}

interface CellType {
  row: Docu
}

function Row(props: { row: Docu }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState<boolean>(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string>('');

  // Función para convertir una cadena base64 en una URL de imagen
  const convertBase64ToImageUrl = (base64String: string) => {
    return `data:image/png;base64,${base64String}`
  };

  // Función para obtener las iniciales del nombre y apellido
  const getInitials = (name: string, lastName: string) => {
    const initials = name.charAt(0) + lastName.charAt(0);
    return initials.toUpperCase();
  }

function imgExist(user:Docu){
  let imageSrc = convertBase64ToImageUrl(user.file);
      let altText = 'Imagen del personal';
      if(!user.file) {
        const initials = getInitials(user.name, user.lastName);
        imageSrc = '';
        altText = initials;
    }
  return (
    <div style={{ width: 35, height: 35, borderRadius: '50%', backgroundColor: '#3E93DE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {imageSrc ? (
          <img src={imageSrc} alt={altText} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
        ) : (
          <span style={{ fontSize: 16 }}>{altText}</span>
        )}
    </div>
  )
}

const handleDeleteCancelled = () => {
  setIsDeleteConfirmationOpen(false);
};
const handleDelete = (userId: string) => {
  setUserIdToDelete(userId);
  setIsDeleteConfirmationOpen(true);
};

// Funcion para dar de baja a un personal
const handleDeleteConfirmed = async () => {
  setIsDeleteConfirmationOpen(false);
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_PERSONAL}/${userIdToDelete}`);
  } catch (error) {
    console.error(error);
  }
};
  // Obtén el tema actual para el cambio de color
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
        <TableCell align="center">{imgExist(row)}</TableCell>
        <TableCell align="center">{ capitalizeFirstLetter( row.name ) }</TableCell>
        <TableCell align="center">{capitalizeFirstLetter( row.lastName )}</TableCell>
        <TableCell align="center">{row.email.toLowerCase() }</TableCell>
        <TableCell align="center">{ capitalizeFirstLetter(row.unity)}</TableCell>
        <TableCell align="center">{ capitalizeFirstLetter( row.charge ) }</TableCell>
        <TableCell align="center">{ capitalizeFirstLetter( row.schedule )}</TableCell>
      </TableRow>
      <TableRow  >
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10} >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
            <Typography variant="h6" gutterBottom component="div" style={{ fontWeight: 'bold' }}>
              LISTA
            </Typography>
 
              <Table size="small" aria-label="purchases">
                <TableHead>
                <TableRow sx={{
                      '&:nth-of-type(odd)': {
                        backgroundColor: open ? theme.palette.mode === 'dark' ? '#5c6bc0' : '#E0F2FE' : theme.palette.mode === 'dark' ? '#5c6bc0' : '#ffffff',
                      },
                    }}>
                  <TableCell align="center" style={{ fontWeight: 'bold' }}>Acciones</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold' }}>Nombre</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold' }}>Apellido</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold' }}>CI</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold' }}>Celular</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold' }}>Direccion</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold' }}>Nacionalidad</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold' }}>Unidad</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold' }}>Cargo</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold' }}>Horario Normal</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold' }}>Horario Especial</TableCell>

                </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow >
                                  
                      <TableCell align="center">
                        <EditUserDrawer userId={row._id}/>
                        <Button onClick={ ()=> handleDelete(row._id) }
                          style={{color:'red',borderRadius:'150px'}} >
                            <Icon icon='mdi:delete-outline' fontSize={20} />
                          </Button>
                      </TableCell>
                      <TableCell align="center">{capitalizeFirstLetter( row.name )}</TableCell>
                      <TableCell align="center">{capitalizeFirstLetter( row.lastName )}</TableCell>
                      <TableCell align="center">{capitalizeFirstLetter( row.ci )}</TableCell>
                      <TableCell align="center">{row.email.toLowerCase()}</TableCell>
                      <TableCell align="center">{row.phone}</TableCell>
                      <TableCell align="center">{capitalizeFirstLetter( row.address )}</TableCell>
                      <TableCell align="center">{capitalizeFirstLetter( row.nationality )}</TableCell>
                      <TableCell align="center">{capitalizeFirstLetter(row.unity)}</TableCell> 
                      <TableCell align="center">{capitalizeFirstLetter(row.charge)}</TableCell>
                      <TableCell align="center">{capitalizeFirstLetter(row.schedule)}</TableCell>
                      <TableCell > </TableCell> 
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
            ¿Estás seguro que deseas eliminar este usuario?
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
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [editUserOpen, setEditUserOpen] = useState<boolean>(false)
  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
  const toggleEditUserDrawer = () => setEditUserOpen(!editUserOpen)
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  useEffect(() => {  
    fetchData();
  }, []);

  // await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_SCHEDULE}${user.schedule}`)
  
  const fetchData = async () => {
    try {
      const response = await axios.get<Docu[]>(`${process.env.NEXT_PUBLIC_PERSONAL}`);
      const filteredData = response.data.filter( async user => user.isActive );

      // console.log( filteredData );

      const enhancedData = await Promise.all(filteredData.map(async user => {
      const schedulePerson = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_SCHEDULE}${user.schedule}`);
      const chargePerson = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_CHARGE}${user.charge}`);
      //   // const unityPerson = await axios.get(`${process.env.NEXT_PUBLIC_UNITYS}${user.unity}`);
      const enhancedUser = { ...user, schedule: schedulePerson.data.name, charge: chargePerson.data.name };
      //   console.log("afjalskñdfj", enhancedUser )
      return enhancedUser;
      }));
      
      setData(enhancedData); // Guarda los datos filtrados en el estado 'data'

    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
    <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer}  />
    <TableContainer component={Paper}>
      
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow sx={{
          '&:nth-of-type(odd)': {
            backgroundColor: open ? theme.palette.mode === 'dark' ? '#5c6bc0' : '' : theme.palette.mode === 'dark' ? '#616161' : '',
          },
        }}>
            <TableCell />
            <TableCell align="center" style={{ fontWeight: 'bold' }}>IMAGEN</TableCell>
            <TableCell align="center" style={{ fontWeight: 'bold' }}>NOMBRE</TableCell>
            <TableCell align="center" style={{ fontWeight: 'bold' }}>APELLIDO</TableCell>
            <TableCell align="center" style={{ fontWeight: 'bold' }}>EMAIL</TableCell>
            <TableCell align="center" style={{ fontWeight: 'bold' }}>UNIDAD</TableCell>
            <TableCell align="center" style={{ fontWeight: 'bold' }}>CARGO</TableCell>
            <TableCell align="center" style={{ fontWeight: 'bold' }}>HORARIO NORMAL</TableCell>
            <TableCell align="center" style={{ fontWeight: 'bold' }}>HORARIO ESPECIAL</TableCell>

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