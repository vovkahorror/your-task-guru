export type UserType = {
    id: number;
    email: string;
    login: string;
}

export type LoginParamType = {
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

export type GetTaskResponse = {
    items: TaskType[];
    totalCount: number;
    error: string;
}