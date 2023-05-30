import React, { useState } from 'react';
import axios, { Axios } from 'axios';
import { TextField, Button, Typography, Container, Grid } from '@mui/material';

interface user{
  name:string
  lastName:string
  ci:string
  email:string
  phone:string
  direction:string
  nationality:string
}
const CreateUser: React.FC = () => { 

  const [user, setUser] = useState<user>({
    name: '',
    lastName: '',
    ci:'',
    email: '',
    phone: '',
    direction: '',
    nationality: '',
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)  => {
    e.preventDefault();

    try {
      const response = await axios.post<user>('https://late-pine-8921.fly.dev/api/personal', user);
    } catch (error) {
      console.error('hay un error');
    }


  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Registrar Personal
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={user.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="CI"
              name="ci"
              type= "ci"
              value={user.ci }
              onChange={ handleChange }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={user.phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Direction"
              name="direction"
              value={user.direction}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nationality"
              name="nationality"
              value={user.nationality}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Create
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default CreateUser;

         




