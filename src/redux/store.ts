import { configureStore } from '@reduxjs/toolkit'
import counterReducer from 'src/redux/slices/counterSlice'
import userReducer from 'src/store/apps/user'
import chargeReducer from 'src/store/apps/charge'
import scheduleReducer from 'src/store/apps/schedule'
import licenseReducer from 'src/store/apps/license';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    users: userReducer,
    charges: chargeReducer,
    schedules: scheduleReducer,
    license: licenseReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
