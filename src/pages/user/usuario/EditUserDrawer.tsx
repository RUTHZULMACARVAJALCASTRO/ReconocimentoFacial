// ** React Imports
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box, { BoxProps } from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

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
  unity: string
  charge: string
  schedule: string
}
const UploadButton = styled('label')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid #ccc',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#626262',
  },
}));
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
  nationality: '',
  unity: '',
  charge: '',
  schedule: ''
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
    unity: '',
    charge: '',
    schedule: ''
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


  // const handlefileChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const reader = new FileReader()
  //   reader.onload = function () {
  //     if (reader.readyState === 2) {
  //       const formattedDate = new Date().toISOString()

  //       setUser
  //       setUser({ ...user, file: reader.result as string })
  //       //setPreviewfile(reader.result as string)
  //     }
  //   }
  //   if (e.target.files && e.target.files.length > 0) {
  //     console.log(e.target.files)
  //     reader.readAsDataURL(e.target.files[0])
  //     console.log('' + previewfile)
  //   }
  // }
  const handlefileChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e)
    const reader = new FileReader();
    reader.onload = function () {
      if (reader.readyState === 2) {
        setImage(e.target.files![0]); // Actualizar el estado image con el archivo seleccionado
        setPreviewfile(reader.result as string);
      }
    };
    if (e.target.files && e.target.files.length > 0) {
      console.log(e.target.files);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

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
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500, md: 800, xl: 1200} } }}
    >
      <Header>
        <Typography variant='h6'>Editar Usuario</Typography>
        <IconButton size='small' onClick={toggleDrawer(false)} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='file'
                control={control}
                render={({ field }) => (
                  <div>
                    {user.file ? (
                      <img
                        src={convertBase64ToImageUrl(user.file)}
                        alt='Imagen del activo'
                        width={100}
                        height={100}
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          backgroundColor: '#dcdcdc',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Typography> </Typography>
                      </Box>
                    )}
                  </div>
                )}
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <UploadButton htmlFor='file'>
                <CloudUploadIcon fontSize='large' />
                <Typography>Seleccionar Imagen</Typography>
                <input
                type='file'
                id='file'
                name='file'
                style={{ display: 'none' }}
                onChange={handlefileChange}
              />
              </UploadButton>
              
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
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='unity'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Unidad'
                  onChange={onChange}
                  error={Boolean(errors.unity)}
                  inputProps={{ autoComplete: "off"}}
                />
              )}
            />
            {errors.unity && <FormHelperText sx={{ color: 'error.main' }}>{errors.unity.message}</FormHelperText>}
          </FormControl>
          
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='charge'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Cargos'
                  onChange={onChange}
                  error={Boolean(errors.charge)}
                  inputProps={{ autoComplete: "off"}}
                />
              )}
            />
            {errors.charge && <FormHelperText sx={{ color: 'error.main' }}>{errors.charge.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='schedule'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Horarios'
                  onChange={onChange}
                  error={Boolean(errors.schedule)}
                  inputProps={{ autoComplete: "off"}}
                />
              )}
            />
            {errors.schedule && <FormHelperText sx={{ color: 'error.main' }}>{errors.schedule.message}</FormHelperText>}
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
