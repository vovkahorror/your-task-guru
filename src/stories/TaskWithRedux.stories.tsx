import React, {ChangeEvent, useState} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import TaskWithRedux from "../TaskWithRedux";
import {Provider} from "react-redux";
import {store} from "../state/store";
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "../EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {action} from '@storybook/addon-actions';
import ReduxStoreProviderDecorator from "./decorators/ReduxStoreProviderDecorator";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Todolist/TaskWithRedux',
    component: TaskWithRedux,
    args: {
        task: {id: '1', title: 'JS', isDone: true},
        todolistId: 'td1',
    },
    decorators: [ReduxStoreProviderDecorator],
} as ComponentMeta<typeof TaskWithRedux>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TaskWithRedux> = (args) => <TaskWithRedux {...args} />;

export const TaskIsDoneStory = Template.bind({});

export const TaskIsNotDoneStory = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
TaskIsNotDoneStory.args = {
    task: {id: '2', title: 'CSS', isDone: false},
};

const TemplateWork: ComponentStory<typeof TaskWithRedux> = (args) => {
    const [task, setTask] = useState(args.task);

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const newIsDoneValue = e.currentTarget.checked;
        setTask({...task, isDone: newIsDoneValue});
    };
    const onTitleChangeHandler = (newValue: string) => {
        setTask({...task, title: newValue});
    };

    return (
        <li className={task.isDone ? "is-done" : "not-is-done"}>
            <Checkbox color={'primary'} checked={task.isDone} onChange={onChangeHandler}/>
            <EditableSpan value={task.title} onChange={onTitleChangeHandler}/>
            <IconButton aria-label="delete" onClick={action('remove task')}>
                <DeleteIcon/>
            </IconButton>
        </li>
    );
};

export const TaskWorkStory = TemplateWork.bind({});