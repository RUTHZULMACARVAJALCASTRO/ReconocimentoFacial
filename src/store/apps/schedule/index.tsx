// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { UserData } from '../user';
// import { Docu } from 'src/pages/user/horario/listHorario';

// // Tipo de los datos del horario
// interface ScheduleNormal {
//     day: number;
//     into: string;
//     out: string;
//     intoTwo: string;
//     outTwo: string;
//     toleranceInto: number;
//     toleranceOut: number;
// }

// interface ScheduleSpecial {
//     name: string;
//     day: number;
//     into: string;
//     out: string;
//     intoTwo: string;
//     outTwo: string;
//     toleranceInto: number;
//     toleranceOut: number;
//     permanente: boolean;
//     dateRange: [string | null, string | null];
//     usersAssigned: string[];
// }

// interface ScheduleData {
//     createdAt: string | number | Date;
//     _id?: string;
//     name: string;
//     scheduleNormal: ScheduleNormal[];
//     scheduleSpecial: ScheduleSpecial[];
//     isActive?: boolean;
// }

// interface ScheduleState {
//     data: ScheduleData | null;
//     list: ScheduleData[];
//     status: 'idle' | 'loading' | 'succeeded' | 'failed';
//     error: string | null;
// }

// const initialState: ScheduleState = {
//     data: null,
//     list: [],
//     status: 'idle',
//     error: null
// };

// type PartialScheduleData = Partial<ScheduleData>;

// export const addSchedule = createAsyncThunk(
//     'schedules/addSchedules',
//     async (schedule: ScheduleData) => {
//         const response = await axios.post(`${process.env.NEXT_PUBLIC_PERSONAL_SCHEDULE}`, schedule);
//         return response.data;
//     }
// );

// export const fetchSchedules = createAsyncThunk(
//     'schedules/fetchSchedules',
//     async (): Promise<ScheduleData[]> => {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_SCHEDULE}`);
//         return response.data;
//     }
// )

// export const editSchedule = createAsyncThunk(
//     'schedules/editSchedules',
//     async (updateSchedule: PartialScheduleData): Promise<ScheduleData> => {
//         if (!updateSchedule._id) {
//             throw new Error('Se requiere el ID del horario para actualizar');
//         }

//         const response = await axios.put(`${process.env.NEXT_PUBLIC_PERSONAL_SCHEDULE}edit/${updateSchedule._id}`, updateSchedule);

//         if (!response.data || response.status !== 200) {
//             throw new Error('Error al actualizar el horario');
//         }
//         return response.data;
//     }
// )
// export const toggleScheduleStatus = createAsyncThunk(
//     'schedules/toggleActivation',
//     async ({ scheduleId, isActive }: { scheduleId: string; isActive: boolean }): Promise<Docu> => {
//         const response = await axios.put(`${process.env.NEXT_PUBLIC_PERSONAL_SCHEDULE}${scheduleId}`, { isActive: isActive });

//         if (!response.data || response.status !== 200) {
//             throw new Error('Error al cambiar el estado de activación del cargo');
//         }

//         return response.data;
//     }
// );

