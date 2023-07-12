---
sidebar_position: 2
title: UserList Component
---

# UserList Component

El componente `UserList` es responsable de mostrar una lista de usuarios y proporciona funcionalidades para filtrar, agregar y editar usuarios.

## Props

El componente acepta las siguientes props:

### Nombres de props:

- `data`: (Obligatorio) Un array de objetos que representa los datos de los usuarios. Cada objeto debe tener las siguientes propiedades:

  - `_id`: (string) El identificador único del usuario.
  - `name`: (string) El nombre del usuario.
  - `lastName`: (string) El apellido del usuario.
  - `ci`: (string) El número de CI del usuario.
  - `email`: (string) El correo electrónico del usuario.
  - `phone`: (string) El número de teléfono del usuario.
  - `address`: (string) La dirección del usuario.
  - `nationality`: (string) La nacionalidad del usuario.
  - `file`: (string) La imagen del usuario en formato base64.
  - `unity`: (string) La unidad a la que pertenece el usuario.
  - `isActive`: (boolean) Indica si el usuario está activo o no.
#  Importaciones
El componente utiliza varias importaciones de módulos y librerías. Aquí tienes una descripción de cada una de ellas:

- `useState`, `useCallback` y `useEffect`: Hooks de React para manejar el estado, las funciones de retorno de llamada y los efectos secundarios.
    ```tsx
      import { useState, useCallback, useEffect } from 'react'
        
    ```
- `GetStaticProps`, `InferGetStaticPropsType`: Tipos relacionados con la generación de páginas estáticas en Next.js.
- `Router`, `useRouter`: Módulos de Next.js para el enrutamiento y acceso al objeto router.
- `Card`, `Grid` y `DataGrid`: Componentes de Material-UI para representar una tarjeta, una cuadrícula y una cuadrícula de datos, respectivamente.
    ```tsx
      import Card from '@mui/material/Card'
      import Grid from '@mui/material/Grid'
      import { DataGrid } from '@mui/x-data-grid'       
    ```
- `Image`: Componente de Next.js para mostrar imágenes optimizadas.
    ```tsx
      import Image from 'next/image'
    ```
- `CustomChip`: Componente personalizado para mostrar chips en Material-UI.
- axios: Librería utilizada para realizar peticiones HTTP a la API REST.
    ```tsx
      import axios from 'axios'
    ```
- `TableHeader`, `AddUserDrawer`, `EditUserDrawer`: Componentes locales relacionados con la funcionalidad del componente UserList.
    ```tsx
      import TableHeader from 'src/views/apps/user/list/TableHeader'
      import AddUserDrawer from 'src/pages/user/usuario/AddUserDrawer';
      import EditUserDrawer from './EditUserDrawer'
    ```
- `Avatar`, `Box`, `Button`, `Dialog`, `DialogTitle`, `List`, `ListItem`, `ListItemAvatar`, `ListItemButton`, - - - `ListItemText`, `TableCell`, `TextField`, `Tooltip`, `Typography`: Componentes de Material-UI para representar elementos visuales y de interacción.
- blue: Paleta de colores de Material-UI.
# Interfaces
El componente utiliza dos interfaces para definir el tipo de datos del documento y el tipo de celda en la cuadrícula de datos:

- Docu: Define la estructura de los datos de un documento. Tiene propiedades como _id, name, lastName, ci, email, phone, address, nationality, file, unity e isActive.
    ```tsx
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
    ```

- CellType: Define el tipo de celda en la cuadrícula de datos. Tiene una propiedad row de tipo Docu.
    ```tsx
      interface CellType {
      row: Docu
      }
    ```

# Funciones de utilidad
El código incluye varias funciones de utilidad:

- convertBase64ToImageUrl: Convierte una cadena base64 en una URL de imagen.
    ```tsx
      convertBase64ToImageUrl = (base64String: string) => {
        return `data:image/png;base64,${base64String}`
      }
    ```
- getInitials: Obtiene las iniciales de un nombre y un apellido.
    ```tsx
      const getInitials = (name: string, lastName: string) => {
      const initials = name.charAt(0) + lastName.charAt(0);
         return initials.toUpperCase();
    }
    ```
# Componente UserList
El componente UserList es un componente funcional de React que muestra una lista de usuarios en una cuadrícula de datos. A continuación, se describe su estructura y funcionalidad:

