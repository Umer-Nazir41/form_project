import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {Alert} from 'react-native';
var parseString = require('react-native-xml2js').parseString;

const getAuthToken = createAsyncThunk('data/getAuthToken', async () => {
	const URL =
		'https://login.microsoftonline.com/2bd16c9b-7e21-4274-9c06-7919f7647bbb/oauth2/token?client_id=c961d6dd-7168-497e-93fc-4eb43aecca2f&client_secret=3leOD-N1sOep4D2C-g5dv1eU~ovyp~7y6u&grant_type=client_credentials&resource=https://zmssit.crm4.dynamics.com';

	const response = await fetch(URL, {
		method: 'post',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: 'client_id=c961d6dd-7168-497e-93fc-4eb43aecca2f&client_secret=3leOD-N1sOep4D2C-g5dv1eU~ovyp~7y6u&grant_type=client_credentials&resource=https://zmssit.crm4.dynamics.com',
	});
	const data = await response.json();
	axios.defaults.headers.common = {
		Authorization: `Bearer ${data.access_token}`,
	};
	return data.access_token;
});

const getDataField = createAsyncThunk('data/getDataField', async () => {
	const response = await axios.get(
		`https://zmssit.crm4.dynamics.com/api/data/v9.1/$metadata#contacts`,
	);
	return response.data;
});

let initialState = {
	dataReceived: false,
	dataTemplate: [],
	authHeader: '',
	isLoading: true,
};

export const dataSlice = createSlice({
	name: 'data',
	initialState,
	reducers: {
		updateDataTemplate: (state, action) => {
			action.payload.forEach(element => {
				state.dataTemplate = state.dataTemplate.concat(element);
			});
		},

		sendFormData: (state, action) => {
			const URL =
				'https://zmssit.crm4.dynamics.com/api/data/v9.1/contacts';

			fetch(URL, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${state.authHeader}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(action.payload),
			})
				.then(res => {
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
		[getDataField.fulfilled]: (state, action) => {
			// console.log('action.payload');
			const x = parseString(action.payload, (_, result) => {
				let fieldsArray =
					result['edmx:Edmx']['edmx:DataServices'][0]['Schema'][0][
						'EntityType'
					][84]['Property'];
				let resultArray = fieldsArray
					.filter(element => element['$'])
					.map(element => element['$']);
				state.dataTemplate = resultArray;
				state.isLoading = false;
			});
		},
		[getDataField.pending]: (state, action) => {
			state.isLoading = true;
		},
		[getDataField.rejected]: (state, action) => {
			state.isLoading = false;
		},
	},
});

export const {sendFormData, updateDataTemplate} = dataSlice.actions;

export {getAuthToken, getDataField};

export default dataSlice.reducer;
