// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Button } from '@mui/material'
import { Login, Redirect } from 'src/services/services'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import axios from 'axios'
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import { WindowSharp } from '@mui/icons-material'

const useStyles = makeStyles((theme) => ({
  card: {
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  title: {
    //color: primary,
    fontWeight: 'bold',
  },
  content: {
    textAlign: 'center',
  },
}));

const Home = () => {
  const router = useRouter()
  const id = router.query.id
  const token = router.query.token

  // if (id !== undefined) window.localStorage.setItem("id", id.toString())
  if (token !== undefined) window.localStorage.setItem("token", token.toString())
  //const id = '638f4aed-5a41-4a9a-9d1a-0f3e3f1e66dd'
  //const token =
  // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiI2NDdmOTBjMDU5YzE2OWI5OGVmMzVhZmIiLCJBcHAiOnsiMCI6eyJ1dWlkIjoiZGFmM2U4NDItZTA2NS00MGRmLWJlMjgtZjBjOTk2NjdmYTBkIiwibmFtZSI6InBlcnNvbmFsIiwidXJsIjoiaHR0cDovLzEwLjEwLjIxNC4yMTk6MzAwNi9ob21lIn0sIjEiOnsidXVpZCI6IjYzOGY0YWVkLTVhNDEtNGE5YS05ZDFhLTBmM2UzZjFlNjZkZCIsIm5hbWUiOiJhY3Rpdm8iLCJ1cmwiOiJodHRwOi8vMTAuMTAuMjE0LjIxOTozMDUwL2hvbWUifX0sImlhdCI6MTY4Nzk4Nzk2NiwiZXhwIjoxNjg4MDA5NTY2fQ.ULVJ61tQ-ocAu1fmEqh7vQrO_cxkbAQvr62Grbe2cgM'




  const permissions = async (token: string) => {
    try {
      console.log('auth/decoded')

      // window.localStorage.setItem('TokenLogin', token)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_CENTRAL}auth/decoded`, {
        token: token
      })
      console.log('decoded token login roles: ' + response.data.id)

      const id = response.data.id
      window.localStorage.setItem('id', id)

      console.log('roles: ', response.data.roles)

      let permisos
      const permisosLista = []
      for (let j = 0; j < response.data.roles.length; j++) {
        permisos = response.data.roles[j].permissionName
        const keyPermisos = Object.keys(permisos)
        const permisosLength = keyPermisos.length
        console.log('length: ' + permisosLength)

        for (let i = 0; i < permisosLength; i++) {
          console.log('for: ' + i)
          try {
            console.log('auth/decoded')
            const respon = await axios.get(
              `${process.env.NEXT_PUBLIC_API_CENTRAL}permission/${response.data.roles[j].permissionName[i]}`
            )
            permisosLista.push(respon.data.permissionName)
          } catch (error) {
            console.log(error)
          }
        }
      }

      const arrayPermisos = JSON.stringify(permisosLista)
      window.localStorage.setItem('permisos', arrayPermisos)
      console.log('permisos' + arrayPermisos)
    } catch (error) {
      console.log(error)
    }
  }

  if (token !== undefined) permissions(token.toString())

  if (id && token) {
    Redirect(id.toString(), token.toString())
  }
  // if(id && token){
  //   const app = id
  //   const data= {app, token}
  //  const res = await axios.post('+',data)
  // }else{
  //   router.push('192.168.151.21:3000/home')
  // }

  const getDataLogin = async () => {
    const form = {
      email: 'string@gmail.com',
      password: '12345678'
    }

    alert(process.env.NEXT_PUBLIC_API_PERSONAL)
    await Login(form)
      .then(result => {
        alert(JSON.stringify(result))
        localStorage.setItem('token', result.response.token)
      })
      .catch(e => {
        alert(JSON.stringify(e))
      })
  }


  const classes = useStyles();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card className={classes.card}>
          <CardHeader title='Bienvenido a nuestro Sistema de Recursos Humanos 🌟' className={classes.title} />
          <CardContent className={classes.content}>
            <Typography variant="body1">
              ¡Pon en marcha tu gestión de recursos humanos de manera eficiente y moderna!
            </Typography>
            <Typography variant="body2">
              Descubre todas las herramientas que necesitas para gestionar el talento de tu organización.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Home