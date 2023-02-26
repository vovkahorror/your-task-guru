import React, {FC, memo, useCallback, useEffect} from 'react';
import {EditableSpan} from '../../../components/EditableSpan/EditableSpan';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {AddItemForm} from '../../../components/AddItemForm/AddItemForm';
import Button from '@mui/material/Button';
import {addTaskTC, getTasksTC, TaskDomainType} from '../tasks-reducer';
import {changeFilterAC, changeTodolistTitleTC, removeTodolistTC, TodolistDomainType} from '../todolists-reducer';
import Task from './Task/Task';
import {TaskStatuses, TaskType} from '../../../api/todolists-api';
import {useAppDispatch} from '../../../utils/custom-hooks/useAppDispatch';
import {useAppSelector} from '../../../utils/custom-hooks/useAppSelector';
import {setTodolistNotificationShowingAC} from '../../../app/app-reducer';

export type TodolistPropsType = {
    todolist: TodolistDomainType;
}

export const Todolist: FC<TodolistPropsType> = memo(({todolist}) => {
    const {id, title, filter, entityStatus} = todolist;

    let tasks = useAppSelector<Array<TaskDomainType>>(state => state.tasks[id]);

    const isShowedTodolistNotification = useAppSelector<boolean>(state => state.app.isShowedTodolistNotification);

    const dispatch = useAppDispatch();

    const addTask = useCallback((title: string) => {
        dispatch(addTaskTC(id, title));
    }, [dispatch, id]);

    const removeTodolist = useCallback(() => {
        dispatch(removeTodolistTC(id));
    }, [dispatch, id]);

    const changeTodolistTitle = useCallback((title: string) => {
        dispatch(changeTodolistTitleTC(id, title));
    }, [dispatch, id]);

    const onAllClickHandler = useCallback(() => {
        if (filter !== 'all') {
            dispatch(changeFilterAC('all', id));
        }
    }, [dispatch, filter, id]);
    const onActiveClickHandler = useCallback(() => {
        if (filter !== 'active') {
            dispatch(changeFilterAC('active', id));
        }
    }, [dispatch, filter, id]);
    const onCompletedClickHandler = useCallback(() => {
        if (filter !== 'completed') {
            dispatch(changeFilterAC('completed', id));
        }
    }, [dispatch, filter, id]);
    const setTodolistNotificationShowing = useCallback((isShowedTodolistNotification: boolean) => {
        dispatch(setTodolistNotificationShowingAC(isShowedTodolistNotification));
    }, [dispatch]);

    if (filter === 'active') {
        tasks = tasks.filter(t => t.status === TaskStatuses.New);
    }
    if (filter === 'completed') {
        tasks = tasks.filter(t => t.status === TaskStatuses.Completed);
    }

    return (
        <div>
            <h3>
                <EditableSpan value={title} onChange={changeTodolistTitle} titleType={'To-Do list'}
                              disabled={entityStatus === 'loading'}
                              isShowedNotification={isShowedTodolistNotification}
                              setNotificationShowing={setTodolistNotificationShowing}/>
                <IconButton aria-label='delete' disabled={entityStatus === 'loading'} onClick={removeTodolist}>
                    <DeleteIcon/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask} disabled={entityStatus === 'loading'}/>
            <ul>
                {
                    tasks.map(t => {
                        return (
                            <Task
                                key={t.id}
                                task={t}
                                todolistId={id}
                            />
                        );
                    })
                }
            </ul>
            <div>
                <ButtonWithMemo variant={filter === 'all' ? 'outlined' : 'contained'} color='secondary'
                                onClick={onAllClickHandler} title={'All'}/>
                <ButtonWithMemo variant={filter === 'active' ? 'outlined' : 'contained'} color='success'
                                onClick={onActiveClickHandler} title={'Active'}/>
                <ButtonWithMemo variant={filter === 'completed' ? 'outlined' : 'contained'} color='error'
                                onClick={onCompletedClickHandler} title={'Completed'}/>
            </div>
        </div>
    );
});

type ButtonWithMemoPropsType = {
    variant: 'text' | 'outlined' | 'contained';
    color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    onClick: () => void;
    title: string;
}

const ButtonWithMemo: FC<ButtonWithMemoPropsType> = memo(({variant, color, onClick, title}) => {
    return <Button variant={variant} color={color} onClick={onClick}>{title}</Button>;
});