import axios from 'axios';

export type TodolistType = {
    id: string;
    addedDate: string;
    order: number;
    title: string;
}

export type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: D
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

export type UpdateTaskType = {
    title: string;
    description: string;
    status: number;
    priority: number;
    startDate: string;
    deadline: string;
}

type GetTaskResponse = {
    items: TaskType[];
    totalCount: number;
    error: string;
}

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'api-key': 'd09df4a6-624c-4f2c-a2ad-d9a381941271',
    },
});

export const todolistAPI = {
    getTodolists() {
        return instance.get<TodolistType[]>('todo-lists').then(res => res.data);
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title}).then(res => res.data);
    },
    deleteTodolist(todolistID: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistID}`).then(res => res.data);
    },
    updateTodolist(todolistID: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistID}`, {title}).then(res => res.data);
    },
    getTasks(todolistID: string) {
        return instance.get<GetTaskResponse>(`todo-lists/${todolistID}/tasks`).then(res => res.data);
    },
    createTask(todolistID: string, title: string) {
        return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistID}/tasks`, {title}).then(res => res.data);
    },
    deleteTask(todolistID: string, taskID: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistID}/tasks/${taskID}`).then(res => res.data);
    },
    updateTask(todolistID: string, taskID: string, model: UpdateTaskType) {
        return instance.put<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistID}/tasks/${taskID}`, model).then(res => res.data);
    },
};

