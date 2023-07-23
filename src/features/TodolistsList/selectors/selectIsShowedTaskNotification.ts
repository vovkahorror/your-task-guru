import {AppRootStateType} from '../../../app/store';

export const selectIsShowedTaskNotification = (state: AppRootStateType) => state.app.isShowedTaskNotification;