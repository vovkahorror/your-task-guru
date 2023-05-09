import {ResultCode, todolistsApi, TodolistType} from '../../api/todolists-api';
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer';
import {AxiosError} from 'axios';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {fetchTasksTC} from './tasks-reducer';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {clearTasksAndTodolists} from '../../common/actions/common.actions';

//thunks
export const fetchTodolistsTC = createAsyncThunk('todolists/fetchTodolists', async (_, {dispatch}) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    try {
        const todolists = await todolistsApi.getTodolists();
        dispatch(setTodolistsAC({todolists}));
        todolists.forEach((tl) => {
            dispatch(fetchTasksTC(tl.id));
        });
        dispatch(setAppStatusAC({status: 'succeeded'}));
    } catch (e) {
        const error = e as AxiosError;
        handleServerNetworkError(error.message, dispatch);
    }
})

export const removeTodolistTC = createAsyncThunk('todolists/removeTodolist', async (todolistId: string, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    dispatch(changeTodolistEntityStatusAC({todolistId, status: 'loading'}));
    try {
        const res = await todolistsApi.deleteTodolist(todolistId);
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setAppStatusAC({status: 'succeeded'}));
            return {todolistId};
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
        }
    } catch (e) {
        const error = e as AxiosError;
        handleServerNetworkError(error.message, dispatch);
        return rejectWithValue(null);
    }
})

export const addTodolistTC = createAsyncThunk('todolists/addTodolist', async (title: string, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    try {
        const res = await todolistsApi.createTodolist(title);
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setAppStatusAC({status: 'succeeded'}));
            return {todolist: res.data.data.item};
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
        }
    } catch (e) {
        const error = e as AxiosError;
        handleServerNetworkError(error.message, dispatch);
        return rejectWithValue(null);
    }
})

export const changeTodolistTitleTC = createAsyncThunk('todolists/changeTodolistTitle', async (param: { todolistId: string, title: string }, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    dispatch(changeTodolistEntityStatusAC({todolistId: param.todolistId, status: 'loading'}));
    try {
        const res = await todolistsApi.updateTodolist(param.todolistId, param.title);
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setAppStatusAC({status: 'succeeded'}));
            dispatch(changeTodolistEntityStatusAC({todolistId: param.todolistId, status: 'succeeded'}));
            return {todolistId: param.todolistId, title: param.title};
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
        }
    } catch (e) {
        const error = e as AxiosError;
        handleServerNetworkError(error.message, dispatch);
        dispatch(changeTodolistEntityStatusAC({todolistId: param.todolistId, status: 'failed'}));
        return rejectWithValue(null);
    }
})

// slice
const slice = createSlice({
    name: 'todolists',
    initialState: [] as TodolistDomainType[],
    reducers: {
        setTodolistsAC(state, action: PayloadAction<{ todolists: TodolistType[] }>) {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}));
        },

        changeFilterAC(state, action: PayloadAction<{ value: FilterValuesType, todolistId: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId);
            state[index].filter = action.payload.value;
        },

        changeTodolistEntityStatusAC(state, action: PayloadAction<{ todolistId: string, status: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId);
            state[index].entityStatus = action.payload.status;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(clearTasksAndTodolists, () => {
            return [];
        });

        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId);
            if (index > -1) {
                state.splice(index, 1);
            }
        })

        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'});
        })

        builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId);
            state[index].title = action.payload.title;
        })
    },
});

export const todolistsReducer = slice.reducer;

export const {
    setTodolistsAC,
    changeFilterAC,
    changeTodolistEntityStatusAC,
} = slice.actions;

//types
export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType;
    entityStatus: RequestStatusType;
}