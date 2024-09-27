import { createSlice, current } from "@reduxjs/toolkit";

export const socketSlice = createSlice({
    name: 'socket',
    initialState: {
        URI: "https://localhost:3030/",
        socket: null,
        roomID: "",
        players: {
            // id1: { id: "", username: "", character: "", sprite: "" },
            // id2: { id: "", username: "", character: "", sprite: "" },
        }
    },
    reducers: {
        store_socket: ( state, action ) => {
            state.socket = action.payload
        },
        store_roomID: (state, action) => {
            state.roomID = action.payload
        },
        update_players: (state, action) => {
            state.players = action.payload
        }
    },
})

export const { store_socket, store_roomID, update_players } = socketSlice.actions

export default socketSlice.reducer

