import {createSlice} from '@reduxjs/toolkit';
import axios from 'axios';

let initialState = {
  dataReceived: false,
  dataTemplate: [],
  authHeader: '',
};

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    getAuthToken: async state => {
      const URL =
        'https://login.microsoftonline.com/2bd16c9b-7e21-4274-9c06-7919f7647bbb/oauth2/token?client_id=c961d6dd-7168-497e-93fc-4eb43aecca2f&client_secret=3leOD-N1sOep4D2C-g5dv1eU~ovyp~7y6u&grant_type=client_credentials&resource=https://zmssit.crm4.dynamics.com';

      await fetch(URL, {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'client_id=c961d6dd-7168-497e-93fc-4eb43aecca2f&client_secret=3leOD-N1sOep4D2C-g5dv1eU~ovyp~7y6u&grant_type=client_credentials&resource=https://zmssit.crm4.dynamics.com',
      })
        .then(response => response.json())
        .then(data => {
          state.authToken = data.access_token;
          axios.defaults.headers.common = {
            Authorization: `Bearer ${data.access_token}`,
          };
          state.dataReceived = true;
        })
        .catch(err => {
          console.log(err);
        });

      await axios
        .get(
          `https://zmssit.crm4.dynamics.com/api/data/v9.1/$metadata#contacts`,
        )
        .then(function (response) {
          //console.log(response.data);
          parseString(response.data, function (err, result) {
            let fieldsArray =
              result['edmx:Edmx']['edmx:DataServices'][0]['Schema'][0][
                'EntityType'
              ][84]['Property'];
            let tempArray = [];
            fieldsArray.forEach(element => {
              try {
                tempArray = [...tempArray, element['$']];
                //state.dataTemplate = [...state.dataTemplate, element['$']];
                console.log(state.dataTemplate);
              } catch (err) {
                console.log(err);
              }
            });
            try {
              state.dataTemplate = [...tempArray];
            } catch (err) {
              console.log(err);
            }
            state.dataReceived = true;
          });
        })
        .catch(function (error) {
          console.log(error);
        });

      console.log(state.dataTemplate);
      console.log(state.dataReceived);
    },

    setHeader: (state, action) => {
      state.authHeader = action.payload;
    },

    updateDataTemplate: (state, action) => {
      action.payload.forEach(element => {
        state.dataTemplate = state.dataTemplate.concat(element);
      });
    },

    sendFormData: (state, action) => {
      for (const key in action.payload) {
        if (action.payload[key] == '') {
          delete action.payload[key];
        }
        if (action.payload['fz_title'] != '') {
          action.payload['fz_title'] = 1;
        }
      }

      console.log(action.payload);

      const URL = 'https://zmssit.crm4.dynamics.com/api/data/v9.1/contacts';

      fetch(URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${state.authHeader}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action.payload),
      })
        .then(res => console.log(res))
        .catch(err => console.log(err));
    },
  },
});

export const {sendFormData, getAuthToken, updateDataTemplate, setHeader} =
  dataSlice.actions;

export default dataSlice.reducer;

//'Authorization': `Bearer ${state.authHeader}`,

// fetch(URL, {
// 	method: 'POST',
// 	headers: {
// 		'Authorization': `Bearer ${state.authHeader}`,
// 		'Content-Type': 'application/json'
// 	},
// 	body: JSON.stringify(action.payload)
// }).then(res => res.json())
// 	.then( res => console.log( res ) )
// 	.catch( ( err ) => { console.log( err ) } );
