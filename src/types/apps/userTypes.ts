// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

export type UsersType = {
  _id: string
  name: string
  lastName: string
  ci: string
  email: string
  phone: string
  direction: string
  nationality: string
  
}

export type ProjectListDataType = {
  id: number
  img: string
  hours: string
  totalTask: string
  projectType: string
  projectTitle: string
  progressValue: number
  progressColor: ThemeColor
}
