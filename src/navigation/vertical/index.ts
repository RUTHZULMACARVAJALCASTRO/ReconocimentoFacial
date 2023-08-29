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
            title: 'Lista Usuario',
            path: '/user/usuario/userlist',
            icon: 'mdi:account-check',
          },
          {
            title: 'Cargos',
            path: '/user/charges/ChargeList',
            icon: 'mdi:account-group',
          },
        ]
    },
    {
      title: 'Creacion de Horarios',
      icon: 'mdi:account-clock',
      children: [
        {
          title: 'Horarios',
          path: '/user/horario/listHorario',
          icon: 'mdi:account-clock-outline',
        },
        // {
        //   title: 'Horarios Especiales',
        //   path: '/user/horariosEspeciales/listSchedule',
        //   icon: 'mdi:account-clock-outline',
        // },
  
        
      ]
  }, 
    {
      title: 'Control de Asistencia',
      icon: 'mdi:account-circle-outline',
      children: [
        {
          title: 'Reconocimiento Facial',
          path: '/user/usuario/camara/Camera',
          icon: 'mdi:account-arrow-right',
        },
      ]
  },  
 
  ]
}

export default navigation
