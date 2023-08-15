import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {initializeApp} from './app-actions';

// slice
export const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle' as RequestStatusType,
        message: null as string | null,
        error: null as string | null,
        isInitialized: false,
        isShowedTodolistNotification: false,
        isShowedTaskNotification: false,
    },

    reducers: {
        setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status;
        },

        setAppMessage(state, action: PayloadAction<{ message: string | null }>) {
            state.message = action.payload.message;
        },

        setAppError(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error;
        },

        setTodolistNotificationShowing(state, action: PayloadAction<{ isShowedTodolistNotification: boolean }>) {
            state.isShowedTodolistNotification = action.payload.isShowedTodolistNotification;
        },

        setTaskNotificationShowing(state, action: PayloadAction<{ isShowedTaskNotification: boolean }>) {
            state.isShowedTaskNotification = action.payload.isShowedTaskNotification;
        },
    },

    extraReducers: builder => {
        builder
            .addCase(initializeApp.fulfilled, (state) => {
                state.isInitialized = true;
            })
            .addCase(initializeApp.rejected, (state) => {
                state.isInitialized = false;
            });
    },
});

export const {
    setAppStatus,
    setAppMessage,
    setAppError,
    setTodolistNotificationShowing,
    setTaskNotificationShowing,
} = slice.actions;

//types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

export type TitleNotificationTextType = 'To-Do list' | 'task';
