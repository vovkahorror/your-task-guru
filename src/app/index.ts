import {slice} from './app-reducer';
import * as appAsyncActions from './app-actions';
import * as appSelectors from './selectors';

const appActions = {
    ...appAsyncActions,
    ...slice.actions
};

const appReducer = slice.reducer;

export {
    appReducer,
    appActions,
    appSelectors,
};