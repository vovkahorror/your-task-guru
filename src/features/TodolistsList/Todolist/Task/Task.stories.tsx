import React, {ChangeEvent, useState} from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import Task from './Task';
import Checkbox from '@mui/material/Checkbox';
import {EditableSpan} from '../../../../components/EditableSpan/EditableSpan';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {action} from '@storybook/addon-actions';
import {ReduxStoreProviderDecorator} from '../../../../stories/decorators/ReduxStoreProviderDecorator';
import {BrowserRouterDecorator} from '../../../../stories/decorators/BrowserRouterDecorator';
import {TaskPriorities, TaskStatuses} from '../../../../api/types';
import styles from './Task.module.scss';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Todolist/Task',
    component: Task,
    args: {
        task: {
            id: '1', title: 'JS', status: TaskStatuses.Completed, todoListId: 'todolistId1', description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatus: 'idle',
        },
        todolistId: 'td1',
    },
    decorators: [ReduxStoreProviderDecorator, BrowserRouterDecorator],
} as ComponentMeta<typeof Task>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

export const TaskIsDoneStory = Template.bind({});

export const TaskIsNotDoneStory = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
TaskIsNotDoneStory.args = {
    task: {
        id: '2', title: 'CSS', status: TaskStatuses.New, todoListId: 'todolistId1', description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatus: 'idle',
    },
};

const TemplateWork: ComponentStory<typeof Task> = (args) => {
    const [task, setTask] = useState(args.task);

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const newStatusValue = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
        setTask({...task, status: newStatusValue});
    };
    const onTitleChangeHandler = (newValue: string) => {
        setTask({...task, title: newValue});
    };
    const setTaskNotificationShowing = (isShowedTaskNotification: boolean) => {}

    return (
        <li className={`${styles.task} ${task.status === TaskStatuses.Completed ? styles.isDone : ''}`}>
            <Checkbox color={'primary'} checked={task.status === TaskStatuses.Completed}
                      onChange={onChangeHandler}/>
            <EditableSpan value={task.title} onChange={onTitleChangeHandler} titleType={'task'}
                          isShowedNotification={false}
                          setNotificationShowing={setTaskNotificationShowing}/>
            <IconButton aria-label="delete" onClick={action('remove task')}>
                <DeleteIcon/>
            </IconButton>
        </li>
    );
};

export const TaskWorkStory = TemplateWork.bind({});