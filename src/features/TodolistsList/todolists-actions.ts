import {createAsyncThunk} from '@reduxjs/toolkit';
import {setAppStatus} from '../../app/app-reducer';
import {todolistsApi} from '../../api/todolists-api';
import {fetchTasks} from './tasks-actions';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {changeTodolistEntityStatus, setTodolists, TodolistDomainType} from './todolists-reducer';
import {AppRootStateType, ThunkErrorType} from '../../app/store';
import {ResultCode, TodolistType} from '../../api/types';
import {UniqueIdentifier} from '@dnd-kit/core';

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

export const removeTodolist = createAsyncThunk<{
    todolistId: string
}, string, ThunkErrorType>('todolists/removeTodolist', async (todolistId, {
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

export const changeTodolistTitle = createAsyncThunk<{ todolistId: string, title: string }, {
    todolistId: string, title: string
}, ThunkErrorType>('todolists/changeTodolistTitle', async (param, {dispatch, rejectWithValue}) => {
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

export const reorderTodolist = createAsyncThunk<{
    todolistId: UniqueIdentifier,
    putAfterItemId: UniqueIdentifier | null
}, {
    todolistId: UniqueIdentifier, overTodolistId?: UniqueIdentifier | null
}, ThunkErrorType>('todolists/reorderTodolist', async (param, {dispatch, rejectWithValue, getState}) => {
    dispatch(setAppStatus({status: 'loading'}));

    const state = getState() as AppRootStateType;
    const todolist = state.todolists.find(tl => tl.id === param.todolistId) as TodolistDomainType;
    const overTodolist = state.todolists.find(tl => tl.id === param.overTodolistId) as TodolistDomainType;
    const indexOfTodolist = state.todolists.indexOf(todolist);
    const indexOfOverTodolist = state.todolists.indexOf(overTodolist);
    const indexOfPutAfterTodolist = indexOfTodolist > indexOfOverTodolist ? indexOfOverTodolist - 1 : indexOfOverTodolist;
    const putAfterTodolistId = state.todolists[indexOfPutAfterTodolist]?.id;

    try {
        const res = await todolistsApi.reorderTodolist(param.todolistId, putAfterTodolistId);
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setAppStatus({status: 'succeeded'}));
            return {todolistId: param.todolistId, putAfterItemId: param.overTodolistId};
        } else {
            return handleServerAppError(res.data, dispatch, rejectWithValue);
        }
    } catch (e) {
        return handleServerNetworkError(e, dispatch, rejectWithValue);
    }
});