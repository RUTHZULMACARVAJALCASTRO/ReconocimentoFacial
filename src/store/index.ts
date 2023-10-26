// ** Toolkit imports
import { combineReducers } from '@reduxjs/toolkit'
import userReducer from 'src/store/apps/user';
import chargeReducer from 'src/store/apps/charge'
import scheduleReducer from 'src/store/apps/schedule'
import licenseReducer from 'src/store/apps/license'
// ** Reducers

export const rootReducer = combineReducers({
  users: userReducer,
  charges: chargeReducer,
  schedules: scheduleReducer,
  licenses: licenseReducer,
})

export type RootState = ReturnType<typeof rootReducer>;