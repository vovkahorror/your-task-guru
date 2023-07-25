import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {initializeAppTC} from './app-actions';

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
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status;
        },

        setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error;
        },

        setTodolistNotificationShowingAC(state, action: PayloadAction<{ isShowedTodolistNotification: boolean }>) {
            state.isShowedTodolistNotification = action.payload.isShowedTodolistNotification;
        },

        setTaskNotificationShowingAC(state, action: PayloadAction<{ isShowedTaskNotification: boolean }>) {
            state.isShowedTaskNotification = action.payload.isShowedTaskNotification;
        },
    },

    extraReducers: builder => {
        builder.addCase(initializeAppTC.fulfilled, (state) => {
            state.isInitialized = true;
        });
        builder.addCase(initializeAppTC.rejected, (state) => {
            state.isInitialized = false;
        });
    }
});

export const appReducer = slice.reducer;

export const {
    setAppStatusAC,
    setAppErrorAC,
    setTodolistNotificationShowingAC,
    setTaskNotificationShowingAC,
} = slice.actions;

//types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

export type TitleNotificationTextType = 'To-Do list' | 'task';
