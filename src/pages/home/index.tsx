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

const Home = () => {
  const router = useRouter()
  //const { id, token } = router.query
  //console.log(id, token)
  const id = router.query.id
  const token = router.query.token
  //const id = '638f4aed-5a41-4a9a-9d1a-0f3e3f1e66dd'
  //const token =
  // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiI2NDdmOTBjMDU5YzE2OWI5OGVmMzVhZmIiLCJBcHAiOnsiMCI6eyJ1dWlkIjoiZGFmM2U4NDItZTA2NS00MGRmLWJlMjgtZjBjOTk2NjdmYTBkIiwibmFtZSI6InBlcnNvbmFsIiwidXJsIjoiaHR0cDovLzEwLjEwLjIxNC4yMTk6MzAwNi9ob21lIn0sIjEiOnsidXVpZCI6IjYzOGY0YWVkLTVhNDEtNGE5YS05ZDFhLTBmM2UzZjFlNjZkZCIsIm5hbWUiOiJhY3Rpdm8iLCJ1cmwiOiJodHRwOi8vMTAuMTAuMjE0LjIxOTozMDUwL2hvbWUifX0sImlhdCI6MTY4Nzk4Nzk2NiwiZXhwIjoxNjg4MDA5NTY2fQ.ULVJ61tQ-ocAu1fmEqh7vQrO_cxkbAQvr62Grbe2cgM'
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

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Pon en marcha tu proyecto 🚀'></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }}>Todo lo mejor para tu nuevo proyecto.</Typography>
            <Typography>
              Asegúrese de leer nuestra documentación de plantilla para comprender a dónde ir desde aquí y cómo utilizar nuestra
              plantilla.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='ACL y JWT 🔒'></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }}>
              El control de acceso (ACL) y la autenticación (JWT) son las dos características de seguridad principales de nuestra plantilla y son
              implementado también en el kit de inicio.
            </Typography>
            <Typography>Lea nuestra documentación de autenticación y ACL para aprovecharla al máximo..</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Home