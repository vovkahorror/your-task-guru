import React, {ChangeEvent, useState} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import TaskWithRedux from "../TaskWithRedux";
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "../EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {action} from '@storybook/addon-actions';
import ReduxStoreProviderDecorator from "./decorators/ReduxStoreProviderDecorator";
import {TaskPriorities, TaskStatuses } from '../api/todolist-api';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Todolist/TaskWithRedux',
    component: TaskWithRedux,
    args: {
        task: {id: '1', title: 'JS', status: TaskStatuses.Completed, todoListId: 'todolistId1', description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},
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
    task: {id: '2', title: 'CSS', status: TaskStatuses.New, todoListId: 'todolistId1', description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},
};

const TemplateWork: ComponentStory<typeof TaskWithRedux> = (args) => {
    const [task, setTask] = useState(args.task);

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const newStatusValue = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
        setTask({...task, status: newStatusValue});
    };
    const onTitleChangeHandler = (newValue: string) => {
        setTask({...task, title: newValue});
    };

    return (
        <li className={task.status === TaskStatuses.Completed ? "is-done" : "not-is-done"}>
            <Checkbox color={'primary'} checked={task.status === TaskStatuses.Completed} onChange={onChangeHandler}/>
            <EditableSpan value={task.title} onChange={onTitleChangeHandler}/>
            <IconButton aria-label="delete" onClick={action('remove task')}>
                <DeleteIcon/>
            </IconButton>
        </li>
    );
};

export const TaskWorkStory = TemplateWork.bind({});