import { ChangeEvent, useEffect, useState, Children } from 'react';
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
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import { useDispatch } from 'react-redux'
import { addCharge } from 'src/store/apps/charge/index'
import { AppDispatch } from 'src/redux/store';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


interface SidebarAddUserType {
  open: boolean
  toggle: () => void
}

interface ChargeData {
  name: string;
  description: string;
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
  const dispatch: AppDispatch = useDispatch();
  //const error = chargeSelector((state: RootState) => state.users.error);
  const [message, setMessage] = useState<string | null>(null);

  const MySwal = withReactContent(Swal)
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

  const handleSave = async (chargeData: ChargeData) => {
    dispatch(addCharge(chargeData));
    toggle();
    reset(defaultValues);
    MySwal.fire({
      title: <p>Cargo creado con exito!</p>,
      icon: 'success'
    });
  };

  // if (error) {
  // 	MySwal.fire({
  // 		title: <p>Error al crear el usuario</p>,
  // 		text: error,
  // 		icon: 'error'
  // 	});
  // }

  const handleClose = () => {
    toggle()
    reset()
  }

  return (
    <>
      {/* <Button onClick={handleClose}
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
      > Crear Cargo </Button> */}
      <Drawer
        open={open}
        anchor='right'
        variant='temporary'
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500, md: 800, xl: 1200 } } }}
      >
        <Header>
          <Typography variant='h6'>Agregar Cargo</Typography>
          <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Header>
        <Box sx={{ p: 5 }}>
          <form onSubmit={handleSubmit(handleSave)}>
            <FormControl fullWidth sx={{ mb: 4 }}>
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
                    inputProps={{ autoComplete: "off" }}
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
                    inputProps={{ autoComplete: "off" }}
                  />
                )}
              />
              {errors.description && <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>}
            </FormControl>
            <Box sx={{ display: 'flex', alignItems: 'center', columnGap: '20px' }}>
              <Button
                size='large' type='submit' variant='contained' color='primary'
                sx={{ display: 'flex', alignItems: 'center', columnGap: '3px' }}
              >
                <Icon icon='mdi:content-save-edit' fontSize={18} />
                <span>Guardar</span>
              </Button>

              <Button
                size='large' onClick={handleClose} variant='contained' color='primary'
                sx={{ display: 'flex', alignItems: 'center', columnGap: '3px' }}
              >
                <Icon icon='mdi:close-circle' fontSize={20} />
                <span>Cancelar</span>
              </Button>


              {message && (
                <Typography
                  variant='body2'
                  color='success.main'
                  sx={{ ml: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}
                >
                  <Icon icon='mdi:check' color='#00a86b' fontSize={16} />
                  {message}
                </Typography>
              )}
            </Box>
          </form>
        </Box>
      </Drawer>

    </>
  )
}

export default SidebarAddCharge