import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Docu } from 'src/pages/user/charges/ChargeList';

export interface ChargeData {
	name: string;
	description: string;
}

interface ChargeState {
	data: ChargeData | null;
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	pageSize: number;
	currentPage: number;
	paginatedCharges: Docu[];
	error: string | null;
}

interface FetchChargesByPageArg {
	page: number;
	pageSize: number;
	name?: string;
	description?: string;
	isActive?: string;

}

interface PaginationResponse {
	data: Docu[];
	total: number;
	totalPages: number;
}

const initialState: ChargeState = {
	data: null,
	paginatedCharges: [] as Docu[],
	status: 'idle',
	pageSize: 0,
	currentPage: 1,
	error: null
};

export const addCharge = createAsyncThunk(
	'charges/addCharge',
	async (charge: ChargeData, { rejectWithValue }) => {
		try {
			const response = await axios.post(`${process.env.NEXT_PUBLIC_PERSONAL_CHARGE}`, charge);
			return response.data;
		} catch (error: any) {
			if (error.response && error.response.data && error.response.data.message) {

				return rejectWithValue(error.response.data.message);
			}

			return rejectWithValue(error.message);
		}
	}
);

export const fetchCharges = createAsyncThunk(
	'charges/fetchCharges',
	async (): Promise<Docu[]> => {
		const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_CHARGE}`);
		return response.data;
	}
);

export const fetchChargesByPage = createAsyncThunk<PaginationResponse, FetchChargesByPageArg, {}>(
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

		const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_CHARGE}filtered?${queryString}`);
		return response.data;
	}
);

export const editCharge = createAsyncThunk(
	'charges/editCharge',
	async (updatedCharge: Docu): Promise<Docu> => {
		const response = await axios.put(`${process.env.NEXT_PUBLIC_PERSONAL_CHARGE}${updatedCharge._id}`, updatedCharge);

		if (!response.data || response.status !== 200) {
			throw new Error('Error al actualizar el cargo');
		}

		return response.data;
	}
);

export const toggleChargeStatus = createAsyncThunk(
	'charges/toggleActivation',
	async ({ chargeId, isActive }: { chargeId: string; isActive: boolean }): Promise<Docu> => {
		const response = await axios.put(`${process.env.NEXT_PUBLIC_PERSONAL_CHARGE}${chargeId}`, { isActive: isActive });

		if (!response.data || response.status !== 200) {
			throw new Error('Error al cambiar el estado de activación del cargo');
		}

		return response.data;
	}
)

const chargeSlice = createSlice({
	name: 'charges',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(addCharge.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(addCharge.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.paginatedCharges.push(action.payload);
				state.data = action.payload;
			})
			.addCase(addCharge.rejected, (state: any, action) => {
				state.status = 'failed';
				state.error = action.error.message || null;
			})
			.addCase(fetchChargesByPage.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchChargesByPage.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.paginatedCharges = action.payload.data;
				state.pageSize = action.payload.totalPages;
			})
			.addCase(fetchChargesByPage.rejected, (state: any, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			})
			.addCase(editCharge.pending, (state) => {
				state.status = 'loading';
			})

			.addCase(editCharge.fulfilled, (state, action: PayloadAction<Docu>) => {
				state.status = 'succeeded';
				const index = state.paginatedCharges.findIndex(charge => charge._id === action.payload._id);
				if (index !== -1) {
					state.paginatedCharges[index] = action.payload;
				}
				state.data = action.payload;
			})

			.addCase(editCharge.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message || null;
			})

			.addCase(toggleChargeStatus.pending, (state, action) => {
				state.status = 'loading';
				const charge = state.paginatedCharges.find(charge => charge._id === action.meta.arg.chargeId);
				if (charge) {
					charge.isActive = !charge.isActive;
				}
			})
			.addCase(toggleChargeStatus.fulfilled, (state, action: PayloadAction<Docu>) => {
				state.status = 'succeeded';
				const index = state.paginatedCharges.findIndex(charge => charge._id === action.payload._id);
				if (index !== -1) {
					state.paginatedCharges[index] = action.payload;
				}
			})
			.addCase(toggleChargeStatus.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message || null;
				const charge = state.paginatedCharges.find(charge => charge._id === action.meta.arg.chargeId);
				if (charge) {
					charge.isActive = !charge.isActive;
				}
			});
	}
});

export default chargeSlice.reducer;
