// ** React Imports
import { useState, useEffect, MouseEvent, useCallback } from 'react'

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
import AddUserDrawer from 'src/pages/user/usuario/AddUserDrawer';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, InputAdornment, Switch, TextField } from '@mui/material'
import data from 'src/@fake-db/components/data'
import EditUserDrawer from './EditUserDrawer'

interface Docu {
  _id: string
  name: string
  lastName: string
  ci: string
  email: string
  phone: string
  address: string
  nationality: string
  isActive:boolean
}

interface CellType {
  row: Docu
}

const columns = [
  {
    flex: 0.1,
    minWidth: 110,
    field: 'name',
    headerName: 'Nombre',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          skin='light'
          size='small'
          label={row.name}
          sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
        />
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'lastName',
    headerName: 'Apellido',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          skin='light'
          size='small'
          label={row.lastName}
          sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
        />
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'ci',
    headerName: 'CI',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          skin='light'
          size='small'
          label={row.ci}
          sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
        />
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'email',
    headerName: 'correo electronico',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          skin='light'
          size='small'
          label={row.email}
          sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '30px' } }}
        />
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'phone',
    headerName: 'Celular',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          skin='light'
          size='small'
          label={row.phone}
          sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
        />
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'address',
    headerName: 'Direccion',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          skin='light'
          size='small'
          label={row.address}
          sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
        />
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'nationality',
    headerName: 'Nacionalidad',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          skin='light'
          size='small'
          label={row.nationality}
          sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
        />
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'delete',
    headerName: 'ELIMINAR',
    renderCell: ({ row }: CellType) => {
      return (
        <Button onClick={()=>handleDelete(row._id)}
        style={{backgroundColor:'#ff7961',color:'white',borderRadius:'10px'}}>
          ELIMINAR
        </Button>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'edit',
    headerName: 'EDITAR',
    renderCell: ({ row }: CellType) => {
      return (
        <>
        <EditUserDrawer userId={row._id}/>
        </> 
      )
    }
  },
]

const UserList = ({ apiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  // ** State

  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [editUserOpen, setEditUserOpen] = useState<boolean>(false)

  const store = apiData || [];

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
  const toggleEditUserDrawer = () => setEditUserOpen(!editUserOpen)

  return (
    <Grid container spacing={50}>
      <Grid item xs={12}>
        <Card>
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
          <DataGrid
            getRowId={ row => row._id }
            autoHeight
            rows={store}
            columns={columns}
            checkboxSelection
            pageSize={pageSize}   
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>
      
      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get(process.env.NEXT_PUBLIC_PERSONAL);
  let apiData: any[] = []; // Definir un arreglo vacío por defecto

  if (Array.isArray(res.data)) {
    apiData = res.data.map((user: Docu) => {
      return { ...user, id: user._id }; // Agregar la propiedad 'id' con el mismo valor que '_id'
    });
  }
  return {
    props: {
      apiData,
    },
  };
};


const handleDelete = (_id: string) => {
  axios
    .delete(`${process.env.NEXT_PUBLIC_PERSONAL + _id}`)
    .then(response => {
      console.log("se elimino con exito"+response.data);
    })
    .catch(error => {
      console.error(error);
    });
};


export default UserList




