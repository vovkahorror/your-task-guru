import * as authAsyncActions from './auth-actions';
import {slice} from './auth-reducer';
import * as authSelectors from './selectors';

const authActions = {
    ...authAsyncActions,
    ...slice.actions,
};

export {
    authActions,
    authSelectors,
};