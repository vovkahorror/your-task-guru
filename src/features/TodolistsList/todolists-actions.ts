import {createAsyncThunk} from '@reduxjs/toolkit';
import {setAppStatus} from '../../app/app-reducer';
import {ResultCode, todolistsApi, TodolistType} from '../../api/todolists-api';
import {fetchTasks} from './tasks-actions';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {changeTodolistEntityStatus, setTodolists} from './todolists-reducer';
import {ThunkErrorType} from '../../app/store';

export const fetchTodolists = createAsyncThunk('todolists/fetchTodolists', async (_, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus({status: 'loading'}));
    try {
        const todolists = await todolistsApi.getTodolists();
        dispatch(setTodolists({todolists}));
        todolists.forEach((tl) => {
            dispatch(fetchTasks(tl.id));
        });
        dispatch(setAppStatus({status: 'succeeded'}));
    } catch (e) {
        return handleServerNetworkError(e, dispatch, rejectWithValue);
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
            dispatch(changeTodolistEntityStatus({todolistId, status: 'failed'}));
            return handleServerAppError(res.data, dispatch, rejectWithValue);
        }
    } catch (e) {
        dispatch(changeTodolistEntityStatus({todolistId, status: 'failed'}));
        return handleServerNetworkError(e, dispatch, rejectWithValue);
    }
});

export const addTodolist = createAsyncThunk<{ todolist: TodolistType }, string, ThunkErrorType>
('todolists/addTodolist', async (title, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus({status: 'loading'}));
    try {
        const res = await todolistsApi.createTodolist(title);
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setAppStatus({status: 'succeeded'}));
            return {todolist: res.data.data.item};
        } else {
            return handleServerAppError(res.data, dispatch, rejectWithValue, false);
        }
    } catch (e) {
        return handleServerNetworkError(e, dispatch, rejectWithValue, false);
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
            dispatch(changeTodolistEntityStatus({todolistId: param.todolistId, status: 'failed'}));
            return handleServerAppError(res.data, dispatch, rejectWithValue);
        }
    } catch (e) {
        dispatch(changeTodolistEntityStatus({todolistId: param.todolistId, status: 'failed'}));
        return handleServerNetworkError(e, dispatch, rejectWithValue);
    }
});