import { createSlice, configureStore} from '@reduxjs/toolkit';
import categoryReducer from "./storeCategory";


const store = configureStore({
  reducer: {
    category:categoryReducer
  },
})

export default store
