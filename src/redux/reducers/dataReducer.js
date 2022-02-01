import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {Alert} from 'react-native';

const getAuthToken = createAsyncThunk('data/getAuthToken', async () => {
	const URL =
		'https://login.microsoftonline.com/2bd16c9b-7e21-4274-9c06-7919f7647bbb/oauth2/token?client_id=c961d6dd-7168-497e-93fc-4eb43aecca2f&client_secret=3leOD-N1sOep4D2C-g5dv1eU~ovyp~7y6u&grant_type=client_credentials&resource=https://zmssit.crm4.dynamics.comhttps://login.microsoftonline.com/2bd16c9b-7e21-4274-9c06-7919f7647bbb/oauth2/token?client_id=c961d6dd-7168-497e-93fc-4eb43aecca2f&client_secret=3leOD-N1sOep4D2C-g5dv1eU~ovyp~7y6u&grant_type=client_credentials&resource=https://zmssit.crm4.dynamics.com';

	const response = await fetch(URL, {
		method: 'post',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: 'client_id=c961d6dd-7168-497e-93fc-4eb43aecca2f&client_secret=3leOD-N1sOep4D2C-g5dv1eU~ovyp~7y6u&grant_type=client_credentials&resource=https://zmsdev.crm4.dynamics.com',
	});
	const data = await response.json();
	axios.defaults.headers.common = {
		Authorization: `Bearer ${data.access_token}`,
	};

	return data.access_token;
});

const getContacts = createAsyncThunk('data/getContacts', async () => {
	const URL = 'https://zmsdev.crm4.dynamics.com/api/data/v9.2/contacts?';

	const params = new URLSearchParams({
		$select: 'fullname,contactid',
		$filter:
			'(statecode eq 0 and fz_freezonecontacttype eq 3 and _ownerid_value ne null and fullname ne null)',
		$orderby: 'fullname asc',
	});
	const response = await fetch(URL + params, {
		method: 'get',
		headers: {
			Authorization: `${axios.defaults.headers.common.Authorization}`,
		},
	});
	const data = await response.json();
	return data;
});

const getBankDetails = createAsyncThunk('data/getBankDetails', async () => {
	const URL =
		'https://zmsdev.crm4.dynamics.com/api/data/v9.1/dp_bankdetailses?';

	const params = new URLSearchParams({
		$select: 'dp_bankdetailsid,dp_name',
	});

	const response = await fetch(URL + params, {
		method: 'get',
		headers: {
			Authorization: `${axios.defaults.headers.common.Authorization}`,
		},
	});

	const data = await response.json();
	return data;
});

let initialState = {
	authHeader: '',
	isLoading: true,
	bankArray: [],
	EmpArray: [],
};

export const dataSlice = createSlice({
	name: 'data',
	initialState,
	reducers: {
		createSalaryCertificate: (state, action) => {
			const URL =
				'https://zmsdev.crm4.dynamics.com/api/data/v9.1/fz_employeeletterrequests';

			fetch(URL, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${state.authHeader}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(action.payload),
			})
				.then(res => {
					console.log(res);
					if (res.status == 204) {
						//console.log(res),
						Alert.alert(
							'Success',
							'Data has been posted Successfully',
						);
					} else {
						//console.log(res),
						Alert.alert(
							'Failed',
							'Unable to send data. Please Try again',
						);
					}
				})
				.catch(err => {
					//console.log(err),
					Alert.alert(
						'Failed',
						'Unable to send data. Please Try again',
					);
				});
		},
	},
	extraReducers: {
		[getAuthToken.pending]: (state, action) => {
			state.isLoading = true;
			// state.authToken = action.payload;
		},
		[getAuthToken.fulfilled]: (state, action) => {
			state.authHeader = action.payload;
		},
		[getAuthToken.rejected]: state => {
			state.isLoading = false;
		},
		[getContacts.pending]: (state, action) => {
			state.isLoading = true;
		},
		[getContacts.fulfilled]: (state, action) => {
			state.EmpArray = action.payload.value;
		},
		[getContacts.rejected]: (state, action) => {
			state.isLoading = false;
		},

		[getBankDetails.pending]: (state, action) => {
			state.isLoading = true;
		},
		[getBankDetails.fulfilled]: (state, action) => {
			state.bankArray = action.payload.value;
		},
		[getBankDetails.rejected]: (state, action) => {
			state.isLoading = false;
		},
	},
});

export const {createSalaryCertificate} = dataSlice.actions;

export {getAuthToken, getContacts, getBankDetails};

export default dataSlice.reducer;
