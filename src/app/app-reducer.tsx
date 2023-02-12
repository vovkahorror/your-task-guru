const initialState = {
    status: 'idle' as RequestStatusType,
};

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS': {
            return {...state, status: action.payload.status};
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

//types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

type InitialStateType = typeof initialState;

type AppActionsType = ReturnType<typeof setAppStatusAC>;