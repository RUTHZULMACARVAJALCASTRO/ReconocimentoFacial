// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'


const navigation = (): VerticalNavItemsType => {
  return [
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
