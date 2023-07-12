---
title: SidebarAddUser Component
sidebar_position: 3
---

# SidebarAddUser Component

El componente `SidebarAddUser` es responsable de mostrar un formulario para agregar un nuevo usuario.

## Importaciones

```tsx
import { ChangeEvent, useEffect, useState, Children } from 'react';
import Drawer from '@mui/material/Drawer';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import Box, { BoxProps } from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import Icon from 'src/@core/components/icon';
import { useDispatch } from 'react-redux';
import { addUser } from 'src/store/apps/user';
import { AppDispatch } from 'src/store';
import { Direction } from '@mui/material';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import { AsyncThunkAction } from '@reduxjs/toolkit';
import user from 'src/store/apps/user';
```
# Tipos
El componente utiliza los siguientes tipos:

```tsx
    interface SidebarAddUserType {
      open: boolean;
      toggle: () => void;
    }
    interface UserData {
      name: string;
      lastName: string;
      ci: string;
      email: string;
      phone: string;
      address: string;
      file: string;
      nationality: string;
    }

```
# Funciones de utilidad
El componente utiliza la función `showErrors` para mostrar mensajes de error específicos según la longitud de los valores de los campos:

```tsx
   const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `El campo ${field} es requerido`;
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} debe tener al menos ${min} caracteres`;
  } else {
    return '';
  }
};
```
# Estilos personalizados
El componente utiliza estilos personalizados utilizando la función `styled` de Material-UI:

```tsx
   const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default,
}));
```
# Esquema de validacion
El componente utiliza un esquema de validación utilizando la librería `yup`:
```tsx
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
    .required(),
});
```
# Estado y Funciones
El componente utiliza el estado y las funciones de React para gestionar el estado del formulario y la imagen de vista previa:
```tsx
    const [previewfile, setPreviewfile] = useState<string | null>(null);
    const [children, setChildren] = useState<Children[]>([]);
    const [user, setUser] = useState<UserData>({
      name: '',
      lastName: '',
      ci: '',
      email: '',
      phone: '',
      address: '',
      file: '',
      nationality: '',
    });

    const {
      reset,
      control,
      setValue,
      handleSubmit,
      formState: { errors },
    } = useForm({
      defaultValues,
      mode: 'onChange',
      resolver: yupResolver(schema),
    });

    const handlefileChange = (e: ChangeEvent<HTMLInputElement>) => {
      // Código de manejo de cambio de archivo
    };

    const handleSave = async (data: UserData) => {
      // Código de manejo de guardado
    };

    const fetchData = async () => {
      // Código de obtención de datos
    };

    const handleClose = () => {
      // Código de cierre del panel lateral
    };
```
# Componente SidebarAddUser
El componente `SidebarAddUser` es el componente principal que renderiza el formulario de agregar usuario en un panel lateral. Utiliza los estilos personalizados, el esquema de validación y las funciones declaradas anteriormente:

``` tsx
    const SidebarAddUser = (props: SidebarAddUserType) => {
    const { open, toggle } = props;

      return (
        <Drawer
          open={open}
          anchor='right'
          variant='temporary'
          onClose={handleClose}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500, md: 800, xl: 1200 } } }}
        >
          <Header>
            <Typography variant='h6'>Agregar Usuario</Typography>
            <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
              <Icon icon='mdi:close' fontSize={20} />
            </IconButton>
          </Header>
          <Box sx={{ p: 5 }}>
            <form onSubmit={handleSubmit(handleSave)}>
              {/* Código del formulario */}
            </form>
          </Box>
        </Drawer>
      );
    };
```
# Ejemplo de uso
A continuación se muestra un ejemplo de cómo se puede utilizar el componente `SidebarAddUser`:
```tsx
    import { useState } from 'react';
    import SidebarAddUser from './SidebarAddUser';

    const MyComponent = () => {
      const [isOpen, setIsOpen] = useState(false);

      const toggleSidebar = () => {
        setIsOpen(!isOpen);
      };

      return (
        <>
          <button onClick={toggleSidebar}>Abrir Panel Lateral</button>
          <SidebarAddUser open={isOpen} toggle={toggleSidebar} />
        </>
      );
```
# Vista de la Pagina Web Para Agregar Usuario

![Docs Version Dropdown](./img/Captura%20de%20pantalla%20(852).png)
