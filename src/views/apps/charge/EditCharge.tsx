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

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store'
import { editCharge } from 'src/store/apps/charge/index'
import { AppDispatch } from 'src/redux/store'
import { Docu } from 'src/pages/user/charges/ChargeList';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


interface SidebarEditChargeType {
  chargeId: string;
  open: boolean;
  toggle: () => void;
}

interface ChargeData {
  _id: string
  name: string
  description: string
  isActive: boolean
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

const defaultValues = {
  _id: '',
  name: '',
  description: '',
  isActive: true
}

const SidebarEditCharge = ({ chargeId, open, toggle }: SidebarEditChargeType) => {
  console.log(chargeId);
  const dispatch: AppDispatch = useDispatch();
  const allCharges: Docu[] = useSelector((state: RootState) => state.charges.list);
  const selectedCharge = allCharges.find(charge => charge._id === chargeId);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [charge, setCharge] = useState<Docu>(selectedCharge ? selectedCharge : defaultValues);
  const { handleSubmit, control, setValue, errors }: any = useForm<ChargeData>({
    defaultValues: selectedCharge ? selectedCharge : defaultValues
  });
  const MySwal = withReactContent(Swal)

  useEffect(() => {
    console.log("chargeId", chargeId);
    if (selectedCharge) {
      setValue("name", selectedCharge.name);
      setValue("description", selectedCharge.description);
    }
  }, [chargeId, selectedCharge, setValue]);



  const onSubmit = async (data: ChargeData) => {
    try {
      await dispatch(editCharge({ ...data, _id: chargeId })).unwrap();
      toggle();
      setOpenSnackbar(true);
      MySwal.fire({
        title: <p>Cargo editado con exito!</p>,
        icon: 'success'
      });
    } catch (error: any) {
      // Manejar el error
    }
  };

  const handleClose = () => {
    toggle();
    // reset();
  };

  return (
    <>
      <Drawer
        style={{ border: '2px solid white', margin: 'theme.spacing(2)' }}
        open={open}
        onClose={handleClose}
        anchor='right'
        variant='temporary'
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 400, sm: 800 } } }}
      >
        <Header>
          <Typography variant='h6'>Editar Cargo</Typography>
          <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Header>
        <Box sx={{ p: 5 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='name'
                control={control}
                rules={{ required: true, minLength: 2 }} // Puedes ajustar estas reglas
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Nombre'
                    autoComplete='off'
                  />
                )}
              />
            </FormControl>

            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='description'
                control={control}
                rules={{ required: true, minLength: 5 }} // Puedes ajustar estas reglas
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Descripcion'
                    autoComplete='off'
                  />
                )}
              />
              {/* <Controller
                name='description'
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Descripcion'
                    // onChange={handleChange}
                    value={charge.description}
                    // error={Boolean(errors.description)}
                    autoComplete='off'
                  />
                )}
              /> */}
              {/* {errors.description && <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>} */}
            </FormControl>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button size='large' type='submit' variant='contained' sx={{ mr: 6 }}>
                Aceptar
              </Button>
              <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
                Cancelar
              </Button>
            </Box>
          </form>
        </Box>
      </Drawer>

    </>
  );
}

export default SidebarEditCharge;