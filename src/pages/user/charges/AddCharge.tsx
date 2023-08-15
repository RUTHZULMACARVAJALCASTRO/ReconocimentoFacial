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

// ** Types Imports
import { AppDispatch } from 'src/store'
import { Direction } from '@mui/material';
import axios from 'axios'
import Autocomplete from '@mui/material/Autocomplete';
import { AsyncThunkAction } from '@reduxjs/toolkit';
import { addUser } from 'src/store/apps/user'
import user from 'src/store/apps/user';

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
}

interface UserData {
  name: string
  description: string
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

const SidebarAddCharge = ({ open, toggle }: SidebarAddUserType) => {
  const [previewfile, setPreviewfile] = useState<string | null>(null);

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

  const handleSave = async (data: UserData) => {
    try {
      const transformedData: { [key: string]: string | number } = {
        name: data.name,
        description: data.description
      };
  await axios.post(`${process.env.NEXT_PUBLIC_PERSONAL_CHARGE}`,{
    name: data.name,
    description: data.description
  });
    toggle();
    reset();
    window.location.reload()
  } catch (error) {
    console.log(error);
  }
};


  const handleClose = () => {
    toggle()
    reset()
  }

  return (
    <>
    <Button onClick={handleClose}
    variant="contained"
    color="primary"
    sx={{
      borderRadius: '8px', 
      marginBottom: '15px',
      fontSize: '12px', 
      fontWeight: 'bold',
      padding: '10px 20px',
      boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)', 
      '&:hover': {
        backgroundColor: '#1565c0', 
       },
     }}
    > Crear Cargo </Button>
      <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500, md: 800, xl: 1200} } }}
    >
      <Header>
        <Typography variant='h6'>Agregar Cargo</Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(handleSave)}>
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
              name='description'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Descripcion'
                  onChange={onChange}
                  error={Boolean(errors.description)}
                  inputProps={{ autoComplete: "off"}}
                />
              )}
            />
            {errors.description && <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>}
          </FormControl>
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
    </>
  )
}

export default SidebarAddCharge