
import { useState, useCallback, useEffect } from 'react'

// ** Next Imports
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'
import Router, { useRouter } from 'next/router';

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import Image from 'next/image'

// ** Store Imports

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
// ** Third Party Components
import axios from 'axios'

// ** Types Imports
// ** Custom Table Components Imports

import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/pages/user/usuario/AddUserDrawer';
import { Avatar, Box, Button, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, TableCell, TextField, Tooltip, Typography} from '@mui/material'
import EditUserDrawer from './EditUserDrawer'
import { blue } from '@mui/material/colors';
import Icon from 'src/@core/components/icon';
import ViewComponent from 'src/components/view';

interface Docu {
  _id: string
  name: string
  lastName: string
  ci: string
  email: string
  phone: string
  address: string
  nationality: string
  file: string
  unity: string
  isActive:boolean
}

interface CellType {
  row: Docu
}
// Da de baja a un usuario 



const UserList = () => {
  // ** State
  const[data,setData]=useState<Docu[]>([])
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [editUserOpen, setEditUserOpen] = useState<boolean>(false)
  useEffect(() => {  
    fetchData();
  }, []);

  const convertBase64ToImageUrl = (base64String: string) => {
    return `data:image/png;base64,${base64String}`
  }

  const getInitials = (name: string, lastName: string) => {
    const initials = name.charAt(0) + lastName.charAt(0);
    return initials.toUpperCase();
  }

  const fetchData = async () => {
    try {
      const response = await axios.get<Docu[]>(`${process.env.NEXT_PUBLIC_PERSONAL}`);
      const filteredData = response.data.filter(user => user.isActive); // Filtrar por isActive true
      
      setData(filteredData); // Guarda los datos filtrados en el estado 'data'
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (_id: string) => {
  
    const isConfir = confirm('Deseas eliminar este usuario?');
    
    let apiData: any[] = []
    
    if( isConfir ) {
      await axios
      .delete(`${process.env.NEXT_PUBLIC_PERSONAL + _id}`)
      .then(response => {
          const responseData = response.data;
          
          if( Array.isArray( responseData )) {
            apiData.filter((user: Docu) => user.isActive === true ) // Filtrar por estado activo
            apiData.map((user: Docu) => ({ ...user, id: user._id })); //
          }
          fetchData()
        })
        .catch(error => {
          console.error(error);
      });
    };
  }
  

  /* const store = apiData || []; */

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
  const toggleEditUserDrawer = () => setEditUserOpen(!editUserOpen)
  
  const columns = [
    {
      flex: 0.1,
      minWidth: 80,
      field: 'options',
      headerName: 'ELIMINAR',
      renderCell: ({ row }: CellType) => {
        return (
          <Button onClick={ ()=> handleDelete(row._id) }
          style={{color:'red',borderRadius:'150px'}}>
            <Icon icon='mdi:delete-outline' fontSize={20} />
          </Button>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 80,
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
    {
      flex: 0.1,
      minWidth: 80,
      field: 'file',
      headerName: 'Imagen',
      renderCell: ({ row }: CellType) => {
        let imageSrc = convertBase64ToImageUrl(row.file);
        let altText = 'Imagen del personal';
        if(!row.file) {
          const initials = getInitials(row.name, row.lastName);
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
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'name',
      headerName: 'Nombre',
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={row.name}>
                  <TableCell>{row.name != null ? row.name.substring(0) : row.name}...</TableCell>
          </Tooltip>
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
          <Tooltip title={row.lastName}>
                  <TableCell>{row.lastName != null ? row.lastName.substring(0) : row.lastName}...</TableCell>
          </Tooltip>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'unity',
      headerName: 'Unidad',
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={row.unity}>
                  <TableCell>{row.unity != null ? row.unity.substring(0) : row.unity}...</TableCell>
          </Tooltip>
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
          <Tooltip title={row.ci}>
                  <TableCell>{row.ci != null ? row.ci.substring(0) : row.ci}...</TableCell>
          </Tooltip>
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
          <Tooltip title={row.email}>
                  <TableCell>{row.email != null ? row.email.substring(10) : row.email}...</TableCell>
          </Tooltip>
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
          <Tooltip title={row.phone}>
                  <TableCell>{row.phone != null ? row.phone.substring(3) : row.phone}...</TableCell>
          </Tooltip>
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
          <Tooltip title={row.address}>
                  <TableCell>{row.address != null ? row.address.substring(0) : row.address}...</TableCell>
          </Tooltip>
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
          <Tooltip title={row.nationality}>
                  <TableCell>{row.nationality != null ? row.nationality.substring(2) : row.nationality}...</TableCell>
          </Tooltip>
        )
      }
    },
    
    // {
    //   flex: 0.1,
    //   minWidth: 80,
    //   field: 'edit',
    //   headerName: 'EDITAR',
    //   renderCell: ({ row }: CellType) => {
    //     return (
    //       <>
    //        <ViewComponent userId={row._id}/>
    //       </> 
    //     )
    //   }
    // },
    
  ]
  return (
   <>
   <Grid container spacing={50}>
      <Grid item xs={12}>
        <Card>
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
          <DataGrid
            getRowId={ row => row._id }
            autoHeight
            rows={data}
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
      
      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer}  />
    </Grid>
    
   </> 
  )
}

/* export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL}`);
  let apiData: any[] = []; // Definir un arreglo vacío por defecto
  console.log(res)
  if (Array.isArray(res.data)) {
    apiData = res.data
      .filter((user: Docu) => user.isActive === true ) // Filtrar por estado activo
      .map((user: Docu) => ({ ...user, id: user._id })); // Agregar la propiedad 'id' con el mismo valor que '_id'
  }

  return {
    props: {
      apiData,
    },
  };
}; */

export default UserList
