import * as appAsyncActions from './app-actions';
import {slice} from './app-reducer';
import * as appSelectors from './selectors';

const appActions = {
    ...appAsyncActions,
    ...slice.actions
};

export {
    appActions,
    appSelectors,
};