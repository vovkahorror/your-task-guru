import React, {ChangeEvent, FC, memo, useCallback, useState} from 'react';
import Checkbox from '@mui/material/Checkbox';
import {EditableSpan} from '../../../../components/EditableSpan/EditableSpan';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {TaskDomainType} from '../../tasks-reducer';
import {useAppSelector} from '../../../../utils/custom-hooks/useAppSelector';
import {useActions} from '../../../../utils/custom-hooks/useActions';
import {selectIsShowedTaskNotification, tasksActions} from '../..';
import {appActions} from '../../../../app';
import {TaskStatuses} from '../../../../api/types';
import styles from './Task.module.scss';
import {DeleteDialog} from '../../../../components/DeleteDialog/DeleteDialog';
import {toFormatDate, toFormatTime} from '../../../../utils/date-utils';

export type TaskPropsType = {
    task: TaskDomainType;
    todolistId: string
}

const Task: FC<TaskPropsType> = memo(({task, todolistId}) => {
    const isShowedTaskNotification = useAppSelector(selectIsShowedTaskNotification);
    const {removeTask, updateTask} = useActions(tasksActions);
    const {setTaskNotificationShowing} = useActions(appActions);
    const [openDialog, setOpenDialog] = useState(false);

    const date = toFormatDate(task.addedDate);
    const time = toFormatTime(task.addedDate);

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

    const handleClickOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = useCallback(() => {
        setOpenDialog(false);
    }, []);

    return (
        <li className={`${styles.task} ${task.status === TaskStatuses.Completed ? styles.isDone : ''}`}>
            <Checkbox color={'default'} checked={task.status === TaskStatuses.Completed}
                      disabled={task.entityStatus === 'loading'} onChange={checkHandler}/>
            <EditableSpan value={task.title} onChange={onTitleChangeHandler} titleType={'task'}
                          disabled={task.entityStatus === 'loading'}
                          isShowedNotification={isShowedTaskNotification}
                          setNotificationShowing={setNotificationShowing}/>
            <IconButton className={styles.deleteButton} aria-label="delete" disabled={task.entityStatus === 'loading'} onClick={handleClickOpenDialog}>
                <DeleteIcon/>
            </IconButton>
            <DeleteDialog title={'Are you sure you want to delete this task?'}
                          openDialog={openDialog}
                          handleCloseDialog={handleCloseDialog}
                          deleteHandler={removeTaskHandler}/>
        </li>
    );
});

export default Task;