import {AppRootStateType} from './store';

export const selectIsInitialized = (state: AppRootStateType) => state.app.isInitialized;