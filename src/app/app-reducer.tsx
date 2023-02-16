const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
};

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS': {
            return {...state, status: action.payload.status};
        }

        case 'APP/SET-ERROR': {
            return {...state, error: action.payload.error};
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

//types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

type InitialStateType = typeof initialState;

export type AppActionsType = ReturnType<typeof setAppStatusAC> | ReturnType<typeof setAppErrorAC>;