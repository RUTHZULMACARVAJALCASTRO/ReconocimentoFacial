// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'


const navigation = (): VerticalNavItemsType => {
  return [
    // {
    //   title: 'Roles Y Permisos',
    //   icon: 'mdi:shield-outline',
    //   children: [
    //     {
    //       title: 'Roles',
    //       path: '/user/roles_y_permisos/roles/roles'
    //     },
    //     {
    //       title: 'Permisos',
    //       path: '/user/roles_y_permisos/permisos/TableHeader'
    //     }
    //   ]
    // },

    {
      title: 'Personal',
      icon: 'mdi:account-group',
      children: [
        {
          title: 'Lista de Persona',
          path: '/user/usuario/userlist',
          icon: 'mdi:account-card-details',
         // permissions: 'ACTIVO_OBTENE_DEVOLUCION_ACT'
        },
      ]
    },
    {
      title: 'Cargos',
      path: '/user/charges/ChargeList',
      icon: 'mdi:clipboard-account',
    },
    // {
    //   title: 'Salarios',
    //   path: '/user/salarios/salarios',
    //   icon: 'mdi:clipboard-account',
    // },
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
      title: 'Licencias',
      icon: 'mdi:account-lock',
      path: '/user/licencias/licenseList'
    },
    {
      title: 'Marcar Asistencia',
      path: '/user/Asistencia/controlFacial',
      icon: 'mdi:face-recognition',
      openInNewTab:true,
    },
     
    {
      title: 'Registro de Personal',
      path: '/user/Asistencia/RegistroFacial',
      icon: 'mdi:account-box-outline',
    }
  ]
}

export default navigation



// import { VerticalNavItemsType } from 'src/@core/layouts/types';
// import { findPermission } from 'src/components/findPermission';

// const navigation = (): VerticalNavItemsType => {
//   const personal = [
//     {
//       title: 'Personal',
//       icon: 'mdi:account-group',
//       children: [
//         {
//           title: 'Lista de Persona',
//           path: '/user/usuario/userlist',
//           icon: 'mdi:account-card-details',
//           permissions: 'PERSONAL_MENU_VER_PERSONAL'
//         },
//       ]
//     },
//     {
//       title: 'Cargos',
//       path: '/user/charges/ChargeList',
//       icon: 'mdi:clipboard-account',
//         permissions: 'PERSONAL_MENU_VER_CARGO'
//     },
//     {
//       title: 'Horarios',
//       icon: 'mdi:timetable',
//       children: [
//         {
//           title: 'Lista de Horario',
//           path: '/user/horario/listHorario',
//           icon: 'mdi:timetable',
//           permissions: 'PERSONAL_MENU_VER_HORARIO'
          
//         }
//       ]
//     },
//     {
//       title: 'Planilla de Asistencia',
//       path: '/user/Asistencia/planillas',
//       icon: 'mdi:clipboard-list',
//       permissions: 'PERSONAL_MENU_VER_PLANILLA_ASISTENCIA'
//     },
//     {
//       title: 'Licencias',
//       icon: 'mdi:account-lock',
//       path: '/user/licencias/licenseList',
//       permissions: 'PERSONAL_MENU_VER_LICENCIAS'
//     },
//     {
//       title: 'Marcar Asistencia',
//       path: '/user/Asistencia/controlFacial',
//       icon: 'mdi:face-recognition',
//       openInNewTab:true,
//       permissions: 'PERSONAL_MENU_VER_MARCAR_ASISTENCIA'
//     },
//     {
//       title: 'Registro de Personal',
//       path: '/user/Asistencia/RegistroFacial',
//       icon: 'mdi:account-box-outline',
//       permissions: 'ACTIVO_OBTENE_DEVOLUCION_ACT'
//     }
    
//   ];



//   return [
//     {
//       title: 'Inicio',
//       path: '/home',
//       icon: 'mdi:home-outline'
//     },
//   ];
// };

// export default navigation;