// const scheduleSlice = createSlice({
//     name: 'schedule',
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(addSchedule.pending, (state) => {
//                 state.status = 'loading';
//             })
//             .addCase(addSchedule.fulfilled, (state, action) => {
//                 state.status = 'succeeded';
//                 state.list.push(action.payload);
//                 state.data = action.payload;
//             })
//             .addCase(addSchedule.rejected, (state, action) => {
//                 state.status = 'failed';
//                 state.error = action.error.message || null;
//             })
//             .addCase(fetchSchedules.fulfilled, (state, action) => {
//                 state.list = action.payload
//             })
//             .addCase(editSchedule.pending, (state) => {
//                 state.status = 'loading';
//             })
//             .addCase(editSchedule.fulfilled, (state, action: PayloadAction<ScheduleData>) => {
//                 state.status = 'succeeded';
//                 const index = state.list.findIndex(schedule => schedule._id === action.payload._id);
//                 if (index !== -1) {
//                     state.list[index] = action.payload;
//                 }
//             })
//             .addCase(editSchedule.rejected, (state, action) => {
//                 state.status = 'failed';
//                 state.error = action.error.message || null;
//             })
//             .addCase(toggleScheduleStatus.pending, (state, action) => {
//                 state.status = 'loading';
//                 const schedule = state.list.find(schedule => schedule._id === action.meta.arg.scheduleId);
//                 if (schedule) {
//                     schedule.isActive = !schedule.isActive; // Invertir el estado
//                 }
//             })
//             .addCase(toggleScheduleStatus.fulfilled, (state, action: PayloadAction<Docu>) => {
//                 state.status = 'succeeded';
//                 const index = state.list.findIndex(schedule => schedule._id === action.payload.id);
//                 if (index !== -1) {
//                     state.list[index] = action.payload;  // Asumiendo que la respuesta del servidor contiene el cargo actualizado
//                 }
//             })
//             .addCase(toggleScheduleStatus.rejected, (state, action) => {
//                 state.status = 'failed';
//                 state.error = action.error.message || null;
//                 const schedule = state.list.find(schedule => schedule._id === action.meta.arg.scheduleId);
//                 if (schedule) {
//                     schedule.isActive = !schedule.isActive;
//                 }
//             });
//     }
// });

// export default scheduleSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { UserData } from '../user';
import { Docu } from 'src/pages/user/horario/listHorario';

// Tipo de los datos del horario
interface ScheduleNormal {
    day: number;
    into: string;
    out: string;
    intoTwo: string;
    outTwo: string;
    toleranceInto: number;
    toleranceOut: number;
}

interface ScheduleSpecial {
    name: string;
    day: number;
    into: string;
    out: string;
    intoTwo: string;
    outTwo: string;
    toleranceInto: number;
    toleranceOut: number;
    permanente: boolean;
    dateRange: [string | null, string | null];
    usersAssigned: string[];
}

interface ScheduleData {
    createdAt: string | number | Date;
    _id?: string;
    name: string;
    scheduleNormal: ScheduleNormal[];
    scheduleSpecial: ScheduleSpecial[];
    isActive?: boolean;
}

interface ScheduleState {
    data: ScheduleData | null;
    list: ScheduleData[];
    findPaginateSchedule: Docu[],
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    pageSize: number;
    currentPage: number;
    paginatedSchedule: Docu[];
    error: string | null;
}

interface FetchScheduleByPageArg {
    page: number;
    pageSize: number;
    name?: string;
    isActive?: string;

}

interface PaginationResponse {
    data: Docu[];
    total: number;
    totalPages: number;
}

interface Filters {
    name?: string;
    isActive?: string;
    page?: number;
    pageSize?: number;
}

const initialState: ScheduleState = {
    data: null,
    list: [],
    findPaginateSchedule: [],
    paginatedSchedule: [] as Docu[],
    status: 'idle',
    pageSize: 0,
    currentPage: 1,
    error: null
};

type PartialScheduleData = Partial<ScheduleData>;

export const addSchedule = createAsyncThunk(
    'schedules/addSchedules',
    async (schedule: ScheduleData) => {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_PERSONAL_SCHEDULE}`, schedule);
        return response.data;
    }
);

export const fetchSchedules = createAsyncThunk(
    'schedules/fetchSchedules',
    async (): Promise<ScheduleData[]> => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_SCHEDULE}`);
        return response.data;
    }
)


