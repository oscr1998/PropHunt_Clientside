import { createSlice, current } from "@reduxjs/toolkit";

export const flaskSlice = createSlice({
    name: 'flask',
    initialState: {
        URI: 'http://127.0.0.1:3030',
    },
    reducers: {

    },
})

export const {  } = flaskSlice.actions

export default flaskSlice.reducer

