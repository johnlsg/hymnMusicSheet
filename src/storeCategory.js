import { createSlice} from '@reduxjs/toolkit';


export const categorySlice = createSlice({
  name:'category',
  initialState:{},
  reducers:{
    firestoreUpdate:(state, action)=>{
      return action.payload
    },
    addCategory: (state,action)=>{

    },
    editCategory: (state,action)=>{

    },
    deleteCategory:(state,action)=>{

    }
  }

})

const { actions, categoryReducer } = categorySlice

export const { addCategory, editCategory, deleteCategory } = actions

export default categoryReducer
