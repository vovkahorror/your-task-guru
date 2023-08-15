import {AppRootStateType} from '../../app/store';

export const selectIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn;
export const selectCaptchaUrl = (state: AppRootStateType) => state.auth.captchaUrl;