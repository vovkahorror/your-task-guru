import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from './todolists-reducer';
import {ResultCode, TaskPriorities, TaskStatuses, TaskType, todolistsApi} from '../../api/todolists-api';
import {Dispatch} from 'redux';
import {AppRootStateType} from '../../app/store';
import {AppActionsType, RequestStatusType, setAppErrorAC, setAppStatusAC} from '../../app/app-reducer';
import {AxiosError} from 'axios';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';

const initialState: TasksStateType = {};

export const tasksReducer = (state = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'SET-TODOLISTS': {
            const stateCopy = {...state};
            action.payload.todolists.forEach((tl) => {
                stateCopy[tl.id] = [];
            });
            return stateCopy;
        }

        case 'SET-TASKS': {
            return {
                ...state,
                [action.payload.todolistId]: action.payload.tasks.map((t: TaskType) => ({...t, entityStatus: 'idle'})),
            };
        }

        case 'REMOVE-TASK': {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].filter((t: TaskDomainType) => t.id !== action.payload.id),
            };
        }

        case 'CHANGE-TASK-ENTITY-STATUS': {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map((t: TaskDomainType) => t.id === action.payload.id ? {
                    ...t,
                    entityStatus: action.payload.status,
                } : t),
            };
        }

        case 'ADD-TASK': {
            return {
                ...state,
                [action.payload.task.todoListId]: [{
                    ...action.payload.task,
                    entityStatus: 'idle',
                }, ...state[action.payload.task.todoListId]],
            };
        }

        case 'UPDATE-TASK': {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map((t: TaskDomainType) => t.id === action.payload.id ? {
                    ...t,
                    ...action.payload.model,
                } : t),
            };
        }

        case 'ADD-TODOLIST': {
            return {...state, [action.payload.todolist.id]: []};
        }

        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.payload.todolistId];
            return copyState;
        }

        default: {
            return state;
        }
    }
};

//actions
export const removeTaskAC = (id: string, todolistId: string) => ({
    type: 'REMOVE-TASK',
    payload: {id, todolistId},
} as const);

export const changeTaskEntityStatusAC = (todolistId: string, id: string, status: RequestStatusType) => ({
    type: 'CHANGE-TASK-ENTITY-STATUS',
    payload: {todolistId, id, status},
} as const);

export const addTaskAC = (task: TaskType) => ({
    type: 'ADD-TASK',
    payload: {task},
} as const);

export const updateTaskAC = (todolistId: string, id: string, model: UpdateDomainTaskModelType) => ({
    type: 'UPDATE-TASK',
    payload: {todolistId, id, model},
} as const);

export const setTasksAC = (tasks: TaskType[], todolistId: string) => ({
    type: 'SET-TASKS',
    payload: {todolistId, tasks},
} as const);

//thunks
export const getTasksTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'));

    todolistsApi.getTasks(todolistId)
        .then(res => {
            dispatch(setTasksAC(res.data.items, todolistId));
            dispatch(setAppStatusAC('succeeded'));
        })
        .catch((e: AxiosError) => {
            handleServerNetworkError(e.message, dispatch);
        });
};

export const removeTaskTC = (id: string, todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'));
    dispatch(changeTaskEntityStatusAC(todolistId, id, 'loading'));

    todolistsApi.deleteTask(todolistId, id)
        .then(res => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(removeTaskAC(id, todolistId));
                dispatch(setAppStatusAC('succeeded'));
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((e: AxiosError) => {
            handleServerNetworkError(e.message, dispatch);
            dispatch(changeTaskEntityStatusAC(todolistId, id, 'failed'));
        });
};

export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'));

    todolistsApi.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(addTaskAC(res.data.data.item));
                dispatch(setAppStatusAC('succeeded'));
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((e: AxiosError) => {
            handleServerNetworkError(e.message, dispatch);
        });
};

export const updateTaskTC = (todolistId: string, taskID: string, domainModel: UpdateDomainTaskModelType) => {
    return (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
        const state = getState();
        const task = state.tasks[todolistId].find(t => t.id === taskID);

        if (task) {
            dispatch(setAppStatusAC('loading'));
            dispatch(changeTaskEntityStatusAC(todolistId, taskID, 'loading'));

            const apiModel = {
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
                ...domainModel,
            };

            todolistsApi.updateTask(todolistId, taskID, apiModel)
                .then(res => {
                    if (res.data.resultCode === ResultCode.OK) {
                        dispatch(updateTaskAC(todolistId, taskID, apiModel));
                        dispatch(setAppStatusAC('succeeded'));
                        dispatch(changeTaskEntityStatusAC(todolistId, taskID, 'succeeded'));
                    } else {
                        handleServerAppError(res.data, dispatch);
                    }
                })
                .catch((e: AxiosError) => {
                    handleServerNetworkError(e.message, dispatch);
                    dispatch(changeTaskEntityStatusAC(todolistId, taskID, 'failed'));
                });
        }
    };
};

//types
type ActionsType =
    ReturnType<typeof removeTaskAC>
    | ReturnType<typeof changeTaskEntityStatusAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof setTasksAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | AppActionsType;

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