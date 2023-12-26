import axios from 'axios';
import {
    GetTaskResponse,
    LoginParamsType,
    ResponseType,
    TaskType,
    TodolistType,
    UpdateTaskModelType,
    UserType,
} from './types';

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'api-key': 'd09df4a6-624c-4f2c-a2ad-d9a381941271',
    },
});

//api
export const authApi = {
    me() {
        return instance.get<ResponseType<UserType>>('auth/me');
    },
    logIn(data: LoginParamsType) {
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
    reorderTodolist(todolistId: string, putAfterItemId: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}/reorder`, {putAfterItemId});
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

export const securityApi = {
    getCaptchaUrl() {
        return instance.get(`security/get-captcha-url`);
    },
};