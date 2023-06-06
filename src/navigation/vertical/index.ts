// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Hogar',
      path: '/home',
      icon: 'mdi:home-outline',
    },
    {
      title: 'Mensajes',
      path: '/second-page',
      icon: 'mdi:email-outline',
    },
    {
      path: '/acl',
      action: 'read',
      subject: 'acl-page',
      title: 'Control de Acceso',
      icon: 'mdi:shield-outline',
    },
    {
        title: 'Usuario',
        icon: 'mdi:account-outline',
        children: [
          {
            title: 'Nuevo Usuario',
            path: '/user/usuario/userlist',
            icon: 'mdi:account-check',
          },
          {
            title: 'Vista de Usuario',
            path: '/user/usuario/view',
            icon: 'mdi:account-group',
          },
        ]
    },
    {
      title: 'Imagen',
      icon: 'mdi:account-outline',
      children: [
        {
          title: 'Base64',
          path: '/user/usuario/base64/base64',
          icon: 'mdi:account-box-outline',
        },
        {
          title: 'Archivo base64',
          path: '/user/usuario/base64/imagen',
          icon: 'mdi:account-box-multiple-outline',
        },
      ]
    },
    
      
  ]
}

export default navigation
