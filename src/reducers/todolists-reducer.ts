import { v1 } from "uuid";
import {FilterValuesType, TodolistType} from "../App";

type ActionsType = ChangeFilterACType | RemoveTodolistACType | ChangeTodolistTitleACType | AddTodolistACType;

export const todolistsReducer = (state: TodolistType[], action: ActionsType): TodolistType[] => {
    switch (action.type) {
        case "CHANGE-FILTER":
            return state.map(tl => tl.id === action.payload.todolistId ? {...tl, filter: action.payload.value} : tl);

        case "REMOVE-TODOLIST":
            return state.filter(tl => tl.id !== action.payload.id);

        case "CHANGE-TODOLIST-TITLE":
            return state.map(tl => tl.id === action.payload.todolistId ? {...tl, title: action.payload.title} : tl);

        case "ADD-TODOLIST":
            return [
                {
                    id: action.payload.newTodolistId,
                    title: action.payload.title,
                    filter: 'all',
                },
                ...state];

        default:
            return state;
    }
};

type ChangeFilterACType = ReturnType<typeof changeFilterAC>

export const changeFilterAC = (value: FilterValuesType, todolistId: string) => {
    return {
        type: 'CHANGE-FILTER',
        payload: {
            value,
            todolistId,
        },
    } as const;
};

type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>

export const removeTodolistAC = (id: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        payload: {
            id,
        },
    } as const;
};

type ChangeTodolistTitleACType = ReturnType<typeof changeTodolistTitleAC>

export const changeTodolistTitleAC = (todolistId: string, title: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        payload: {
            todolistId,
            title,
        },
    } as const;
};

export type AddTodolistACType = ReturnType<typeof addTodolistAC>

export const addTodolistAC = (title: string) => {
    return {
        type: 'ADD-TODOLIST',
        payload: {
            newTodolistId: v1(),
            title,
        },
    } as const;
};