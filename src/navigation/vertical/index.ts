// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Home',
      path: '/home',
      icon: 'mdi:home-outline'
    },
    {
      title: 'Second Page',
      path: '/second-page',
      icon: 'mdi:email-outline'
    },
    {
      path: '/acl',
      action: 'read',
      subject: 'acl-page',
      title: 'Access Control',
      icon: 'mdi:shield-outline'
    },
    {
      path: '/user',
      action: 'read',
      subject: 'acl-page',
      title: 'List',
      icon: 'mdi:account-outline'
    },
    {
      path: '/newUser',
      action: 'read',
      subject: 'acl-page',
      title: 'new user',
      icon: 'mdi:account-outline'
    }
  ]
}

export default navigation
