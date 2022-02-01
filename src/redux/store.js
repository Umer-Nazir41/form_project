import {configureStore} from '@reduxjs/toolkit';
import dataReducer from './reducers/dataReducer';

//MAIN STORE
export default store = configureStore({
  reducer: {
    data: dataReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});
