---
id: configuracion
sidebar_position: 1
title: Configuración JWT y URLs
---

En esta sección, se detallan las configuraciones necesarias para JWT y las URL utilizadas en la aplicación.

## Configuración JWT

Las siguientes variables de entorno se utilizan para la configuración JWT:

- `NEXT_PUBLIC_JWT_EXPIRATION`: Define el tiempo de expiración de los tokens JWT. En este caso, está configurado en 5 minutos (`5m`).
- `NEXT_PUBLIC_JWT_SECRET`: Representa la clave secreta utilizada para firmar y verificar los tokens JWT. En este caso, el valor es `dd5f3089-40c3-403d-af14-d0c228b05cb4`.
- `NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET`: Es la clave secreta utilizada para la generación y verificación de los tokens de actualización JWT. El valor asignado es `7c4c1c50-3230-45bf-9eae-c9b2e401c767`.

## URLs

Estas son las URLs utilizadas en la aplicación:

- `NEXT_PUBLIC_PERSONAL`: URL de la API para acceder a recursos relacionados con el personal. En este caso, la URL es `http://10.10.214.219:3300/api/personal/`.
- `NEXT_PUBLIC_UNITYS`: URL de la aplicación Unitys. Puedes acceder a ella en `http://10.10.214.219:3000/`.
- `NEXT_PUBLIC_URL_CENTRAL`: URL de la aplicación Central. La URL completa es `http://10.10.214.219:3005`.
- `NEXT_PUBLIC_URL_API_CENTRAL`: URL de la API de Central para la autenticación. La URL completa es `http://10.10.214.219:3300/api/central/login-central`.

Asegúrate de utilizar estas configuraciones y URLs en la configuración de tu aplicación según sea necesario.

