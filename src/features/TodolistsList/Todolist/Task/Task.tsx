import React, {ChangeEvent, FC, memo, useCallback} from 'react';
import Checkbox from '@mui/material/Checkbox';
import {EditableSpan} from '../../../../components/EditableSpan/EditableSpan';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {removeTaskTC, TaskDomainType, updateTaskTC} from '../../tasks-reducer';
import {TaskStatuses} from '../../../../api/todolists-api';
import {useAppDispatch} from '../../../../utils/custom-hooks/useAppDispatch';
import {useAppSelector} from '../../../../utils/custom-hooks/useAppSelector';
import {setTaskNotificationShowingAC} from '../../../../app/app-reducer';

export type TaskPropsType = {
    task: TaskDomainType;
    todolistId: string
}

const Task: FC<TaskPropsType> = memo(({task, todolistId}) => {
    const dispatch = useAppDispatch();
    const isShowedTaskNotification = useAppSelector<boolean>(state => state.app.isShowedTaskNotification);

    const removeTaskHandler = () => dispatch(removeTaskTC({taskId: task.id, todolistId}));
    const checkHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const newStatusValue = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
        dispatch(updateTaskTC({todolistId, taskId: task.id, domainModel: {status: newStatusValue}}));
    };
    const onTitleChangeHandler = (newValue: string) => {
        dispatch(updateTaskTC({todolistId, taskId: task.id, domainModel: {title: newValue}}));
    };
    const setTaskNotificationShowing = useCallback((isShowedTaskNotification: boolean) => {
        dispatch(setTaskNotificationShowingAC({isShowedTaskNotification}));
    }, [dispatch]);

    return (
        <li className={task.status === TaskStatuses.Completed ? 'is-done' : 'not-is-done'}>
            <Checkbox color={'primary'} checked={task.status === TaskStatuses.Completed}
                      disabled={task.entityStatus === 'loading'} onChange={checkHandler}/>
            <EditableSpan value={task.title} onChange={onTitleChangeHandler} titleType={'task'}
                          disabled={task.entityStatus === 'loading'}
                          isShowedNotification={isShowedTaskNotification}
                          setNotificationShowing={setTaskNotificationShowing}/>
            <IconButton aria-label="delete" disabled={task.entityStatus === 'loading'} onClick={removeTaskHandler}>
                <DeleteIcon/>
            </IconButton>
        </li>
    );
});

export default Task;