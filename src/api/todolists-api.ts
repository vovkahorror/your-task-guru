import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'api-key': 'd09df4a6-624c-4f2c-a2ad-d9a381941271',
    },
});

//api
export const authAPI = {
    me() {
        return instance.get<ResponseType<UserType>>('auth/me');
    },
    logIn(data: LoginType) {
        return instance.post<ResponseType<{ userId: number }>>('auth/login', data);
    },
    logOut() {
        return instance.delete<ResponseType>('auth/login');
    },
};

export const todolistsApi = {
    getTodolists() {
        return instance.get<TodolistType[]>('todo-lists').then(res => res.data);
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title});
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`);
    },
    updateTodolist(todolistId: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}`, {title});
    },
    getTasks(todolistId: string) {
        return instance.get<GetTaskResponse>(`todo-lists/${todolistId}/tasks`);
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks`, {title});
    },
    deleteTask(todolistId: string, taskID: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskID}`);
    },
    updateTask(todolistId: string, taskID: string, model: UpdateTaskModelType) {
        return instance.put<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks/${taskID}`, model);
    },
};

//types
export type UserType = {
    id: number;
    email: string;
    login: string;
}

export type LoginType = {
    email: string;
    password: string;
    rememberMe?: boolean;
    captcha?: string;
}

export type TodolistType = {
    id: string;
    addedDate: string;
    title: string;
    order: number;
}

export type FieldErrorType = {
    field: string;
    error: string;
}

export type ResponseType<D = {}> = {
    resultCode: ResultCode;
    messages: Array<string>;
    fieldsErrors: Array<FieldErrorType>;
    data: D;
}

export enum ResultCode {
    OK = 0,
    Error = 1,
    Captcha = 10
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export type TaskType = {
    description: string;
    title: string;
    status: TaskStatuses;
    priority: TaskPriorities;
    startDate: string;
    deadline: string;
    id: string;
    todoListId: string;
    order: number;
    addedDate: string;
}

export type UpdateTaskModelType = {
    title: string;
    description: string;
    status: TaskStatuses;
    priority: TaskPriorities;
    startDate: string;
    deadline: string;
}

type GetTaskResponse = {
    items: TaskType[];
    totalCount: number;
    error: string;
}
