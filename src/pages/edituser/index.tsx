import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container, Grid } from '@mui/material';

interface User {
  name: string;
  lastName: string;
  ci: string;
  email: string;
  phone: string;
  direction: string;
  nationality: string;
}

const CreateUser: React.FC = () => {
  const [user, setUser] = useState<User>({
    name: '',
    lastName: '',
    ci: '',
    email: '',
    phone: '',
    direction: '',
    nationality: ''
  });

  const [errors, setErrors] = useState<Partial<User>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear the error for the field being edited

    console.log( typeof user.ci )
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formErrors: Partial<User> = {};

    // Validate required fields
    if (!user.name) {
      formErrors.name = 'El nombre es obligaotorio';
    }
    if (!user.lastName) {
      formErrors.lastName = 'El apellido es obligaotorio';
    }
    if ( !user.ci  ) {
      formErrors.ci = 'CI is required';
    }
    if (!user.email) {
      formErrors.email = 'Email is required';
    }
    if (!user.phone) {
      formErrors.phone = 'Phone is required';
    }
    if (!user.direction) {
      formErrors.direction = 'Direction is required';
    }
    if (!user.nationality) {
      formErrors.nationality = 'Nationality is required';
    }

    // Set the errors if any
    setErrors(formErrors);

    // Submit the form if there are no errors
    if (Object.keys(formErrors).length === 0) {
      axios
        .post<User>('https://late-pine-8921.fly.dev/api/personal', user)
        .then(response => {
          console.log(response.data);
          // Realizar acciones adicionales después de enviar los datos exitosamente
        })
        .catch(error => {
          console.error(error);
          // Manejar el error en caso de que la solicitud falle
        });
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Create User
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
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="CI"
              name="ci"
              value={user.ci }
              onChange={ handleChange }
              error={!!errors.ci}
              helperText={errors.ci}
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
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Direction"
              name="direction"
              value={user.direction}
              onChange={handleChange}
              error={!!errors.direction}
              helperText={errors.direction}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nationality"
              name="nationality"
              value={user.nationality}
              onChange={handleChange}
              error={!!errors.nationality}
              helperText={errors.nationality}
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

         




