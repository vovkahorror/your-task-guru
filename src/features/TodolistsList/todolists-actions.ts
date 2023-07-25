import {createAsyncThunk} from '@reduxjs/toolkit';
import {setAppStatus} from '../../app/app-reducer';
import {ResultCode, todolistsApi} from '../../api/todolists-api';
import {fetchTasks} from './tasks-actions';
import {AxiosError} from 'axios';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {changeTodolistEntityStatus, setTodolists} from './todolists-reducer';

export const fetchTodolists = createAsyncThunk('todolists/fetchTodolists', async (_, {dispatch}) => {
    dispatch(setAppStatus({status: 'loading'}));
    try {
        const todolists = await todolistsApi.getTodolists();
        dispatch(setTodolists({todolists}));
        todolists.forEach((tl) => {
            dispatch(fetchTasks(tl.id));
        });
        dispatch(setAppStatus({status: 'succeeded'}));
    } catch (e) {
        const error = e as AxiosError;
        handleServerNetworkError(error.message, dispatch);
    }
});

export const removeTodolist = createAsyncThunk('todolists/removeTodolist', async (todolistId: string, {
    dispatch,
    rejectWithValue,
}) => {
    dispatch(setAppStatus({status: 'loading'}));
    dispatch(changeTodolistEntityStatus({todolistId, status: 'loading'}));
    try {
        const res = await todolistsApi.deleteTodolist(todolistId);
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setAppStatus({status: 'succeeded'}));
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
});

export const addTodolist = createAsyncThunk('todolists/addTodolist', async (title: string, {
    dispatch,
    rejectWithValue,
}) => {
    dispatch(setAppStatus({status: 'loading'}));
    try {
        const res = await todolistsApi.createTodolist(title);
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setAppStatus({status: 'succeeded'}));
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
});

export const changeTodolistTitle = createAsyncThunk('todolists/changeTodolistTitle', async (param: {
    todolistId: string,
    title: string
}, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus({status: 'loading'}));
    dispatch(changeTodolistEntityStatus({todolistId: param.todolistId, status: 'loading'}));
    try {
        const res = await todolistsApi.updateTodolist(param.todolistId, param.title);
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setAppStatus({status: 'succeeded'}));
            dispatch(changeTodolistEntityStatus({todolistId: param.todolistId, status: 'succeeded'}));
            return {todolistId: param.todolistId, title: param.title};
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
        }
    } catch (e) {
        const error = e as AxiosError;
        handleServerNetworkError(error.message, dispatch);
        dispatch(changeTodolistEntityStatus({todolistId: param.todolistId, status: 'failed'}));
        return rejectWithValue(null);
    }
});