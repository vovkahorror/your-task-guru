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
    const {addTask} = useActions(tasksActions);
    const {removeTodolist, changeTodolistTitle, changeFilter} = useActions(todolistsActions);
    const {setTodolistNotificationShowing} = useActions(appActions);

    const addTaskHandler = useCallback((title: string) => {
        addTask({todolistId: id, title});
    }, [id]);

    const removeTodolistHandler = useCallback(() => {
        removeTodolist(id);
    }, [id]);

    const changeTodolistTitleHandler = useCallback((title: string) => {
       changeTodolistTitle({todolistId: id, title});
    }, [id]);

    const onAllClickHandler = useCallback(() => {
        if (filter !== 'all') {
            changeFilter({value: 'all', todolistId: id});
        }
    }, [filter, id]);

    const onActiveClickHandler = useCallback(() => {
        if (filter !== 'active') {
            changeFilter({value: 'active', todolistId: id});
        }
    }, [filter, id]);

    const onCompletedClickHandler = useCallback(() => {
        if (filter !== 'completed') {
            changeFilter({value: 'completed', todolistId: id});
        }
    }, [filter, id]);

    const setNotificationShowing = useCallback((isShowedTodolistNotification: boolean) => {
       setTodolistNotificationShowing({isShowedTodolistNotification});
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
                <EditableSpan value={title} onChange={changeTodolistTitleHandler} titleType={'To-Do list'}
                              disabled={entityStatus === 'loading'}
                              isShowedNotification={isShowedTodolistNotification}
                              setNotificationShowing={setNotificationShowing}/>
                <IconButton aria-label="delete" disabled={entityStatus === 'loading'} onClick={removeTodolistHandler}>
                    <DeleteIcon/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTaskHandler} disabled={entityStatus === 'loading'}/>
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