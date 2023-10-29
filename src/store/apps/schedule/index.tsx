import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
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

const initialState: ScheduleState = {
	data: null,
	paginatedSchedule: [],
	status: 'idle',
	pageSize: 0,
	currentPage: 1,
	error: null
};

interface NewScheduleData {
	name: string;
	scheduleNormal: ScheduleNormal[];
	scheduleSpecial: ScheduleSpecial[];
}

type PartialScheduleData = Partial<ScheduleData>;

export const addSchedule = createAsyncThunk(
	'schedules/addSchedules',
	async (schedule: NewScheduleData) => {
		const response = await axios.post(`${process.env.NEXT_PUBLIC_PERSONAL_SCHEDULE}`, schedule);
		return response.data;
	}
);

export const fetchSchedules = createAsyncThunk(
	'schedules/fetchSchedules',
	async (): Promise<Docu[]> => {
		const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_SCHEDULE}`);
		return response.data;
	}
)

export const fetchScheduleByPage = createAsyncThunk<PaginationResponse, FetchScheduleByPageArg, {}>(
	'users/fetchChargesByPage',
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
		console.log(response.data)
		console.log(queryString)
		return response.data;

	}
);




export const editSchedule = createAsyncThunk(
	'schedules/editSchedules',
	async (updateSchedule: PartialScheduleData): Promise<Docu> => {
		if (!updateSchedule._id) {
			throw new Error('Se requiere el ID del horario para actualizar');
		}

		const response = await axios.put(`${process.env.NEXT_PUBLIC_PERSONAL_SCHEDULE}${updateSchedule._id}`, updateSchedule);

		if (!response.data || response.status !== 200) {
			throw new Error('Error al actualizar el horario');
		}
		return response.data;
	}
);

export const toggleScheduleStatus = createAsyncThunk(
	'schedules/toggleActivation',
	async ({ scheduleId, isActive }: { scheduleId: string; isActive: boolean }): Promise<Docu> => {
		const response = await axios.put(`${process.env.NEXT_PUBLIC_PERSONAL_SCHEDULE}${scheduleId}`, { isActive: isActive });

		if (!response.data || response.status !== 200) {
			throw new Error('Error al cambiar el estado de activación del horario');
		}

		// En lugar de devolver solo id e isActive, devuelve el objeto completo
		const updatedSchedule: Docu = { ...response.data, isActive: isActive };
		return updatedSchedule;
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
				state.paginatedSchedule.push(action.payload);
				state.data = action.payload;
			})
			.addCase(addSchedule.rejected, (state: any, action) => {
				state.status = 'failed';
				state.error = action.error.message || null;
			})
			.addCase(fetchScheduleByPage.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchScheduleByPage.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.paginatedSchedule = action.payload.data;
				state.pageSize = action.payload.totalPages;
			})
			.addCase(fetchScheduleByPage.rejected, (state: any, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			})
			.addCase(editSchedule.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(editSchedule.fulfilled, (state, action: PayloadAction<Docu>) => {
				state.status = 'succeeded';
				const index = state.paginatedSchedule.findIndex(schedule => schedule._id === action.payload._id);
				if (index !== -1) {
					state.paginatedSchedule[index] = action.payload;
				}
			})
			.addCase(editSchedule.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message || null;
			})
			.addCase(toggleScheduleStatus.pending, (state, action) => {
				state.status = 'loading';
				const schedule = state.paginatedSchedule.find(schedule => schedule._id === action.meta.arg.scheduleId);
				if (schedule) {
					schedule.isActive = !schedule.isActive; // Invertir el estado
				}
			})
			.addCase(toggleScheduleStatus.fulfilled, (state, action: PayloadAction<Docu>) => {
				state.status = 'succeeded';
				const index = state.paginatedSchedule.findIndex(schedule => schedule._id === action.payload._id);
				if (index !== -1) {
					state.paginatedSchedule[index] = action.payload;  // Asumiendo que la respuesta del servidor contiene el cargo actualizado
				}
			})
			.addCase(toggleScheduleStatus.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message || null;
				const schedule = state.paginatedSchedule.find(schedule => schedule._id === action.meta.arg.scheduleId);
				if (schedule) {
					schedule.isActive = !schedule.isActive;
				}
			});
	}
});

export default scheduleSlice.reducer;