import React, {FC, memo, useCallback, useEffect} from 'react';
import {EditableSpan} from './EditableSpan';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {AddItemForm} from './AddItemForm';
import Button from '@mui/material/Button';
import {addTaskTC, getTasksTC} from './state/tasks-reducer';
import {changeFilterAC, changeTodolistTitleTC, removeTodolistsTC, TodolistDomainType} from './state/todolists-reducer';
import TaskWithRedux from './TaskWithRedux';
import {TaskStatuses, TaskType} from './api/todolist-api';
import {useAppDispatch} from './custom-hooks/useAppDispatch';
import {useAppSelector} from './custom-hooks/useAppSelector';

export type TodolistWithReduxPropsType = {
    todolist: TodolistDomainType;
}

export const TodolistWithRedux: FC<TodolistWithReduxPropsType> = memo(({todolist}) => {
    const {id, title, filter} = todolist;

    useEffect(() => {
        dispatch(getTasksTC(id));
    }, []);

    let tasks = useAppSelector<Array<TaskType>>(state => state.tasks[id]);

    const dispatch = useAppDispatch();

    const addTask = useCallback((title: string) => {
        dispatch(addTaskTC(id, title));
    }, [dispatch, id]);

    const removeTodolist = useCallback(() => {
        dispatch(removeTodolistsTC(id));
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

    if (filter === 'active') {
        tasks = tasks.filter(t => t.status === TaskStatuses.New);
    }
    if (filter === 'completed') {
        tasks = tasks.filter(t => t.status === TaskStatuses.Completed);
    }

    return <div>
        <h3><EditableSpan value={title} onChange={changeTodolistTitle}/>
            <IconButton aria-label='delete' onClick={removeTodolist}>
                <DeleteIcon/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <ul>
            {
                tasks.map(t => {
                    return (
                        <TaskWithRedux
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
    </div>;
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