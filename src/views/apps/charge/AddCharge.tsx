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
import { Grid } from '@mui/material';


interface SidebarAddUserType {
  open: boolean
  toggle: () => void
  page: number;
  pageSize: number;
  setPage: (page: number) => void
}

interface ChargeData {
  name: string;
  description: string;
  salary: string;
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
    .required(),
  salary: yup
    .string()
    .min(3, obj => showErrors('descripcion', obj.value.length, obj.min))
    .required()
})

const defaultValues = {
  name: '',
  description: '',
  salary: '',
}

const SidebarAddCharge = ({ open, toggle, setPage }: SidebarAddUserType) => {
  const dispatch: AppDispatch = useDispatch();

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
    setPage(1);
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
        // key={open ? 'open' : 'closed'}
        anchor='right'
        variant='temporary'
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 200, sm: 400, md: 600, xl: 1000 } } }}
      >
        <Header>
          <Typography variant='h6'>Agregar Cargo</Typography>
          <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Header>
        <Box sx={{ p: 5 }}>
          <form onSubmit={handleSubmit(handleSave)}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
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
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='salary'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Salario'
                        onChange={onChange}
                        inputProps={{ autoComplete: "off" }}
                        error={Boolean(errors.salary)}
                      />
                    )}
                  />
                  {errors.salary && <FormHelperText sx={{ color: 'error.main' }}>{errors.salary.message}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={12}>
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
              </Grid>
            </Grid>

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