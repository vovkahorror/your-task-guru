import React, {FC, memo, useCallback} from 'react';
import {EditableSpan} from '../../../components/EditableSpan/EditableSpan';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {AddItemForm} from '../../../components/AddItemForm/AddItemForm';
import Button from '@mui/material/Button';
import {TodolistDomainType} from '../todolists-reducer';
import Task from './Task/Task';
import {TaskStatuses} from '../../../api/todolists-api';
import {useAppSelector} from '../../../utils/custom-hooks/useAppSelector';
import {selectIsShowedTodolistNotification, selectTasks, tasksActions, todolistsActions} from '..';
import {useActions} from '../../../utils/custom-hooks/useActions';
import {appActions} from '../../../app';

export type TodolistPropsType = {
    todolist: TodolistDomainType;
}

export const Todolist: FC<TodolistPropsType> = memo(({todolist}) => {
    const {id, title, filter, entityStatus} = todolist;
    let tasks = useAppSelector(selectTasks(id));
    const isShowedTodolistNotification = useAppSelector(selectIsShowedTodolistNotification);
    const {addTaskTC} = useActions(tasksActions);
    const {removeTodolistTC, changeTodolistTitleTC, changeFilterAC} = useActions(todolistsActions);
    const {setTodolistNotificationShowingAC} = useActions(appActions);

    const addTask = useCallback((title: string) => {
        addTaskTC({todolistId: id, title});
    }, [id]);

    const removeTodolist = useCallback(() => {
        removeTodolistTC(id);
    }, [id]);

    const changeTodolistTitle = useCallback((title: string) => {
       changeTodolistTitleTC({todolistId: id, title});
    }, [id]);

    const onAllClickHandler = useCallback(() => {
        if (filter !== 'all') {
            changeFilterAC({value: 'all', todolistId: id});
        }
    }, [filter, id]);

    const onActiveClickHandler = useCallback(() => {
        if (filter !== 'active') {
            changeFilterAC({value: 'active', todolistId: id});
        }
    }, [filter, id]);

    const onCompletedClickHandler = useCallback(() => {
        if (filter !== 'completed') {
            changeFilterAC({value: 'completed', todolistId: id});
        }
    }, [filter, id]);

    const setTodolistNotificationShowing = useCallback((isShowedTodolistNotification: boolean) => {
       setTodolistNotificationShowingAC({isShowedTodolistNotification});
    }, []);

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
                <IconButton aria-label="delete" disabled={entityStatus === 'loading'} onClick={removeTodolist}>
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
                <ButtonWithMemo variant={filter === 'all' ? 'outlined' : 'contained'} color="secondary"
                                onClick={onAllClickHandler} title={'All'}/>
                <ButtonWithMemo variant={filter === 'active' ? 'outlined' : 'contained'} color="success"
                                onClick={onActiveClickHandler} title={'Active'}/>
                <ButtonWithMemo variant={filter === 'completed' ? 'outlined' : 'contained'} color="error"
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