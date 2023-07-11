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
  address: yup.string().required(),
  nationality: yup.string().required(),
  email: yup.string().email().required(),
  ci: yup.string().required(),
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
  file:'',
  nationality: ''
}

  const SidebarEditUser = ( props: { userId: string } ) => {

  const [state,setState]=useState<boolean>(false)
  const userId=props.userId;
  const [user,setUser]=useState<UserData>({
    name: '',
    lastName: '',
    ci: '',
    email: '',
    phone: '',
    address: '',
    file:'',
    nationality: '',
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
  const convertBase64ToImageUrl = (base64String: string) => {
    // console.log('AAAA', base64String )

    return `data:image/png;base64,${base64String}`
  }


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


  const handlefileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader()
    reader.onload = function () {
      if (reader.readyState === 2) {
        const formattedDate = new Date().toISOString()

        setUser
        setUser({ ...user, file: reader.result as string })
        //setPreviewfile(reader.result as string)
      }
    }
    if (e.target.files && e.target.files.length > 0) {
      console.log(e.target.files)
      reader.readAsDataURL(e.target.files[0])
      console.log('' + previewfile)
    }
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
      <Icon icon='mdi:pencil-outline' fontSize={20} />
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
        <Typography variant='h6'>Editar Usuario</Typography>
        <IconButton size='small' onClick={toggleDrawer(false)} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 4}}>
          <Controller
              name='file'
              control={control}
              render={({ field}) => (
               <div>
                <img
          src={convertBase64ToImageUrl(user.file)}
          alt='Imagen del activo'
          width={35}
          height={35}
          style={{ borderRadius: '50%' }}/>
               </div>
              )}
            />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4}}>
              <label htmlFor='file'>Imagen</label>
              <input type='file' id='file' name='file' onChange={handlefileChange} />
              <div style={{ textAlign: 'center' }}>
                {previewfile && (
                  <img src={previewfile} alt='Preview' style={{ maxWidth: '100%', maxHeight: '300px' }} />
                )}
              </div>
            </FormControl>
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
              name='lastName'
              control={control}
              rules={{ required: false }}
              render={({ field}) => (
                <TextField
                {...field}
                  label='Apellido'
                  onChange={ handleChange }
                  value={ user.lastName }
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
              rules={{ required: false }}
              render={({ field}) => (
                <TextField
                {...field}
                  type='email'
                  label='Correo Electronico'
                  value={ user.email }
                  onChange={ handleChange }
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
              rules={{ required: false }}
              render={({ field}) => (
                <TextField
                {...field}
                  label='CI'
                  value={ user.ci }
                  onChange={ handleChange }
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
              rules={{ required: false }}
              render={({ field}) => (
                <TextField
                {...field}
                  label='Celular'
                  value={ user.phone }
                  onChange={ handleChange }
                  error={Boolean(errors.phone)}
                  autoComplete='off'
                />
              )}
            />
            {errors.phone && <FormHelperText sx={{ color: 'error.main' }}>{errors.phone.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='address'
              control={control}
              rules={{ required: false }}
              render={({ field}) => (
                <TextField
                {...field}
                  label='direccion'
                  value={ user.address }
                  onChange={ handleChange }
                  error={Boolean(errors.address)}
                  autoComplete='off'
                />
              )}
            />
            {errors.address && <FormHelperText sx={{ color: 'error.main' }}>{errors.address.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='nationality'
              control={control}
              rules={{ required: false }}
              render={({ field}) => (
                <TextField
                {...field}
                  label='nacionalidad'
                  value={ user.nationality }
                  onChange={ handleChange }
                  error={Boolean(errors.nationality)}
                  autoComplete='off'
                />
              )}
            />
            {errors.nationality && <FormHelperText sx={{ color: 'error.main' }}>{errors.nationality.message}</FormHelperText>}
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
        </form>
      </Box>
    </Drawer>
  </>
  )
}

export default SidebarEditUser
