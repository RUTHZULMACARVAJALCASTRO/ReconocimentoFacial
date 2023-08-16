import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box, { BoxProps } from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import Icon from 'src/@core/components/icon';
import axios from 'axios';

interface Schedule {
  day: number;
  morningEntry: string;
  morningExit: string;
  afternoonEntry: string;
  afternoonExit: string;
  entranceTolerance: number;
}

interface UserData {
  name: string;
  schedules: Schedule[];
  isPermanent: boolean;
}

const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `${field} Se requiere campo`;
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} al menos debe ser ${min} caracteres`;
  } else {
    return '';
  }
};

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default,
}));

const schema = yup.object().shape({
  name: yup.string().min(3, obj => showErrors('Nombre', obj.value.length, obj.min)).required(),
  description: yup.string().min(3, obj => showErrors('descripcion', obj.value.length, obj.min)).required(),
  isPermanent: yup.boolean().required(),
  schedules: yup.array().of(
    yup.object().shape({
      day: yup.number().required(),
      morningEntry: yup.string().required(),
      morningExit: yup.string().required(),
      afternoonEntry: yup.string().required(),
      afternoonExit: yup.string().required(),
      entranceTolerance: yup.number().required(),
    })
  ),
});

const defaultValues: UserData = {
  name: '',
  isPermanent: false,
  schedules: [
    {
      day: 0,
      morningEntry: '',
      morningExit: '',
      afternoonEntry: '',
      afternoonExit: '',
      entranceTolerance: 0,
    },
  ],
};

const SidebarEditSchedule = (props: { userId: string }) => {
  const [state, setState] = useState<boolean>(false);
  const userId = props.userId;
  const [user, setUser] = useState<UserData>(defaultValues);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setState(open);
  };

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const getData = async () => {
    try {
      const { data } = await axios.get<UserData>(`${process.env.NEXT_PUBLIC_PERSONAL}${userId}`);
      setUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userId) {
      getData();
    }
  }, [userId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = async (data: UserData) => {
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_PERSONAL}edit/${userId}`, data);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Button style={{ color: '#0074D9', borderRadius: '10px' }} onClick={toggleDrawer(true)}>
        <Icon icon='mdi:pencil-outline' fontSize={20} /> EDITAR
      </Button>
      <Drawer
        style={{ border: '2px solid white', margin: 'theme.spacing(2)' }}
        open={state}
        onClose={toggleDrawer(false)}
        anchor='right'
        variant='temporary'
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 400, sm: 800 } } }}
      >
        <Header>
          <Typography variant='h6'>Editar Horario Especial</Typography>
          <IconButton size='small' onClick={toggleDrawer(false)} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Header>
        <Box sx={{ p: 5 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{ mb: 4 }} style={{ borderRadius: '50%', textAlign: 'center' }}>
              <Controller
                name='name'
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Nombre'
                    value={user.name}
                    onChange={handleChange}
                    error={Boolean(errors.name)}
                    autoComplete='off'
                  />
                )}
              />
              {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={user.isPermanent}
                  onChange={e => setUser({ ...user, isPermanent: e.target.checked })}
                  name='isPermanent'
                />
              }
              label='Permanent'
            />
            {/* ... rest of your form */}
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
  );
};

export default SidebarEditSchedule;
