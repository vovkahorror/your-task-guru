import {v1} from 'uuid';
import {AddTodolistACType, RemoveTodolistACType} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType} from '../api/todolist-api';

type ActionsType =
    RemoveTaskACType
    | AddTaskACType
    | ChangeTaskStatusACType
    | ChangeTaskTitleACType
    | AddTodolistACType
    | RemoveTodolistACType

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

const initialState: TasksStateType = {};

export const tasksReducer = (state = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].filter((t: TaskType) => t.id !== action.payload.id),
            };

        case 'ADD-TASK':
            const newTask = {
                id: v1(),
                title: action.payload.title,
                status: TaskStatuses.New,
                todoListId: action.payload.todolistId,
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
            };
            return {...state, [action.payload.todolistId]: [newTask, ...state[action.payload.todolistId]]};

        case 'CHANGE-STATUS':
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map((t: TaskType) => t.id === action.payload.id ? {
                    ...t,
                    status: action.payload.status,
                } : t),
            };

        case 'CHANGE-TASK-TITLE':
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map((t: TaskType) => t.id === action.payload.id ? {
                    ...t,
                    title: action.payload.newTitle,
                } : t),
            };

        case 'ADD-TODOLIST':
            return {...state, [action.payload.newTodolistId]: []};

        case 'REMOVE-TODOLIST':
            const copyState = {...state};
            delete copyState[action.payload.id];
            return copyState;

        default:
            return state;
    }
};

type RemoveTaskACType = ReturnType<typeof removeTaskAC>;

export const removeTaskAC = (id: string, todolistId: string) => {
    return {
        type: 'REMOVE-TASK',
        payload: {
            id,
            todolistId,
        },
    } as const;
};

type AddTaskACType = ReturnType<typeof addTaskAC>;

export const addTaskAC = (title: string, todolistId: string) => {
    return {
        type: 'ADD-TASK',
        payload: {
            title,
            todolistId,
        },
    } as const;
};

type ChangeTaskStatusACType = ReturnType<typeof changeTaskStatusAC>

export const changeTaskStatusAC = (id: string, status: TaskStatuses, todolistId: string) => {
    return {
        type: 'CHANGE-STATUS',
        payload: {
            id,
            status,
            todolistId,
        },
    } as const;
};

type ChangeTaskTitleACType = ReturnType<typeof changeTaskTitleAC>

export const changeTaskTitleAC = (id: string, newTitle: string, todolistId: string) => {
    return {
        type: 'CHANGE-TASK-TITLE',
        payload: {
            id,
            newTitle,
            todolistId,
        },
    } as const;
};
