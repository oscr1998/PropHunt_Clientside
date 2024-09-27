import { configureStore } from '@reduxjs/toolkit'
import socketReducer from '../actions/socket/socketSlice'
import flaskReducer from '../actions/flask/flaskSlice'

export default configureStore({
    reducer: {
        socket: socketReducer,
        flask: flaskReducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: {
            // Ignore these action types
            ignoredActions: ['socket/store_socket', ],
            // Ignore these field paths in all actions
            // ignoredActionPaths: ['socket.socket'],
            // Ignore these paths in the state
            ignoredPaths: ['socket.socket', ],
        },
    }),
})