export const fetchSchedulesByPage = createAsyncThunk<PaginationResponse, FetchScheduleByPageArg, {}>(
    'users/fetchScheduleByPage',
    async ({ page, pageSize, ...filters }) => {
        const params: { [key: string]: string } = {
            page: page.toString(),
            limit: pageSize.toString()
        };

        Object.keys(filters).forEach(key => {
            const value = (filters as any)[key];
            if (value !== undefined && value !== null && value !== '') {
                params[key] = value.toString();
            }
        });

        console.log(filters);
        const queryString = new URLSearchParams(params);
        console.log(`Sending request with params: ${queryString}`);

        const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_SCHEDULE}filtered?${queryString}`);
        return response.data;
    }
);
export const fetchFilteredSchedule = createAsyncThunk(
    'users/fetchFilteredSchedule',
    async (filters: Filters, { rejectWithValue }) => {
        try {
            const cleanedFilters: Filters = Object.fromEntries(
                Object.entries(filters).filter(([key, value]) => value !== undefined && value !== '')
            );

            const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_SCHEDULE}filtered`, {
                params: {
                    ...cleanedFilters,
                    page: cleanedFilters.page,
                    pageSize: cleanedFilters.pageSize
                }
            });

            if (response.data && response.data.data) {
                return response.data  // Retorna solo el arreglo "data" si deseas
            } else {
                throw new Error('Respuesta malformada del servidor');
            }
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue(error.message);
        }
    }
);


export const editSchedule = createAsyncThunk(
    'schedules/editSchedules',
    async (updateSchedule: PartialScheduleData): Promise<ScheduleData> => {
        if (!updateSchedule._id) {
            throw new Error('Se requiere el ID del horario para actualizar');
        }

        const response = await axios.put(`${process.env.NEXT_PUBLIC_PERSONAL_SCHEDULE}edit/${updateSchedule._id}`, updateSchedule);

        if (!response.data || response.status !== 200) {
            throw new Error('Error al actualizar el horario');
        }
        return response.data;
    }
)
export const toggleScheduleStatus = createAsyncThunk(
    'schedules/toggleActivation',
    async ({ scheduleId, isActive }: { scheduleId: string; isActive: boolean }): Promise<Docu> => {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_PERSONAL_SCHEDULE}${scheduleId}`, { isActive: isActive });

        if (!response.data || response.status !== 200) {
            throw new Error('Error al cambiar el estado de activación del cargo');
        }

        return response.data;
    }
);

const scheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addSchedule.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addSchedule.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list.push(action.payload);
                state.data = action.payload;
            })
            .addCase(addSchedule.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(fetchSchedules.fulfilled, (state, action) => {
                state.list = action.payload
            })
            .addCase(fetchSchedulesByPage.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSchedulesByPage.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.paginatedSchedule = action.payload.data;
                state.pageSize = action.payload.totalPages;
            })
            .addCase(fetchSchedulesByPage.rejected, (state: any, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchFilteredSchedule.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFilteredSchedule.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.paginatedSchedule = action.payload;  // Asumiendo que deseas almacenar la lista filtrada en "list". Si no, usa otra clave del estado.
                state.pageSize = action.payload.totalPages;
            })
            .addCase(fetchFilteredSchedule.rejected, (state: any, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(editSchedule.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editSchedule.fulfilled, (state, action: PayloadAction<ScheduleData>) => {
                state.status = 'succeeded';
                const index = state.list.findIndex(schedule => schedule._id === action.payload._id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            .addCase(editSchedule.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(toggleScheduleStatus.pending, (state, action) => {
                state.status = 'loading';
                const schedule = state.list.find(schedule => schedule._id === action.meta.arg.scheduleId);
                if (schedule) {
                    schedule.isActive = !schedule.isActive; // Invertir el estado
                }
            })
            .addCase(toggleScheduleStatus.fulfilled, (state, action: PayloadAction<Docu>) => {
                state.status = 'succeeded';
                const index = state.list.findIndex(schedule => schedule._id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload;  // Asumiendo que la respuesta del servidor contiene el cargo actualizado
                }
            })
            .addCase(toggleScheduleStatus.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
                const schedule = state.list.find(schedule => schedule._id === action.meta.arg.scheduleId);
                if (schedule) {
                    schedule.isActive = !schedule.isActive;
                }
            });
    }
});

export default scheduleSlice.reducer;