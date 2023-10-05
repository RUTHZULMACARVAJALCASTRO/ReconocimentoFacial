import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { UserData } from '../user';

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
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ScheduleState = {
    data: null,
    list: [],
    status: 'idle',
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
        console.log('entraa', response)
        return response.data;
    }
)

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
            .addCase(editSchedule.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editSchedule.fulfilled, (state, action: PayloadAction<ScheduleData>) => {
                state.status = 'succeeded';
                const index = state.list.findIndex(schduyle => schduyle._id === action.payload._id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            .addCase(editSchedule.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
    }
});

export default scheduleSlice.reducer;