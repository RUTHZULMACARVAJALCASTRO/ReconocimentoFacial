// ** React Imports
import React, { useState, useEffect, MouseEvent, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import setData from './newedituser'

// ** Store Imports
import { useDispatch} from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
// ** Third Party Components
import axios from 'axios'

// ** Types Imports
import { AppDispatch } from 'src/store'
// ** Custom Table Components Imports

import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/pages/user/AddUserDrawer';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, InputAdornment, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import data from 'src/@fake-db/components/data'
import { UserDataType } from '../../context/types';
import { rows } from 'src/@fake-db/table/static-data'

interface UserData {
  _id: string
  name: string
  lastName: string
  ci: string
  email: string
  phone: string
  direction: string
  nationality: string
  isActive:boolean
}





let isOpen=false;
function clickOpenCard(){
  if(isOpen){
    isOpen=false
  }
  else{
    isOpen=true
  }
}
const User:React.FC=()=>{
  const [user,setUser]=useState<UserData[]>([]);

  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
  
  


  useEffect(()=>{
    getData();
  },[])
  const handleDelete = (_id: string) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_PERSONAL + _id}`)
      .then(response => {
        console.log("se elimino con exito"+response.data);
        getData()
      })
      .catch(error => {
        console.error(error);
      });
  };
  const getData = () => {
    axios
      .get<UserData[]>(process.env.NEXT_PUBLIC_PERSONAL)
      .then(response => {
      const filteredUsers = response.data.filter(user => user.isActive);
        setUser(filteredUsers);
      })
      .catch(error => {
        console.error(error);
      });
  };
  return(
    <>
    <Button onClick={toggleAddUserDrawer}>NUEVO USUARIO</Button>
    <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
    <TableContainer component={Paper}>
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell align="right">NOMBRE</TableCell>
          <TableCell align="right">APELLIDO</TableCell>
          <TableCell align="right">CI</TableCell>
          <TableCell align="right">CORREO ELECTRONICO</TableCell>
          <TableCell align="right">CELULAR</TableCell>
          <TableCell align="right">DIRECCION</TableCell>
          <TableCell align="right">NACIONALIDAD</TableCell>
          <TableCell align="right">OPCIONES</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {user.map((data) => (
          <TableRow
            key={data._id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="data">
              {data.name}
            </TableCell>
            <TableCell align="right">{data.lastName}</TableCell>
            <TableCell align="right">{data.ci}</TableCell>
            <TableCell align="right">{data.email}</TableCell>
            <TableCell align="right">{data.phone}</TableCell>
            <TableCell align="right">{data.direction}</TableCell>
            <TableCell align="right">{data.nationality}</TableCell>
            <TableCell align="right">
              <Button onClick={()=>handleDelete(data._id)}>ELIMINAR</Button>
              <Button href={`/user/newedituser?id=${data._id}`}>EDITAR</Button>

            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    
  </TableContainer>
    </>
  )
}

export default User;







