---
id: funciones
title: Funciones de Autenticación
---

En esta sección, se describen las funciones relacionadas con la autenticación utilizadas en la aplicación.
`services/services.js`
## Función Login

La función `Login` se utiliza para realizar la autenticación de un usuario en el sistema.

```typescript
import { apiCall } from './config'
import axios from 'axios'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'

export const Login = async (data: ParsedUrlQuery) => {
  const options = {
    url: '/central/login-central',
    method: 'POST',
    data: data
  }
  console.log(options)
  return await apiCall(options)
    .then(result => {
      console.log(result)
      return result
    })
    .catch(e => {
      console.log(e)
      throw e
    })

  return
}
```
Esta función realiza una solicitud POST a la URL `/central/login-central` con los datos proporcionados. Utiliza la función apiCall de `config.ts` para realizar la llamada a la API. Devuelve el resultado de la llamada a la API.

# Función Redirect

La función Redirect se utiliza para redirigir al usuario después de la autenticación exitosa.
```typescript
export async function Redirect(id: string, token: string) {
  if (id !== undefined && token !== undefined) {
    console.log("data: " + id + " " + token)
    const router = useRouter()
    const app = id;
    console.log('app', app)
    console.log('tokennnnnnn', token)

    if (app && token) {
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_URL_API_CENTRAL}`, { app, token })
        localStorage.setItem('token', res.data)
        const tokenExist = localStorage.getItem('token');
        router.replace('http://10.10.214.219:3006/home/');
        if (!tokenExist) {
          router.push(`${process.env.NEXT_PUBLIC_URL_CENTRAL}/login`)
        }

        if (res.status === 401 || res.status === 404) {
          router.push(`${process.env.NEXT_PUBLIC_URL_CENTRAL}/login`)
        }
      } catch (error: any) {
        alert(error.response.data.message)
        router.push(`${process.env.NEXT_PUBLIC_URL_CENTRAL}/login`)
      }
    } else {
      router.push(`${process.env.NEXT_PUBLIC_URL_CENTRAL}/login`)
    }
  }
}
```
Esta función se encarga de redirigir al usuario después de la autenticación exitosa. Toma los parámetros `id` y `token` y realiza una solicitud POST a la URL` ${process.env.NEXT_PUBLIC_URL_API_CENTRAL} `para verificar la autenticación. Almacenará el token en el almacenamiento local (`localStorage`) y realizará la redirección a la URL `http://10.10.214.219:3006/home/`. Si no se encuentra el token o la solicitud devuelve un estado 401 o 404, se redirige al usuario a la página de inicio de sesión.

Asegúrate de utilizar estas funciones de acuerdo con los requisitos de tu aplicación.