import React, {ChangeEvent, FC, memo} from 'react';
import Checkbox from '@mui/material/Checkbox';
import {EditableSpan} from './components/EditableSpan/EditableSpan';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {removeTaskTC, updateTaskTC} from './state/tasks-reducer';
import {TaskStatuses, TaskType} from './api/todolist-api';
import {useAppDispatch} from './custom-hooks/useAppDispatch';

export type TaskWithReduxPropsType = {
    task: TaskType;
    todolistId: string
}

const TaskWithRedux: FC<TaskWithReduxPropsType> = memo(({task, todolistId}) => {
    const dispatch = useAppDispatch();

    const onClickHandler = () => dispatch(removeTaskTC(task.id, todolistId));
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const newStatusValue = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
        dispatch(updateTaskTC(todolistId, task.id, {status: newStatusValue}));
    };
    const onTitleChangeHandler = (newValue: string) => {
        dispatch(updateTaskTC(todolistId, task.id, {title: newValue}));
    };

    return (
        <li className={task.status === TaskStatuses.Completed ? 'is-done' : 'not-is-done'}>
            <Checkbox color={'primary'} checked={task.status === TaskStatuses.Completed} onChange={onChangeHandler}/>
            <EditableSpan value={task.title} onChange={onTitleChangeHandler}/>
            <IconButton aria-label='delete' onClick={onClickHandler}>
                <DeleteIcon/>
            </IconButton>
        </li>
    );
});

export default TaskWithRedux;