import React, {ChangeEvent, FC, memo, useCallback} from 'react';
import Checkbox from '@mui/material/Checkbox';
import {EditableSpan} from '../../../../components/EditableSpan/EditableSpan';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {TaskDomainType} from '../../tasks-reducer';
import {TaskStatuses} from '../../../../api/todolists-api';
import {useAppSelector} from '../../../../utils/custom-hooks/useAppSelector';
import {useActions} from '../../../../utils/custom-hooks/useActions';
import {selectIsShowedTaskNotification, tasksActions} from '../..';
import {appActions} from '../../../../app';

export type TaskPropsType = {
    task: TaskDomainType;
    todolistId: string
}

const Task: FC<TaskPropsType> = memo(({task, todolistId}) => {
    const isShowedTaskNotification = useAppSelector(selectIsShowedTaskNotification);
    const {removeTask, updateTask} = useActions(tasksActions);
    const {setTaskNotificationShowing} = useActions(appActions);

    const removeTaskHandler = useCallback(() => {
        removeTask({taskId: task.id, todolistId});
    }, []);

    const checkHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const newStatusValue = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
        updateTask({todolistId, taskId: task.id, domainModel: {status: newStatusValue}});
    }, []);

    const onTitleChangeHandler = useCallback((newValue: string) => {
        updateTask({todolistId, taskId: task.id, domainModel: {title: newValue}});
    }, []);

    const setNotificationShowing = useCallback((isShowedTaskNotification: boolean) => {
        setTaskNotificationShowing({isShowedTaskNotification});
    }, []);

    return (
        <li className={task.status === TaskStatuses.Completed ? 'is-done' : 'not-is-done'}>
            <Checkbox color={'primary'} checked={task.status === TaskStatuses.Completed}
                      disabled={task.entityStatus === 'loading'} onChange={checkHandler}/>
            <EditableSpan value={task.title} onChange={onTitleChangeHandler} titleType={'task'}
                          disabled={task.entityStatus === 'loading'}
                          isShowedNotification={isShowedTaskNotification}
                          setNotificationShowing={setNotificationShowing}/>
            <IconButton aria-label="delete" disabled={task.entityStatus === 'loading'} onClick={removeTaskHandler}>
                <DeleteIcon/>
            </IconButton>
        </li>
    );
});

export default Task;