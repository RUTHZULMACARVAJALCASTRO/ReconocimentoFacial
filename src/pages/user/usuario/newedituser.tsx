import { TextField, Button } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';


interface UserData {
    name: string
    lastName: string
    ci: string
    email: string
    phone: string
    direction: string
    nationality: string
  }
const EditUserPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user,setUser]=useState<UserData>({
    name: '',
    lastName: '',
    ci: '',
    email: '',
    phone: '',
    direction: '',
    nationality: '',
  });
  
  const{name,lastName,ci,email,phone,direction,nationality}=user
  const onInputChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    setUser({...user,[e.target.name]:e.target.value})
  }
  const getData = async() => {
    await axios
      .get<UserData>(`${process.env.NEXT_PUBLIC_PERSONAL}${id}`)
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
    await axios.put(`${process.env.NEXT_PUBLIC_PERSONAL}${id}`, user);
  }
  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);
  function clickOpenCard(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div>
      <h2>EDITAR INFORMACION DEL USUARIO{id}</h2>
      <form onSubmit={OnSubmit}>
        <TextField  
          id="filled-basic"  
          variant="filled"
          label="Nombre"
          name="name"
          value={user.name}
          onChange={onInputChange}
          fullWidth
          margin="normal"
          autoComplete='off'
        />
        <TextField  
          id="filled-basic"
          variant="filled"
          label="Apellido"
          name="lastName"
          value={user.lastName}
          onChange={onInputChange}
          fullWidth
          margin="normal"
          autoComplete='off'
        />
        <TextField
          id="filled-basic"
          variant="filled"
          label="Cedula de identidad"
          name="ci"
          value={user.ci}
          onChange={onInputChange}
          fullWidth
          margin="normal"
          autoComplete='off'
        />
        <TextField
          label="Corro Electronico"
          name="email"
          value={user.email}
          onChange={onInputChange}
          fullWidth
          margin="normal"
          id="filled-basic"
          variant="filled"
          autoComplete='off'
        />
        <TextField
          label="Celular"
          name="phone"
          value={user.phone}
          onChange={onInputChange}
          fullWidth
          margin="normal"
          id="filled-basic"
          variant="filled"
          autoComplete='off'
        />
        <TextField
          label="Direccion"
          name="direction"
          value={user.direction}
          onChange={onInputChange}
          fullWidth
          margin="normal"
          id="filled-basic"
          variant="filled"
          autoComplete='off'
        />
        <TextField
          label="Nacionalidad"
          name="nationality"
          value={user.nationality}
          onChange={onInputChange}
          fullWidth
          margin="normal"
          id="filled-basic"
          variant="filled"
          autoComplete='off'
        />
        <Button variant='contained' sx={{ mr: 1 }} >
                  ACEPTAR
        </Button>
        <Button variant='outlined' color='secondary' onClick={()=>clickOpenCard()}>
                  CANCELAR
        </Button>
      </form>
    </div>
  );
}

export default EditUserPage;
