import { createSlice } from "@reduxjs/toolkit";


const servicesSlice=createSlice({
   name:"services",
   initialState:{
    services:[]
   },

   reducers:{

    viewServices(state,action){
        state.services=action.payload
    },
    addServices(state,action){
        state.services.push(action.payload)
    }

   }

})


export const{viewServices,addServices}=servicesSlice.actions;
export default servicesSlice.reducer