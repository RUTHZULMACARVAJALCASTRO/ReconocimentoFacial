// ** React Imports
import React, { useEffect, useState } from 'react'

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
import { useRouter } from 'next/router'
import user from 'src/store/apps/user';

interface UserData {
  name: string
  lastName: string
  ci: string
  email: string
  phone: string
  direction: string
  nationality: string
}

const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
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
  direction: yup.string().required(),
  nationality: yup.string().required(),
  email: yup.string().email().required(),
  ci: yup.string().required(),
  phone: yup
    .string()
    .typeError('')
    .min(10, obj => showErrors('Celular', obj.value.length, obj.min))
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
  direction: '',
  nationality: ''
}

  const SidebarEditUser = (props: { userId: string }) => {
  const [state,setState]=useState<boolean>(false)
  const userId=props.userId;
  const [user,setUser]=useState<UserData>({
  name: '',
  lastName: '',
  ci: '',
  email: '',
  phone: '',
  direction: '',
  nationality: '',
});

const onInputChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
  setUser({...user,[e.target.name]:e.target.value})
}
const getData = async() => {
  await axios
    .get<UserData>(`${process.env.NEXT_PUBLIC_PERSONAL}${userId}`)
    .then(response => {
      console.log(response.data)
      setUser(response.data)
    })
    .catch(error => {
      console.error(error);
    });
};
const OnSubmit=async(e:React.FormEvent)=>{
  e.preventDefault();
  console.log(user)
  await axios.put(`${process.env.NEXT_PUBLIC_PERSONAL}${userId}`, user);
}
useEffect(() => {
  if (userId) {
    getData();
  }
}, [userId]);

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

  return (
    <>
    <Button
    style={{backgroundColor:'#94bb68',color:'white',borderRadius:'10px'}}
    onClick={toggleDrawer(true)}>EDITAR</Button>
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
        <Typography variant='h6'>Agregar Usuario</Typography>
        <IconButton size='small' onClick={toggleDrawer(false)} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={OnSubmit}>
          <FormControl fullWidth sx={{ mb: 4}}>
            <Controller
              name='name'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={user.name}
                  label='Nombre'
                  onChange={onInputChange}
                  placeholder='Ruth'
                  error={Boolean(errors.name)}
                  autoComplete='off'
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
                  value={user.lastName}
                  label='Apellido'
                  onChange={onInputChange}
                  placeholder='Carvajal'
                  error={Boolean(errors.lastName)}
                  autoComplete='off'
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
                  value={user.email}
                  label='Correo Electronico'
                  onChange={onInputChange}
                  placeholder='ruth@email.com'
                  error={Boolean(errors.email)}
                  autoComplete='off'
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
                  value={user.ci}
                  label='CI'
                  placeholder='6700630'
                  onChange={onInputChange}
                  error={Boolean(errors.ci)}
                  autoComplete='off'
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
                  value={user.phone}
                  label='Celular'
                  placeholder='78906547'
                  onChange={onInputChange}
                  error={Boolean(errors.phone)}
                  autoComplete='off'
                />
              )}
            />
            {errors.phone && <FormHelperText sx={{ color: 'error.main' }}>{errors.phone.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='direction'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={user.direction}
                  label='direccion'
                  onChange={onInputChange}
                  placeholder='Av. Bolivar n°415'
                  error={Boolean(errors.direction)}
                  autoComplete='off'
                />
              )}
            />
            {errors.direction && <FormHelperText sx={{ color: 'error.main' }}>{errors.direction.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='nationality'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={user.nationality}
                  label='nacionalidad'
                  onChange={onInputChange}
                  placeholder='boliviana'
                  error={Boolean(errors.nationality)}
                  autoComplete='off'
                />
              )}
            />
            {errors.nationality && <FormHelperText sx={{ color: 'error.main' }}>{errors.nationality.message}</FormHelperText>}
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button size='large' type='submit' variant='contained' sx={{ mr: 6 }}>
              Aceptar
            </Button>
            <Button size='large' variant='outlined' color='secondary' onClick={toggleDrawer(false)}>
              Cancelar
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
    </> 
  )
}

export default SidebarEditUser
