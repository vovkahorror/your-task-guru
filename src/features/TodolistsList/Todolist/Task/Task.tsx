import React, {ChangeEvent, FC, memo, useCallback} from 'react';
import Checkbox from '@mui/material/Checkbox';
import {EditableSpan} from '../../../../components/EditableSpan/EditableSpan';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {removeTaskTC, updateTaskTC} from '../../tasks-reducer';
import {TaskStatuses, TaskType} from '../../../../api/todolists-api';
import {useAppDispatch} from '../../../../utils/custom-hooks/useAppDispatch';
import {useAppSelector} from '../../../../utils/custom-hooks/useAppSelector';
import {setTaskNotificationShowingAC, setTodolistNotificationShowingAC} from '../../../../app/app-reducer';

export type TaskPropsType = {
    task: TaskType;
    todolistId: string
}

const Task: FC<TaskPropsType> = memo(({task, todolistId}) => {
    const dispatch = useAppDispatch();

    const isShowedTaskNotification = useAppSelector<boolean>(state => state.app.isShowedTaskNotification);

    const onClickHandler = () => dispatch(removeTaskTC(task.id, todolistId));
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const newStatusValue = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
        dispatch(updateTaskTC(todolistId, task.id, {status: newStatusValue}));
    };
    const onTitleChangeHandler = (newValue: string) => {
        dispatch(updateTaskTC(todolistId, task.id, {title: newValue}));
    };
    const setTaskNotificationShowing = useCallback((isShowedTaskNotification: boolean) => {
        dispatch(setTaskNotificationShowingAC(isShowedTaskNotification));
    }, [dispatch]);

    return (
        <li className={task.status === TaskStatuses.Completed ? 'is-done' : 'not-is-done'}>
            <Checkbox color={'primary'} checked={task.status === TaskStatuses.Completed} onChange={onChangeHandler}/>
            <EditableSpan value={task.title} onChange={onTitleChangeHandler} titleType={'task'}
                          isShowedNotification={isShowedTaskNotification}
                          setNotificationShowing={setTaskNotificationShowing}/>
            <IconButton aria-label='delete' onClick={onClickHandler}>
                <DeleteIcon/>
            </IconButton>
        </li>
    );
});

export default Task;