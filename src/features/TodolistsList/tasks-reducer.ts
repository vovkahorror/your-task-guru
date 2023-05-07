import {addTodolistAC, removeTodolistAC, setTodolistsAC} from './todolists-reducer';
import {ResultCode, TaskPriorities, TaskStatuses, TaskType, todolistsApi} from '../../api/todolists-api';
import {Dispatch} from 'redux';
import {AppRootStateType} from '../../app/store';
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer';
import {AxiosError} from 'axios';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {clearTasksAndTodolists} from '../../common/actions/common.actions';

const initialState: TasksStateType = {};

export const fetchTasksTC = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}));
    const res = await todolistsApi.getTasks(todolistId);
    thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
    return {tasks: res.data.items, todolistId};
});

export const removeTaskTC = createAsyncThunk('tasks/removeTask', (param: {
    taskId: string,
    todolistId: string
}, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}));
    thunkAPI.dispatch(changeTaskEntityStatusAC({todolistId: param.todolistId, taskId: param.taskId, status: 'loading'}));

    return todolistsApi.deleteTask(param.todolistId, param.taskId)
        .then(res => {
            if (res.data.resultCode === ResultCode.OK) {
                thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
                return {taskId: param.taskId, todolistId: param.todolistId};
            } else {
                handleServerAppError(res.data, thunkAPI.dispatch);
            }
        })
        .catch((e: AxiosError) => {
            handleServerNetworkError(e.message, thunkAPI.dispatch);
            thunkAPI.dispatch(changeTaskEntityStatusAC({
                todolistId: param.todolistId,
                taskId: param.taskId,
                status: 'failed',
            }));
        });
});

const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift({...action.payload.task, entityStatus: 'idle'});
        },

        changeTaskEntityStatusAC(state, action: PayloadAction<{
            todolistId: string,
            taskId: string,
            status: RequestStatusType
        }>) {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks[index].entityStatus = action.payload.status;
            }
        },

        updateTaskAC(state, action: PayloadAction<{
            todolistId: string,
            taskId: string,
            model: UpdateDomainTaskModelType
        }>) {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model};
            }
        },
    },

    extraReducers: (builder) => {
        builder.addCase(setTodolistsAC, (state, action) => {
            action.payload.todolists.forEach(tl => {
                state[tl.id] = [];
            });
        });

        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = [];
        });

        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.todolistId];
        });

        builder.addCase(clearTasksAndTodolists, () => {
            return {};
        });

        builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, entityStatus: 'idle'}));
        });

        builder.addCase(removeTaskTC.fulfilled, (state, action) => {
            if (action.payload) {
                const tasks = state[action.payload.todolistId];
                const index = tasks.findIndex(t => t.id === action.payload?.taskId);
                if (index > -1) {
                    tasks.splice(index, 1);
                }
            }
        });
    },
});

export const tasksReducer = slice.reducer;

export const {addTaskAC, changeTaskEntityStatusAC, updateTaskAC} = slice.actions;

//thunks
/*export const removeTaskTC_ = (id: string, todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    dispatch(changeTaskEntityStatusAC({todolistId, id, status: 'loading'}));

    todolistsApi.deleteTask(todolistId, id)
        .then(res => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(removeTaskAC({id, todolistId}));
                dispatch(setAppStatusAC({status: 'succeeded'}));
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((e: AxiosError) => {
            handleServerNetworkError(e.message, dispatch);
            dispatch(changeTaskEntityStatusAC({todolistId, id, status: 'failed'}));
        });
};*/

export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));

    todolistsApi.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(addTaskAC({task: res.data.data.item}));
                dispatch(setAppStatusAC({status: 'succeeded'}));
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((e: AxiosError) => {
            handleServerNetworkError(e.message, dispatch);
        });
};

export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {
        const state = getState();
        const task = state.tasks[todolistId].find(t => t.id === taskId);

        if (task) {
            dispatch(setAppStatusAC({status: 'loading'}));
            dispatch(changeTaskEntityStatusAC({todolistId, taskId: taskId, status: 'loading'}));

            const apiModel = {
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
                ...domainModel,
            };

            todolistsApi.updateTask(todolistId, taskId, apiModel)
                .then(res => {
                    if (res.data.resultCode === ResultCode.OK) {
                        dispatch(updateTaskAC({todolistId, taskId: taskId, model: apiModel}));
                        dispatch(setAppStatusAC({status: 'succeeded'}));
                        dispatch(changeTaskEntityStatusAC({todolistId, taskId: taskId, status: 'succeeded'}));
                    } else {
                        handleServerAppError(res.data, dispatch);
                    }
                })
                .catch((e: AxiosError) => {
                    handleServerNetworkError(e.message, dispatch);
                    dispatch(changeTaskEntityStatusAC({todolistId, taskId: taskId, status: 'failed'}));
                });
        }
    };
};

//types
export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType;
}

export type TasksStateType = {
    [key: string]: Array<TaskDomainType>
}

export type UpdateDomainTaskModelType = {
    title?: string;
    description?: string;
    status?: TaskStatuses;
    priority?: TaskPriorities;
    startDate?: string;
    deadline?: string;
}