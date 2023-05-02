import React, {ReactNode} from 'react';
import {HashRouter} from 'react-router-dom';

export const BrowserRouterDecorator = (storyFn: () => ReactNode) => {
    return (
        <HashRouter>
            {storyFn()}
        </HashRouter>
    );
};