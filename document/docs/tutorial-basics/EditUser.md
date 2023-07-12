---
title: SidebarEditUser Component
sidebar_position: 4
---

# SidebarEditUser

El componente `SidebarEditUser` es un componente de React que muestra un formulario en un cajón deslizante (Drawer) para editar la información de un usuario. El formulario contiene campos como nombre, apellido, CI, correo electrónico, celular, dirección, imagen y nacionalidad. Utiliza la librería Material-UI para los estilos y validación de formularios con Yup.

# Funcionalidad
El componente SidebarEditUser tiene la siguiente funcionalidad:

- Cuando se hace clic en el botón de edición, se abre el cajón deslizante (Drawer) con el formulario.
- El formulario está prellenado con los datos del usuario obtenidos de una API REST utilizando el ID proporcionado.
- Se puede cambiar la imagen del usuario seleccionando un archivo.
- Se pueden editar los campos de nombre, apellido, CI, correo electrónico, celular, dirección y nacionalidad.
- Los campos del formulario son validados utilizando la librería Yup.
- Al enviar el formulario, se realiza una petición PUT a la API REST para actualizar los datos del usuario.
- Después de la actualización exitosa, la página se recarga para reflejar los cambios.
# Estructura del Proyecto
El componente `SidebarEditUser` está compuesto por varios elementos y utiliza diversas librerías y componentes. A continuación, se describe la estructura del proyecto:

- `SidebarEditUser`.tsx: Archivo principal del componente que contiene la lógica y el JSX del formulario.

- `Header`.tsx: Componente de encabezado que muestra el título y el botón de cierre del cajón deslizante.
``` tsx
   const Header = styled(Box)<BoxProps>(({ theme }) => ({
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(3, 4),
      justifyContent: 'space-between',
      backgroundColor: theme.palette.background.default
}))
     
```
- `yup`: Librería utilizada para definir y validar el esquema de los campos del formulario.
```tsx
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
```
- `axios`: Librería utilizada para realizar peticiones HTTP a la API REST.
```tsx
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
```
  - @mui/material: Librería de componentes de Material-UI utilizada para los estilos y los componentes de formulario.
  - @mui/material/styles: Módulo de Material-UI utilizado para crear estilos personalizados.
  - @mui/material/IconButton: Componente de Material-UI utilizado para el botón de cierre del cajón deslizante.
  - @core/components/icon: Componente personalizado utilizado para mostrar iconos.

# Importaciones
El componente utiliza varias importaciones de módulos y librerías. Aquí tienes una descripción de cada una de ellas:

  - `React`: Librería de JavaScript para construir interfaces de usuario.
  - `ChangeEvent` y `FormEvent`: Tipos de eventos de cambio y envío de formularios en React.
  - `useState`: Hook de React para el manejo de estado en componentes funcionales.
  - `Drawer`: Componente de Material-UI que muestra un cajón deslizante.
  - `Button`: Componente de Material-UI para representar un botón.
  - `styled`: Módulo de Material-UI utilizado para crear estilos personalizados.
  - `TextField`: Componente de Material-UI para representar un campo de texto.
  - `IconButton`: Componente de Material-UI para representar un botón de icono.
  - `Typography`: Componente de Material-UI para representar texto con diferentes variantes.
  - `Box` y `BoxProps`: Componente y tipos relacionados para crear contenedores en Material-UI.
  - `FormControl` y `FormHelperText`: Componentes de Material-UI para el manejo de formularios.
  - `yup` y `yupResolver`: Librería y función para la validación de formularios con Yup.
  - `useForm` y `Controller`: Hooks de React Hook Form para el manejo de formularios.
  - `Icon`: Componente personalizado utilizado para mostrar iconos.
  - `axios`: Librería utilizada para realizar peticiones HTTP a la API REST.
# Interfaces
El componente utiliza dos interfaces para definir el tipo de datos de los props y la estructura de los datos de usuario:

  - `SidebarEditUserType`: Define el tipo de los props del componente `SidebarEditUser`. Tiene una propiedad open de tipo booleano y una función toggle sin argumentos ni valor de retorno.
  ```tsx
   interface SidebarEditUserType {
      open: boolean
      : () => void
  }
  ```
  - `UserData`: Define la estructura de los datos de usuario. Tiene propiedades como name, lastName, ci, email, phone, address, file y nationality, todas ellas de tipo string.
  ```tsx
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
  ```
# Funciones de utilidad
El código incluye una función de utilidad llamada `showErrors`, que toma tres argumentos: `field`, `valueLen` y `min`. Esta función se utiliza para mostrar mensajes de error personalizados basados en la longitud de los valores de los campos.

