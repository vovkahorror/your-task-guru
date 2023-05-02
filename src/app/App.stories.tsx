import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import App from "./App";
import {ReduxStoreProviderDecorator} from '../stories/decorators/ReduxStoreProviderDecorator';
import {BrowserRouterDecorator} from '../stories/decorators/BrowserRouterDecorator';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Todolist/App',
    component: App,
    decorators: [ReduxStoreProviderDecorator, BrowserRouterDecorator],
} as ComponentMeta<typeof App>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof App> = (args) => <App/>;

export const AppWithReduxStory = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
