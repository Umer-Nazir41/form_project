// import {configureStore, combineReducers} from '@reduxjs/toolkit';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {persistReducer} from 'redux-persist';
// import {composeWithDevTools} from 'redux-devtools-extension';
// import counterReducer from './reducers/counterReducer';
// import dataReducer from './reducers/dataReducer';

// const persistConfig = {
//   key: 'root',
//   version: 1,
//   storage: AsyncStorage,
// };
// const rootReducer = combineReducers({
//   counter: counterReducer,
//   data: dataReducer,
// });
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export default configureStore(
//   {
//     reducer: persistedReducer,
//     middleware: getDefaultMiddleware =>
//       getDefaultMiddleware({
//         immutableCheck: false,
//         serializableCheck: false,
//       }),
//   },
//   composeWithDevTools(),
// );

import {configureStore} from '@reduxjs/toolkit';
import counterReducer from './reducers/counterReducer';
import dataReducer from './reducers/dataReducer';

//MAIN STORE
export default store = configureStore({
  reducer: {
    counter: counterReducer,
    data: dataReducer,
  },
});
