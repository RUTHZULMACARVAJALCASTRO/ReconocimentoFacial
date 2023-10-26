// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'


const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Roles Y Permisos',
      icon: 'mdi:shield-outline',
      children: [
        {
          title: 'Roles',
          path: '/user/roles_y_permisos/roles/roles'
        },
        {
          title: 'Permisos',
          path: '/user/roles_y_permisos/permisos/TableHeader'
        }
      ]
    },

    {
      title: 'Personal',
      icon: 'mdi:account-group',
      children: [
        {
          title: 'Lista de Persona',
          path: '/user/usuario/userlist',
          icon: 'mdi:account-card-details',
        },
      ]
    },
    {
      title: 'Cargos',
      path: '/user/charges/ChargeList',
      icon: 'mdi:clipboard-account',
    },
    {
      title: 'Salarios',
      path: '/user/salarios/salarios',
      icon: 'mdi:clipboard-account',
    },
    {
      title: 'Horarios',
      icon: 'mdi:timetable',
      children: [
        {
          title: 'Lista de Horario',
          path: '/user/horario/listHorario',
          icon: 'mdi:timetable'
          
        }
      ]
    },

    
    
    {
      title: 'Planilla de Asistencia',
      path: '/user/Asistencia/planillas',
      icon: 'mdi:clipboard-list',
    },
    {
      title: 'Permisos y Licencias',
      icon: 'mdi:account-lock',
      children: [
        {
          title: 'Permisos',
          path: '/user/permisos_y_licencias/permisos/permisos'
        },
        // {
        //   title: 'Licencias',
        //   path: '/user/permisos_y_licencias/licencias/licencias'
        // }
        {
          title: 'Licencias',
          path: '/user/permisos_y_licencias/licencias/licencias'
        }
      ]
    },
    {
      title: 'Marcar Asistencia',
      path: '/user/Asistencia/controlFacial',
      icon: 'mdi:face-recognition',
      // openInNewTab:true,
 
    },
     
    {
      title: 'Registro de Personal',
      path: '/user/Asistencia/RegistroFacial',
      icon: 'mdi:account-box-outline',
    }
  ]
}

export default navigation
