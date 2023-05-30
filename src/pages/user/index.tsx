import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Grid, TextField, ThemeProvider, createTheme, Typography, Drawer } from '@mui/material';
import { styled } from '@mui/material/styles';

interface User {
  _id: string;
  name: string;
  lastName: string;
  ci: string;
  email: string;
  phone: string;
  direction: string;
  nationality: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get<User[]>('https://late-pine-8921.fly.dev/api/personal')
      .then(response => {
        const { data } = response;
        setUsers(data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleDelete = (userId: string) => {
    const confirmar = window.confirm('¿Deseas eliminar este registro?');
    if (confirmar) {
      axios
        .delete(`https://late-pine-8921.fly.dev/api/personal/${userId}`)
        .then(response => {
          console.log(response.data);
          fetchData();
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  const handleEdit = (user: User) => {
    setEditedUser(user);
  };

  const handleSave = () => {
    if (editedUser) {
      axios
        .put(`https://late-pine-8921.fly.dev/api/personal/${editedUser._id}`, editedUser)
        .then(response => {
          console.log(response.data);
          setEditedUser(null);
          fetchData();
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  const handleCancel = () => {
    setEditedUser(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedUser) {
      setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
    }
  };

  const handleThemeChange = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const themeConfig = createTheme({
    typography: {
      fontFamily: 'Arial',
      fontSize: 16,
    },
    palette: {
      mode: theme,
      primary: {
        main: theme === 'light' ? '#1976d2' : '#90caf9',
      },
      error: {
        main: '#f44336',
      },
    },
  });

  const StyledDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
      width: { xs: 300, sm: 400 },
    },
  }));

  const StyledForm = styled('form')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    margin: theme.spacing(2),
  }));

  const StyledButtonContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
  }));

  const StyledContainer = styled(Grid)(({ theme }) => ({
    marginTop: theme.spacing(2),
  }));

  const StyledCard = styled('div')(({ theme }) => ({
    padding: theme.spacing(2),
    border: theme.palette.mode === 'light' ? '1px solid #ddd' : '1px solid #333',
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.mode === 'light' ? '#f9f9f9' : '#333',
  }));

  const handleRedirect = (userId: string) => {
    // Redireccionar a una ruta específica después de editar el usuario
    // Aquí puedes agregar tu lógica para redireccionar a la página deseada
    console.log(`Redireccionando a la página del usuario con ID: ${userId}`);
  };

  return (
    <ThemeProvider theme={themeConfig}>
      <div>
        <Typography variant="h4" component="h1">User List</Typography>
        <StyledContainer container spacing={2}>
          {users.map(user => (
            <StyledCard  key={user._id}>
              {editedUser && editedUser._id === user._id ? (
                <StyledForm>
                  <TextField
                    name="name"
                    label="Name"
                    value={editedUser.name}
                    onChange={handleInputChange}
                  />
                  <TextField
                    name="lastName"
                    label="Last Name"
                    value={editedUser.lastName}
                    onChange={handleInputChange}
                  />
                  <TextField
                    name="ci"
                    label="CI"
                    value={editedUser.ci}
                    onChange={handleInputChange}
                  />
                  <TextField
                    name="email"
                    label="Email"
                    value={editedUser.email}
                    onChange={handleInputChange}
                  />
                  <TextField
                    name="phone"
                    label="Phone"
                    value={editedUser.phone}
                    onChange={handleInputChange}
                  />
                  <TextField
                    name="direction"
                    label="Direction"
                    value={editedUser.direction}
                    onChange={handleInputChange}
                  />
                  <TextField
                    name="nationality"
                    label="Nationality"
                    value={editedUser.nationality}
                    onChange={handleInputChange}
                  />
                  <StyledButtonContainer>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                      Save
                    </Button>
                    <Button variant="contained" color="error" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </StyledButtonContainer>
                </StyledForm>
              ) : (
                <div>
                  <Typography variant="body1">Name: {user.name}</Typography>
                  <Typography variant="body1">Last Name: {user.lastName}</Typography>
                  <Typography variant="body1">CI: {user.ci}</Typography>
                  <Typography variant="body1">Email: {user.email}</Typography>
                  <Typography variant="body1">Phone: {user.phone}</Typography>
                  <Typography variant="body1">Direction: {user.direction}</Typography>
                  <Typography variant="body1">Nationality: {user.nationality}</Typography>
                  <StyledButtonContainer>
                    <Button variant="contained" color="primary" onClick={() => handleEdit(user)}>
                      Editar
                    </Button>
                    <Button variant="contained" color="error" onClick={() => {
                      handleDelete(user._id);
                      handleRedirect(user._id);
                    }}>
                      Eliminar
                    </Button>
                  </StyledButtonContainer>
                </div>
              )}
            </StyledCard>
          ))}
        </StyledContainer>
        <Button variant="contained" onClick={fetchData}>
          Actualizar
        </Button>
      </div>
    </ThemeProvider>
  );
};

export default UserList;
