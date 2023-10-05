// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    // {
    //   title: 'Hogar',
    //   path: '/home',
    //   icon: 'mdi:home-outline',
    // },
    // {
    //   title: 'Mensajes',
    //   path: '/second-page',
    //   icon: 'mdi:email-outline',
    // },
    // {
    //   path: '/acl',
    //   action: 'read',
    //   subject: 'acl-page',
    //   title: 'Control de Acceso',
    //   icon: 'mdi:shield-outline',
    // },
    {
      title: 'Personal',
      icon: 'mdi:account-group',
      children: [
        {
          title: 'Lista de Persona',
          path: '/user/usuario/userlist',
          icon: 'mdi:account-card-details',
        },
      // {
      //   title: 'Vista',
      //   path: '/user/usuario/view/[id]',
      //   icon: 'mdi:eye-outline',            
      // },
      ]
    },
    {
      title: 'Cargos',
      path: '/user/charges/ChargeList',
      icon: 'mdi:clipboard-account',
    },
    {
      title: 'Horarios',
      children: [
        {
          title: 'Lista de Horario',
          path: '/user/horario/listHorario',
          icon: 'mdi:timetable'
          // children: [
          //   {
          //     title: '',
          //     path: '/user/horario/listHorario',
          //     icon: 'mdi:timetable',
          //   },
          //   {
          //     title: 'Detalle De Horario',
          //     path: '/user/usuario/view/detalleHorario/',
          //     icon: 'mdi:timetable',
          //   }
          // ]
        },
      ]
    },

    // title: 'Personal',
    // icon: 'mdi:account-group',
    // children: [
    //   {
    //     title: 'Lista de Persona',
    //     path: '/user/usuario/userlist',
    //     icon: 'mdi:account-card-details',
    //   },
    {
      title: 'Marcar Asistencia',
      path: '/user/Asistencia/controlFacial',
      icon: 'mdi:face-recognition',
    },
    {
      title: 'Planilla de Asistencia',
      path: '/user/Asistencia/planillas',
      icon: 'mdi:clipboard-list',
    },
     
    {
      title: 'Registro de Personal',
      path: '/user/Asistencia/RegistroFacial',
      icon: 'mdi:account-box-outline',
    }
  ]
}

export default navigation
