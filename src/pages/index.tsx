import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button, Grid, MenuItem, TextField, ThemeProvider, createTheme } from '@mui/material'

interface User {
  id: string
  name: string
  lastName: string
  ci: number
  email: string
  phone: number
  direction: string
  nationality: string
  editing: boolean // Nuevo campo
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [editedUser, setEditedUser] = useState<User | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    axios
      .get<User[]>('https://late-pine-8921.fly.dev/api/personal')
      .then(response => {
        const { data } = response
        setUsers(data)
      })
      .catch(error => {
        console.error(error)
      })
  }

  const handleDelete = (userId: string) => {
    axios
      .delete(`https://late-pine-8921.fly.dev/api/personal/${userId}`)
      .then(response => {
        console.log(response.data)

        // Realizar acciones adicionales después de eliminar el usuario exitosamente
        fetchData() // Actualizar la lista de usuarios después de eliminar uno
      })
      .catch(error => {
        console.error(error)

        // Manejar el error en caso de que la solicitud falle
      })
  }

  const handleEdit = (user: User) => {
    setEditedUser(user)
  }

  const handleSave = () => {
    if (editedUser) {
      axios
        .put(`https://late-pine-8921.fly.dev/api/personal/${editedUser.id}`, editedUser)
        .then(response => {
          console.log(response.data)

          // Realizar acciones adicionales después de guardar los cambios exitosamente
          setEditedUser(null) // Finalizar la edición del usuario
          fetchData() // Actualizar la lista de usuarios después de guardar los cambios
        })
        .catch(error => {
          console.error(error)

          // Manejar el error en caso de que la solicitud falle
        })
    }
  }

  const handleCancel = () => {
    setEditedUser(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedUser) {
      setEditedUser({ ...editedUser, [e.target.name]: e.target.value })
    }
  }

  const handleThemeChange = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const themeConfig = createTheme({
    palette: {
      mode: theme,
      primary: {
        main: theme === 'light' ? '#1976d2' : '#90caf9'
      },
      error: {
        main: '#f44336'
      }
    },
    components: {
      MuiMenuItem: {
        styleOverrides: {
          root: {
            backgroundColor: theme === 'light' ? '#f5f5f5' : '#424242',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '10px'
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            margin: '10px'
          }
        }
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            margin: '10px'
          }
        }
      }
    }
  })

  return (
    <ThemeProvider theme={themeConfig}>
      <div style={{ backgroundColor: theme === 'light' ? '#fff' : '#333', padding: '20px' }}>
        <h1>User List</h1>
        <Grid container spacing={2}>
          {users.map(user => (
            <Grid item xs={12} key={user.id}>
              {editedUser && editedUser.id === user.id ? (
                <form>
                  <TextField name='name' label='Name' value={editedUser.name} onChange={handleInputChange} />
                  <TextField
                    name='lastName'
                    label='Last Name'
                    value={editedUser.lastName}
                    onChange={handleInputChange}
                  />
                  <TextField
                    name='ci'
                    label='CI'
                    value={editedUser.ci}
                    onChange={handleInputChange}
                    InputProps={{
                      style: {
                        backgroundColor: theme === 'light' ? '#f5f5f5' : '#424242'
                      }
                    }}
                  />
                  <TextField name='email' label='Email' value={editedUser.email} onChange={handleInputChange} />
                  <TextField
                    name='phone'
                    label='Phone'
                    value={editedUser.phone}
                    onChange={handleInputChange}
                    InputProps={{
                      style: {
                        backgroundColor: theme === 'light' ? '#f5f5f5' : '#424242'
                      }
                    }}
                  />
                  <TextField
                    name='direction'
                    label='Direction'
                    value={editedUser.direction}
                    onChange={handleInputChange}
                  />
                  <TextField
                    name='nationality'
                    label='Nationality'
                    value={editedUser.nationality}
                    onChange={handleInputChange}
                  />
                  <Button variant='contained' color='primary' onClick={handleSave}>
                    Save
                  </Button>
                  <Button variant='contained' color='error' onClick={handleCancel}>
                    Cancel
                  </Button>
                </form>
              ) : (
                <MenuItem>
                  {user.name} - {user.lastName} - {user.ci} - {user.email} - {user.phone} - {user.direction} -{' '}
                  {user.nationality}
                  <Button variant='contained' color='primary' onClick={() => handleEdit(user)}>
                    Edit
                  </Button>
                  <Button variant='contained' color='error' onClick={() => handleDelete(user.id)}>
                    Delete
                  </Button>
                </MenuItem>
              )}
            </Grid>
          ))}
        </Grid>
        <Button variant='contained' onClick={fetchData}>
          Refresh
        </Button>
        <Button variant='contained' onClick={handleThemeChange}>
          Toggle Theme
        </Button>
      </div>
    </ThemeProvider>
  )
}

export default UserList