# Componente SidebarEditUser
El componente `SidebarEditUser` es un componente funcional de React que muestra un formulario en un cajón deslizante para editar la información de un usuario. A continuación, se describe su estructura y funcionalidad:

  - El componente utiliza el hook useState para manejar el estado interno de state, que indica si el cajón deslizante está abierto o cerrado.
  - El componente recibe el prop userId, que representa el ID del usuario que se va a editar.
  - El componente utiliza el hook useState para manejar el estado interno de user, que almacena los datos del usuario que se está editando.
  - El componente utiliza el hook useState para manejar el estado interno de image y previewfile, que representan la imagen seleccionada y su vista previa, respectivamente.
  - El componente define la función toggleDrawer que se utiliza para abrir y cerrar el cajón deslizante.
  - El componente utiliza el hook useForm de React Hook Form para manejar el formulario. Se especifica el esquema de validación utilizando el objeto schema definido con Yup.
  - El componente define la función convertBase64ToImageUrl para convertir una cadena base64 en una URL de imagen.
  - El componente define la función getData para obtener los datos del usuario a través de una petición HTTP utilizando axios.
  - El componente utiliza el hook useEffect para llamar a la función getData al montar el componente.
  - El componente define la función handleChange para manejar los cambios en los campos del formulario.
  - El componente define la función handleFileChange para manejar los cambios en el campo de selección de archivos.
  - El componente define la función handleSubmit para manejar el envío del formulario.
  - El componente utiliza componentes de Material-UI como Drawer, Button, Typography, TextField, - - IconButton, FormControl y FormHelperText para mostrar y capturar datos en el formulario.
  - El componente utiliza el componente personalizado Icon para mostrar iconos en los botones.
  - El componente utiliza la librería axios para enviar una solicitud PUT a la API REST cuando se envía el formulario.

# Vista de la Pagina Web para la edicion de personal

![Docs Version Dropdown](./img/Captura%20de%20pantalla%20(850).png)

Este es el codigo completo.
# Codigo Fuente
```jsx
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
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import Icon from 'src/@core/components/icon';
import axios from 'axios';

const showErrors = (field, valueLen, min) => {
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
  address: yup.string().required(),
  nationality: yup.string().required(),
  email: yup.string().email().required(),
  ci: yup.string().required(),
  phone: yup
    .string()
    .typeError('')
    .min(8, (obj) => showErrors('Celular', obj.value.length, obj.min))
    .required(),
  name: yup
    .string()
    .min(3, (obj) => showErrors('Nombre', obj.value.length, obj.min))
    .required(),
  lastName: yup
    .string()
    .min(3, (obj) => showErrors('Apellido', obj.value.length, obj.min))
    .required(),
});

const defaultValues = {
  name: '',
  lastName: '',
  ci: '',
  email: '',
  phone: '',
  address: '',
  file: '',
  nationality: '',
};

const SidebarEditUser = (props) => {
  const [state, setState] = useState(false);
  const userId = props.userId;
  const [user, setUser] = useState(defaultValues);
  const [image, setImage] = useState(null);
  const [previewfile, setPreviewfile] = useState(null);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      ((event.key === 'Tab' || event.key === 'Shift'))
    ) {
      return;
    }

    setState(open);
  };

  const { reset, control, formState: { errors } } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const convertBase64ToImageUrl = (base64String) => {
    return `data:image/png;base64,${base64String}`;
  };

  const getData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL}${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userId) {
      getData();
    }
  }, [userId]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const reader = new FileReader();
    reader.onload = function () {
      if (reader.readyState === 2) {
        setUser({ ...user, file: reader.result });
      }
    };

    if (e.target.files && e.target.files.length > 0) {
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_PERSONAL}edit/${userId}`, user);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Button
        style={{ color: '#0074D9', borderRadius: '10px' }}
        onClick={toggleDrawer(true)}
      >
        <Icon icon='mdi:pencil-outline' fontSize={20} />
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
          <Typography variant='h6'>Editar Usuario</Typography>
          <IconButton
            size='small'
            onClick={toggleDrawer(false)}
            sx={{ color: 'text.primary' }}
          >
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
                    <img
                      src={convertBase64ToImageUrl(user.file)}
                      alt='Imagen del activo'
                      width={35}
                      height={35}
                      style={{ borderRadius: '50%' }}
                    />
                  </div>
                )}
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <label htmlFor='file'>Imagen</label>
              <input type='file' id='file' name='file' onChange={handleFileChange} />
              <div style={{ textAlign: 'center' }}>
                {previewfile && (
                  <img
                    src={previewfile}
                    alt='Preview'
                    style={{ maxWidth: '100%', maxHeight: '300px' }}
                  />
                )}
              </div>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='name'
                control={control}
                rules={{ required: false }}
                render={({ field })```jsx
                <TextField
                  {...field}
                  label='Nombre'
                  value={user.name}
                  onChange={handleChange}
                  error={Boolean(errors.name)}
                  autoComplete='off'
                />
```

