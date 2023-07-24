import {AppRootStateType} from '../../../app/store';

export const selectIsShowedTodolistNotification = (state: AppRootStateType) => state.app.isShowedTodolistNotification;