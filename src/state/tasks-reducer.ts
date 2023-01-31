import {v1} from 'uuid';
import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI} from '../api/todolist-api';
import {Dispatch} from 'redux';

type ActionsType =
    RemoveTaskActionType
    | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | SetTasksActionType

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

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
            const stateCopy = {...state};
            stateCopy[action.payload.todolistId] = action.payload.tasks;
            return stateCopy;
        }

        case 'REMOVE-TASK': {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].filter((t: TaskType) => t.id !== action.payload.id),
            };
        }

        case 'ADD-TASK': {
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
        }

        case 'CHANGE-STATUS': {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map((t: TaskType) => t.id === action.payload.id ? {
                    ...t,
                    status: action.payload.status,
                } : t),
            };
        }

        case 'CHANGE-TASK-TITLE': {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map((t: TaskType) => t.id === action.payload.id ? {
                    ...t,
                    title: action.payload.newTitle,
                } : t),
            };
        }

        case 'ADD-TODOLIST': {
            return {...state, [action.payload.newTodolistId]: []};
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

type RemoveTaskActionType = ReturnType<typeof removeTaskAC>;

export const removeTaskAC = (id: string, todolistId: string) => {
    return {
        type: 'REMOVE-TASK',
        payload: {
            id,
            todolistId,
        },
    } as const;
};

type AddTaskActionType = ReturnType<typeof addTaskAC>;

export const addTaskAC = (title: string, todolistId: string) => {
    return {
        type: 'ADD-TASK',
        payload: {
            title,
            todolistId,
        },
    } as const;
};

type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>

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

type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>

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

type SetTasksActionType = ReturnType<typeof setTasksAC>

export const setTasksAC = (tasks: TaskType[], todolistId: string) => {
    return {
        type: 'SET-TASKS',
        payload: {
            tasks,
            todolistId,
        },
    } as const;
};


export const getTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    todolistAPI.getTasks(todolistId)
        .then(res => dispatch(setTasksAC(res.items, todolistId)));
};