- El componente utiliza el hook `useState` para manejar el estado interno de `data`, `value`, `pageSize`, `addUserOpen` y `editUserOpen`.
    ```tsx  
      const UserList = () => {
      const[data,setData]=useState<Docu[]>([])
      const [value, setValue] = useState<string>('')
      const [pageSize, setPageSize] = useState<number>(10)
      const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
      const [editUserOpen, setEditUserOpen] = useState<boolean>(false)
      useEffect(() => {  
        fetchData();
      }, []);
    ```
- El componente utiliza el hook useEffect para llamar a la función `fetchData` al montar el componente.
- El componente define la función `fetchData` para obtener los datos de los usuarios a través de una petición HTTP utilizando axios.
    ```tsx  
      const fetchData = async () => {
      try {
        const response = await axios.get<Docu[]>(`${process.env.NEXT_PUBLIC_PERSONAL}`);
        const filteredData = response.data.filter(user => user.isActive); // Filtrar por isActive true
        
        setData(filteredData); // Guarda los datos filtrados en el estado 'data'
        } catch (error) {
        console.log(error);
        }
      };
    ```
- El componente define la función `handleDelete` para manejar la eliminación de un usuario. Esta función muestra una confirmación al usuario y envía una solicitud DELETE a la API REST si el usuario confirma la eliminación.
- El componente define la función `handleFilter` como una función de retorno de llamada para manejar el filtrado de la lista de usuarios.
    ```tsx  
      const handleFilter = useCallback((val: string) => {
        setValue(val)
      }, [])
    ```
- El componente define las funciones `toggleAddUserDrawer` y `toggleEditUserDrawer` para mostrar y ocultar el cajón deslizante de agregar y editar usuarios.
    ```tsx 
        const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
    ```
- El componente define la función `convertBase64ToImageUrl` para convertir una cadena base64 en una URL de imagen.
    ```tsx
        const convertBase64ToImageUrl = (base64String: string) => {
            return `data:image/png;base64,${base64String}
      }
    ```
- El componente define la función `getInitials` para obtener las iniciales de un nombre y un apellido.
- El componente define la constante columns que representa las columnas de la cuadrícula de datos. Cada columna define cómo se renderiza una celda y qué datos mostrar.

    ```tsx
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
     ```
- El componente renderiza una estructura de elementos de Material-UI y componentes personalizados para mostrar la lista de usuarios y la cuadrícula de datos.
- El componente utiliza componentes de Material-UI como `Card`, `Grid`, `DataGrid`, `Button`, `Tooltip`, `Typography` y `TextField` para mostrar y capturar datos en la lista y la cuadrícula de datos.
- El componente utiliza componentes locales como `TableHeader`, `AddUserDrawer` y `EditUserDrawer` para mostrar los encabezados de tabla, el cajón deslizante de agregar usuarios y el cajón deslizante de editar usuarios, respectivamente.

### Ejemplo de uso:

    ```jsx
        <UserList data={usersData} />
    ```
# Comportamiento y funciones

El componente `UserList` muestra una tabla con los usuarios y proporciona las siguientes funcionalidades:

- Filtrado de usuarios por nombre o apellido.
- Agregar nuevos usuarios mediante un formulario.
- Editar usuarios existentes en un formulario.
- Eliminar usuarios de la lista.
# Ejemplo de codigo

A continuación se muestra un ejemplo de cómo se puede utilizar el componente `UserList`:
```jsx
    import { useState, useEffect } from 'react';
    import axios from 'axios';
    import UserList from './UserList';

    const MyComponent = () => {
      const [usersData, setUsersData] = useState([]);

      useEffect(() => {
        fetchData();
      }, []);

      const fetchData = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL}`);
          const filteredData = response.data.filter((user) => user.isActive);
          setUsersData(filteredData);
        } catch (error) {
          console.log(error);
        }
      };

      return <UserList data={usersData} />;
    };

    export default MyComponent;

```
En el ejemplo anterior, el componente MyComponent obtiene los datos de usuarios mediante una solicitud HTTP utilizando Axios. Luego, se pasa el array de datos `usersData` al componente `UserList` como prop data. El componente `UserList` se encarga de mostrar la lista de usuarios y proporcionar las funcionalidades mencionadas anteriormente.

# Vista de la Pagina Web

![Docs Version Dropdown](./img/Captura%20de%20pantalla%20(853).png)
<!-- 
# Aqui Te Presento El codigo Completo
```tsx
   
import { useState, useCallback, useEffect } from 'react'

import { GetStaticProps, InferGetStaticPropsType } from 'next/types'
import Router, { useRouter } from 'next/router';

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import Image from 'next/image'
import CustomChip from 'src/@core/components/mui/chip'
import axios from 'axios'
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
export default UserList

``` -->
