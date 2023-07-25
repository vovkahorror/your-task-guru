import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {initializeApp} from './app-actions';

// slice
export const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle' as RequestStatusType,
        error: null as string | null,
        isInitialized: false,
        isShowedTodolistNotification: false,
        isShowedTaskNotification: false,
    },

    reducers: {
        setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status;
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
        builder.addCase(initializeApp.fulfilled, (state) => {
            state.isInitialized = true;
        });
        builder.addCase(initializeApp.rejected, (state) => {
            state.isInitialized = false;
        });
    }
});

export const appReducer = slice.reducer;

export const {
    setAppStatus,
    setAppError,
    setTodolistNotificationShowing,
    setTaskNotificationShowing,
} = slice.actions;

//types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

export type TitleNotificationTextType = 'To-Do list' | 'task';
