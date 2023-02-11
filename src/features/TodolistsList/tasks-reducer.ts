import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI} from '../../api/todolist-api';
import {Dispatch} from 'redux';
import {AppRootStateType} from '../../app/store';

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
            return {...state, [action.payload.todolistId]: action.payload.tasks};
        }

        case 'REMOVE-TASK': {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].filter((t: TaskType) => t.id !== action.payload.id),
            };
        }

        case 'ADD-TASK': {
            return {
                ...state,
                [action.payload.task.todoListId]: [action.payload.task, ...state[action.payload.task.todoListId]],
            };
        }

        case 'UPDATE-TASK': {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map((t: TaskType) => t.id === action.payload.id ? {
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
            delete copyState[action.payload.id];
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
    todolistAPI.getTasks(todolistId)
        .then(res => dispatch(setTasksAC(res.items, todolistId)));
};

export const removeTaskTC = (id: string, todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistAPI.deleteTask(todolistId, id)
        .then(() => dispatch(removeTaskAC(id, todolistId)));
};

export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistAPI.createTask(todolistId, title)
        .then(res => dispatch(addTaskAC(res.data.item)));
};

export const updateTaskTC = (todolistId: string, taskID: string, domainModel: UpdateDomainTaskModelType) => {
    return (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
        const state = getState();
        const task = state.tasks[todolistId].find(t => t.id === taskID);

        if (task) {
            const apiModel = {
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
                ...domainModel,
            };

            todolistAPI.updateTask(todolistId, taskID, apiModel)
                .then(() => dispatch(updateTaskAC(todolistId, taskID, apiModel)));
        }
    };
};

//types
type ActionsType =
    ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof setTasksAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType;

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

export type UpdateDomainTaskModelType = {
    title?: string;
    description?: string;
    status?: TaskStatuses;
    priority?: TaskPriorities;
    startDate?: string;
    deadline?: string;
}