// ** React Imports
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
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

// ** Types Imports
import axios from 'axios'
import { dividerClasses } from '@mui/material'

interface SidebarEditUserType {
  open: boolean
  toggle: () => void
}

interface UserData {
  name: string
  description: string
}

const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `${field} Se requiere campo`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} al menos debe ser ${min} caracteres`
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
  name: yup
    .string()
    .min(3, obj => showErrors('Nombre', obj.value.length, obj.min))
    .required(),
  description: yup
    .string()
    .min(3, obj => showErrors('descripcion', obj.value.length, obj.min))
    .required()
})

const defaultValues = {
  name: '',
  description: '',
  
}

  const SidebarEditUser = ( props: { userId: string } ) => {

  const [state,setState]=useState<boolean>(false)
  const userId=props.userId;
  const [user,setUser]=useState<UserData>({
    name: '',
    description: '',
  });
  const [image, setImage] = useState<File | null>(null)
  const [previewfile, setPreviewfile] = useState<string | null>(null)
  

  const toggleDrawer =
    (open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState(open);
    };

  // ** Hooks
  const {
    reset,
    control,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  


  const getData = async() => {
    await axios
    .get<UserData>(`${process.env.NEXT_PUBLIC_PERSONAL}${userId}`)
    .then(response => {
      setUser(response.data)
      // console.log("edit user"+user.file)
    })
    .catch(error => {
      console.error(error);
    });
  };
  
  useEffect(() => {
    if (userId) {
      getData();
    }
  }, [userId]);

  const  handleChange =(e: ChangeEvent<HTMLInputElement>)=>{
    setUser({...user, [e.target.name]:e.target.value})
  }

  const handleSubmit= async (e: FormEvent )=>{
    e.preventDefault();
    console.log('userrrrrrrrrrrrrrrrr', user)
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_PERSONAL}edit/${userId}`, user )
      console.log(user)
      console.log(response.data);
      window.location.reload()
    } catch ( error ) {
      console.error(error);
    }
    
  }
  

  return (
    <>
    <Button
    style={{color:'#0074D9',borderRadius:'10px'}}
    onClick={toggleDrawer(true)}>
      <Icon icon='mdi:pencil-outline' fontSize={20} /> EDITAR
    </Button>
    <Drawer
    style={{border:'2px solid white', margin:'theme.spacing(2)'}}
      open={state}
      onClose={toggleDrawer(false)}
      anchor='right'
      variant='temporary'
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 400, sm: 800} } }}
    >
      <Header>
        <Typography variant='h6'>Editar Cargo</Typography>
        <IconButton size='small' onClick={toggleDrawer(false)} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} /> 
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        
            <FormControl fullWidth sx={{ mb: 4 }} style={{ borderRadius: '50%', textAlign: 'center' }}>
            <Controller
              name='name'
              control={control}
              rules={{ required: false }}
              render={({ field}) => (
                <TextField
                {...field}
                  label='Nombre'
                  value={ user.name }
                  onChange={ handleChange } 
                  error={Boolean(errors.name)}
                  autoComplete='off'
                />
              )}
            />
            {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='description'
              control={control}
              rules={{ required: false }}
              render={({ field}) => (
                <TextField
                {...field}
                  label='Descripcion'
                  onChange={ handleChange }
                  value={ user.description }
                  error={Boolean(errors.description)}
                  autoComplete='off'
                />
              )}
            />
            {errors.description && <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>}
          </FormControl>
         
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              size='large' type='submit' variant='contained' sx={{ mr: 6 }}
            >
              Aceptar
            </Button>
            <Button size='large' variant='outlined' color='secondary' onClick={toggleDrawer(false)}>
              Cancelar
            </Button>
          </Box>
      </Box>
    </Drawer>
  </>
  )
}

export default SidebarEditUser
