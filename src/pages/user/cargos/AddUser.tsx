// ** React Imports
import { ChangeEvent, useEffect, useState, Children } from 'react';

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch } from 'react-redux'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'

// ** Types Imports
import { AppDispatch } from 'src/store'
import { Direction } from '@mui/material';
import axios from 'axios'
import Autocomplete from '@mui/material/Autocomplete';
import { AsyncThunkAction } from '@reduxjs/toolkit'
import user from 'src/store/apps/user';

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
}
interface Children {
  _id: string,
  name: string,
  children:Children[]
}

interface UserData {
  name: string
  lastName: string
  ci: string
  email: string
  phone: string
  address: string
  file: string
  nationality: string
 
}

const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) { 
    return `El campo ${field} es requerido`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} debe tener al menos ${min} caracteres`
  } else {
    return ''
  }
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const schema = yup.object().shape({
  address: yup
    .string()
    .min(4, obj => showErrors('Dirección', obj.value.length, obj.min))
    .required(),
  nationality: yup
    .string()
    .min(2, obj => showErrors('Nacionalidad', obj.value.length, obj.min))
    .typeError('')
    .required(),
  email: yup
    .string()
    .min(4, obj => showErrors('Email', obj.value.length, obj.min))
    .email()
    .required(),
  ci: yup
    .string()
    .min(4, obj => showErrors('CI', obj.value.length, obj.min))
    .required(),
  phone: yup
    .string()
    .typeError('')
    .min(8, obj => showErrors('Celular', obj.value.length, obj.min))
    .required(),
  name: yup
    .string()
    .min(3, obj => showErrors('Nombre', obj.value.length, obj.min))
    .required(),
  lastName: yup
    .string()
    .min(3, obj => showErrors('Apellido', obj.value.length, obj.min))
    .required()
})

const defaultValues = {
  name: '',
  lastName: '',
  ci: '',
  email: '',
  phone: '',
  address: '',
  file: '',
  nationality: ''
}

const SidebarAddUser = (props: SidebarAddUserType) => {
 
  const { open, toggle } = props
  
  const [previewfile, setPreviewfile]= useState<string | null>(null)
  const[children,setChildren]=useState<Children[]>([])
  const [user, setUser] = useState<UserData>({
    name: '',
    lastName: '',
    ci: '',
    email: '',
    phone: '',
    address: '',
    file: '',
    nationality: ''
  })
  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  const handlefileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader()
    reader.onload = function () {
      if (reader.readyState === 2) {
        const formattedDate = new Date().toISOString()
        setUser({ ...user, file: reader.result as string })
        setPreviewfile( reader.result as string )
      }
    }
    
    if (e.target.files && e.target.files.length > 0) {
      console.log(e.target.files)
      reader.readAsDataURL(e.target.files[0])
      console.log('' + previewfile)
    }
  }

  const handleSave = async (data: UserData) => {
    try {
      const transformedData: { [key: string]: string | number } = {
        name: data.name,
        lastName: data.lastName,
        ci: data.ci,
        email: data.email,
        phone: data.phone,
        address: data.address,
        nationality: data.nationality,
        file:data.file,
      };
  await axios.post(`${process.env.NEXT_PUBLIC_PERSONAL}`,{
    name: data.name,
    lastName: data.lastName,
    ci: data.ci,
    email: data.email,
    phone: data.phone,
    address: data.address,
    nationality: data.nationality, 
    file:previewfile,
  });
    toggle();
    reset();
    window.location.reload()
  } catch (error) {
    console.log(error);
  }
};
useEffect(()=>{
  fetchData()
},[])
const fetchData = async () => {
  try {
    const response = await axios.get<Children[]>('http://10.10.214.219:3000/main'); // Filtrar por isActive true
    setChildren(response.data); // Actualiza el estado 'children' con los datos obtenidos
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  if (children && children.length > 0) {
    console.log("children: " + children[0]._id); // Accede a la propiedad '_id' del primer elemento
  } else {
    console.log("No se encontraron children");
  }
}, [children]);

  const handleClose = () => {
  
    toggle()
    reset()
  }
  

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500, md: 800, xl: 1200} } }}
    >
      <Header>
        <Typography variant='h6'>Agregar Usuario</Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(handleSave)}>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <label htmlFor='file'>Imagen</label>
            <input type='file' id='file' name='file' onChange={handlefileChange} />
            <div style={{ textAlign: 'center' }}>
              {previewfile && <img src={previewfile} alt='Preview' style={{ maxWidth: '100%', maxHeight: '300px' }} />}
            </div>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4}}>
            <Controller
              name='name'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Nombre'
                  onChange={onChange}
                  error={Boolean(errors.name)}
                  inputProps={{ autoComplete: "off"}}
                />
              )}
            />
            {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='lastName'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Apellido'
                  onChange={onChange}
                  error={Boolean(errors.lastName)}
                  inputProps={{ autoComplete: "off"}}
                />
              )}
            />
            {errors.lastName && <FormHelperText sx={{ color: 'error.main' }}>{errors.lastName.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='email'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type='email'
                  value={value}
                  label='Correo Electronico'
                  onChange={onChange}
                  error={Boolean(errors.email)}
                  inputProps={{ autoComplete: "off"}}
                />
              )}
            />
            {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='ci'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='CI'
                  onChange={onChange}
                  error={Boolean(errors.ci)}
                  inputProps={{ autoComplete: "off"}}
                />
              )}
            />
            {errors.ci && <FormHelperText sx={{ color: 'error.main' }}>{errors.ci.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='phone'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Celular'
                  onChange={onChange}
                  error={Boolean(errors.phone)}
                  inputProps={{ autoComplete: "off"}}
                />
              )}
            />
            {errors.phone && <FormHelperText sx={{ color: 'error.main' }}>{errors.phone.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='address'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Direccion'
                  onChange={onChange}
                  error={Boolean(errors.address)}
                  inputProps={{ autoComplete: "off"}}
                />
              )}
            />
            {errors.address && <FormHelperText sx={{ color: 'error.main' }}>{errors.address.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='nationality'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Nacionalidad'
                  onChange={onChange}
                  error={Boolean(errors.nationality)}
                  inputProps={{ autoComplete: "on"}}
                />
              )}
            />
            {errors.nationality && <FormHelperText sx={{ color: 'error.main' }}>{errors.nationality.message}</FormHelperText>}
          </FormControl>
          {/* <FormControl> */}
          {children.map((id)=>(
            <ul>
              { children.map((item) => (
                <li key={item._id}>
                  <p>ID: {item._id}</p>
                  <p>Nombre: {item.name}</p>
                  {item.children.length > 0 && (
                    <ul>
                      {item.children.map((child) => (
                        <li key={child._id}>
                          <p>ID del hijo: {child._id}</p>
                          <p>Nombre del hijo: {child.name}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          ))} 
         
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              size='large' type='submit' variant='contained' sx={{ mr: 6 }}
            > Aceptar </Button>
            <Button size='large' variant='outlined' color='secondary' onClick={handleClose}
            > Cancelar </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddUser