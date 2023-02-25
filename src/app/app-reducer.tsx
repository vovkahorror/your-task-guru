const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isShowedTodolistNotification: false,
    isShowedTaskNotification: false,
};

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS': {
            return {...state, status: action.payload.status};
        }

        case 'APP/SET-ERROR': {
            return {...state, error: action.payload.error};
        }

        case 'APP/SET-SHOWING-TODOLIST-NOTIFICATION': {
            return {...state, isShowedTodolistNotification: action.payload.isShowedTodolistNotification};
        }

        case 'APP/SET-SHOWING-TASK-NOTIFICATION': {
            return {...state, isShowedTaskNotification: action.payload.isShowedTaskNotification};
        }

        default: {
            return state;
        }
    }
};

//actions
export const setAppStatusAC = (status: RequestStatusType) => ({
    type: 'APP/SET-STATUS',
    payload: {status},
} as const);

export const setAppErrorAC = (error: string | null) => ({
    type: 'APP/SET-ERROR',
    payload: {error},
} as const);

export const setTodolistNotificationShowingAC = (isShowedTodolistNotification: boolean) => ({
    type: 'APP/SET-SHOWING-TODOLIST-NOTIFICATION',
    payload: {isShowedTodolistNotification},
} as const);

export const setTaskNotificationShowingAC = (isShowedTaskNotification: boolean) => ({
    type: 'APP/SET-SHOWING-TASK-NOTIFICATION',
    payload: {isShowedTaskNotification},
} as const);

//types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

export type TitleNotificationTextType = 'To-Do list' | 'task';

type InitialStateType = typeof initialState;

export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>;
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>;

export type AppActionsType =
    SetAppStatusActionType
    | SetAppErrorActionType
    | ReturnType<typeof setTodolistNotificationShowingAC>
    | ReturnType<typeof setTaskNotificationShowingAC>;