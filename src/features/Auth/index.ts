import {slice as authSlice} from './auth-reducer';
import * as authAsyncActions from './auth-actions';
import {slice} from './auth-reducer';
import * as authSelectors from './selectors';

const authActions = {
    ...authAsyncActions,
    ...slice.actions,
};

const authReducer = authSlice.reducer;

export {
    authReducer,
    authActions,
    authSelectors,
};