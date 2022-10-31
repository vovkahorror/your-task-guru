import {TasksStateType} from "../App";
import {v1} from "uuid";

type ActionTypes =
    RemoveTaskACType
    | AddTaskACType
    | ChangeStatusACType
    | ChangeTaskTitleACType
    | RemoveTodolistTasksACType
    | AddTodolistTaskACType;

export const TasksReducer = (state: TasksStateType, action: ActionTypes) => {
    switch (action.type) {
        case "REMOVE-TASK":
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].filter(t => t.id !== action.payload.id),
            };

        case "ADD-TASK":
            const newTask = {id: v1(), title: action.payload.title, isDone: false};
            return {...state, [action.payload.todolistId]: [newTask, ...state[action.payload.todolistId]]};

        case "CHANGE-STATUS":
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map(el => el.id === action.payload.id ? {
                    ...el,
                    isDone: action.payload.isDone,
                } : el),
            };

        case "CHANGE-TASK-TITLE":
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map(el => el.id === action.payload.id ? {
                    ...el,
                    title: action.payload.newTitle,
                } : el),
            };

        case "REMOVE-TODOLIST-TASKS":
            delete state[action.payload.id];
            return {...state};

        case "ADD-TODOLIST-TASK":
            return {...state, [action.payload.newTodolistId]: []};

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

type ChangeStatusACType = ReturnType<typeof changeStatusAC>

export const changeStatusAC = (id: string, isDone: boolean, todolistId: string) => {
    return {
        type: 'CHANGE-STATUS',
        payload: {
            id,
            isDone,
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

type RemoveTodolistTasksACType = ReturnType<typeof removeTodolistTasksAC>

export const removeTodolistTasksAC = (id: string) => {
    return {
        type: 'REMOVE-TODOLIST-TASKS',
        payload: {
            id,
        },
    } as const;
};

type AddTodolistTaskACType = ReturnType<typeof addTodolistTaskAC>

export const addTodolistTaskAC = (newTodolistId: string) => {
    return {
        type: 'ADD-TODOLIST-TASK',
        payload: {
            newTodolistId,
        },
    } as const;
};