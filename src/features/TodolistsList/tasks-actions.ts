import {createAsyncThunk} from '@reduxjs/toolkit';
import {setAppStatus} from '../../app/app-reducer';
import {todolistsApi} from '../../api/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {AppRootStateType, ThunkErrorType} from '../../app/store';
import {changeTaskEntityStatus, UpdateDomainTaskModelType} from './tasks-reducer';
import {ResultCode, TaskType, UpdateTaskModelType} from '../../api/types';

export const fetchTasks = createAsyncThunk<{
    tasks: TaskType[], todolistId: string
}, string, ThunkErrorType>
('tasks/fetchTasks', async (todolistId, {
    dispatch,
    rejectWithValue,
}) => {
    dispatch(setAppStatus({status: 'loading'}));
    try {
        const res = await todolistsApi.getTasks(todolistId);
        dispatch(setAppStatus({status: 'succeeded'}));
        return {tasks: res.data.items, todolistId};
    } catch (e) {
        return handleServerNetworkError(e, dispatch, rejectWithValue);
    }
});

export const removeTask = createAsyncThunk<{ taskId: string, todolistId: string }, {
    taskId: string, todolistId: string
}, ThunkErrorType>('tasks/removeTask', async (param, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus({status: 'loading'}));
    dispatch(changeTaskEntityStatus({
        todolistId: param.todolistId,
        taskId: param.taskId,
        status: 'loading',
    }));

    try {
        const res = await todolistsApi.deleteTask(param.todolistId, param.taskId);
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setAppStatus({status: 'succeeded'}));
            return {taskId: param.taskId, todolistId: param.todolistId};
        } else {
            return handleServerAppError(res.data, dispatch, rejectWithValue);
        }
    } catch (e) {
        dispatch(changeTaskEntityStatus({
            todolistId: param.todolistId,
            taskId: param.taskId,
            status: 'failed',
        }));
        return handleServerNetworkError(e, dispatch, rejectWithValue);
    }
});

export const addTask = createAsyncThunk<TaskType, { todolistId: string, title: string }, ThunkErrorType>
('tasks/addTask', async (param, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus({status: 'loading'}));
    try {
        const res = await todolistsApi.createTask(param.todolistId, param.title);
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setAppStatus({status: 'succeeded'}));
            return res.data.data.item;
        } else {
            return handleServerAppError(res.data, dispatch, rejectWithValue, false);
        }
    } catch (e) {
        return handleServerNetworkError(e, dispatch, rejectWithValue, false);
    }
});

export const updateTask = createAsyncThunk<{
    todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType
}, {
    todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType
}, ThunkErrorType>('tasks/updateTask', async (param, {dispatch, getState, rejectWithValue}) => {
    const state = getState() as AppRootStateType;
    const task = state.tasks[param.todolistId].find(t => t.id === param.taskId);

    if (!task) {
        return rejectWithValue({errors: ['task not found in the state'], fieldsErrors: undefined});
    }

    dispatch(setAppStatus({status: 'loading'}));
    dispatch(changeTaskEntityStatus({todolistId: param.todolistId, taskId: param.taskId, status: 'loading'}));

    const apiModel: UpdateTaskModelType = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        ...param.domainModel,
    };

    try {
        const res = await todolistsApi.updateTask(param.todolistId, param.taskId, apiModel);
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(changeTaskEntityStatus({
                todolistId: param.todolistId,
                taskId: param.taskId,
                status: 'succeeded',
            }));
            dispatch(setAppStatus({status: 'succeeded'}));
            return param;
        } else {
            dispatch(changeTaskEntityStatus({todolistId: param.todolistId, taskId: param.taskId, status: 'failed'}));
            return handleServerAppError(res.data, dispatch, rejectWithValue);
        }
    } catch (e) {
        dispatch(changeTaskEntityStatus({todolistId: param.todolistId, taskId: param.taskId, status: 'failed'}));
        return handleServerNetworkError(e, dispatch, rejectWithValue);
    }
});