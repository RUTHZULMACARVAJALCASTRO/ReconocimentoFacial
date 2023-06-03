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
import AddUserDrawer from 'src/pages/user/AddUserDrawer';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, InputAdornment, Switch, TextField } from '@mui/material'
import data from 'src/@fake-db/components/data'

interface Docu {
  _id: string
  name: string
  lastName: string
  ci: string
  email: string
  phone: string
  direction: string
  nationality: string
}

interface CellType {
  row: Docu
}
  // ** States
/* const [openEdit, setOpenEdit] = useState<boolean>(false);
const [openPlans, setOpenPlans] = useState<boolean>(false);
const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false);
const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState<boolean>(false); */


  // Handle Edit dialog
/*   const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => setOpenEdit(false)

  // Handle Upgrade Plan dialog
  const handlePlansClickOpen = () => setOpenPlans(true)
  const handlePlansClose = () => setOpenPlans(false) */

let isOpen=false;
function clickOpenCard(){
  if(isOpen){
    isOpen=false
  }
  else{
    isOpen=true
  }
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
    field: 'direction',
    headerName: 'Direccion',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          skin='light'
          size='small'
          label={row.direction}
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
      const userData=row;
      return (
        <>
        <Button  variant='contained' sx={{ mr: 2 }} onClick={()=>clickOpenCard()}>
        EDITAR
        </Button>
        </>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 1,
    field: '',
    headerName: '',
    renderCell: ({ row }: CellType) => {
      return (
      <Dialog
      open={isOpen}
      onClose={()=>clickOpenCard()}
      aria-labelledby='userData-view-edit'
      sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650, p: [2, 10] } }}
      aria-describedby='userData-view-edit-description'
      >
      <DialogTitle id='userData-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
        editar informacion de usuario
      </DialogTitle>
              <DialogContent>
                <DialogContentText variant='body2' id='userData-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
                  privado
                </DialogContentText>
                <form>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label='name' defaultValue={row.name} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label='name'
                        defaultValue={row.name}
                        InputProps={{ startAdornment: <InputAdornment position='start'>nombre</InputAdornment> }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth type='lastName' label='Billing Email' defaultValue={row.ci} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id='userData-view-status-label'>lastName</InputLabel>
                        <Select
                          label='lasName'
                          defaultValue={row.name}
                          id='userData-view-status'
                          labelId='userData-view-status-label'
                        >
                          <MenuItem value='pending'>Pending</MenuItem>
                          <MenuItem value='active'>Active</MenuItem>
                          <MenuItem value='inactive'>Inactive</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label='TAX ID' defaultValue='Tax-8894' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label='Contact' defaultValue={`+1 ${row.name}`} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id='userData-view-language-label'>Language</InputLabel>
                        <Select
                          label='Language'
                          defaultValue='English'
                          id='userData-view-language'
                          labelId='userData-view-language-label'
                        >
                          <MenuItem value='English'>English</MenuItem>
                          <MenuItem value='Spanish'>Spanish</MenuItem>
                          <MenuItem value='Portuguese'>Portuguese</MenuItem>
                          <MenuItem value='Russian'>Russian</MenuItem>
                          <MenuItem value='French'>French</MenuItem>
                          <MenuItem value='German'>German</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id='userData-view-country-label'>Country</InputLabel>
                        <Select
                          label='Country'
                          defaultValue='USA'
                          id='userData-view-country'
                          labelId='userData-view-country-label'
                        >
                          <MenuItem value='USA'>USA</MenuItem>
                          <MenuItem value='UK'>UK</MenuItem>
                          <MenuItem value='Spain'>Spain</MenuItem>
                          <MenuItem value='Russia'>Russia</MenuItem>
                          <MenuItem value='France'>France</MenuItem>
                          <MenuItem value='Germany'>Germany</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        label='Use as a billing address?'
                        control={<Switch defaultChecked />}
                        sx={{ '& .MuiTypography-root': { fontWeight: 500 } }}
                      />
                    </Grid>
                  </Grid>
                </form>
              </DialogContent>
              <DialogActions sx={{ justifyContent: 'center' }}>
                <Button variant='contained' sx={{ mr: 1 }} >
                  ACEPTAR
                </Button>
                <Button variant='outlined' color='secondary' onClick={()=>clickOpenCard()}>
                  CANCELAR
                </Button>
              </DialogActions>
      </Dialog>
      )
    }
  },
  
  
]

const showId=(id:string)=>{
  console.log(id)
}
const UserList = ({ apiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  // ** State

  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)

  const store = apiData || [];

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={50}>
      <Grid item xs={12}>
        <Card>
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
          <DataGrid
            getRowId={row => row._id}
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
  const res = await axios.get(process.env.NEXT_PUBLIC_PERSONAL)
  const apiData = await res.data


  return {
    props: {
      apiData
    }
  }
}

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




