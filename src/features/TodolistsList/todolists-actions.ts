import {createAsyncThunk} from '@reduxjs/toolkit';
import {setAppStatusAC} from '../../app/app-reducer';
import {ResultCode, todolistsApi} from '../../api/todolists-api';
import {fetchTasksTC} from './tasks-actions';
import {AxiosError} from 'axios';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {changeTodolistEntityStatusAC, setTodolistsAC} from './todolists-reducer';

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
});

export const removeTodolistTC = createAsyncThunk('todolists/removeTodolist', async (todolistId: string, {
    dispatch,
    rejectWithValue,
}) => {
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
});

export const addTodolistTC = createAsyncThunk('todolists/addTodolist', async (title: string, {
    dispatch,
    rejectWithValue,
}) => {
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
});

export const changeTodolistTitleTC = createAsyncThunk('todolists/changeTodolistTitle', async (param: {
    todolistId: string,
    title: string
}, {dispatch, rejectWithValue}) => {
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
});