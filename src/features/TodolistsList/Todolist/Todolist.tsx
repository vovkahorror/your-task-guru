import React, {FC, memo, useCallback} from 'react';
import {EditableSpan} from '../../../components/EditableSpan/EditableSpan';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {AddItemForm, AddItemFormSubmitHelpersType} from '../../../components/AddItemForm/AddItemForm';
import Button from '@mui/material/Button';
import {FilterValuesType, TodolistDomainType} from '../todolists-reducer';
import Task from './Task/Task';
import {useAppSelector} from '../../../utils/custom-hooks/useAppSelector';
import {selectIsShowedTodolistNotification, selectTasks, tasksActions, todolistsActions} from '..';
import {useActions} from '../../../utils/custom-hooks/useActions';
import {appActions} from '../../../app';
import styles from './Todolist.module.scss';
import {Grid, Paper} from '@mui/material';
import {useAppDispatch} from '../../../utils/custom-hooks/useAppDispatch';
import {TaskStatuses} from '../../../api/types';

export type TodolistPropsType = {
    todolist: TodolistDomainType;
}

export const Todolist: FC<TodolistPropsType> = memo(({todolist}) => {
    const {id, title, filter, entityStatus} = todolist;
    let tasks = useAppSelector(selectTasks(id));
    const isShowedTodolistNotification = useAppSelector(selectIsShowedTodolistNotification);
    const {removeTodolist, changeTodolistTitle, changeFilter} = useActions(todolistsActions);
    const {setTodolistNotificationShowing} = useActions(appActions);
    const dispatch = useAppDispatch();

    const addTaskHandler = useCallback(async (title: string, helpers: AddItemFormSubmitHelpersType) => {
        const resultAction = await dispatch(tasksActions.addTask({todolistId: id, title}));

        if (tasksActions.addTask.rejected.match(resultAction)) {
            const errorMessage = resultAction.payload?.errors[0] || 'Some error occurred';
            helpers.setError(errorMessage);
        } else {
            helpers.setTitle('');
        }
    }, [id]);

    const removeTodolistHandler = useCallback(() => {
        removeTodolist(id);
    }, [id]);

    const changeTodolistTitleHandler = useCallback((title: string) => {
        changeTodolistTitle({todolistId: id, title});
    }, [id]);

    const onFilterButtonClickHandler = useCallback((newFilter: FilterValuesType) => {
        if (filter !== newFilter) {
            changeFilter({value: newFilter, todolistId: id});
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

    const renderFilterButton = (filter: FilterValuesType, color: ColorType, text: string) => {
        return (
            <ButtonWithMemo variant={filter === 'all' ? 'outlined' : 'contained'} color={color}
                            onClick={() => onFilterButtonClickHandler(filter)} title={text}/>
        );
    };

    return (
        <Grid item>
            <Paper className={styles.todolist} elevation={5} sx={{backgroundColor: '#FDF001'}}>
                <h3 className={styles.title}>
                    <EditableSpan value={title} onChange={changeTodolistTitleHandler} titleType={'To-Do list'}
                                  disabled={entityStatus === 'loading'}
                                  isShowedNotification={isShowedTodolistNotification}
                                  setNotificationShowing={setNotificationShowing}/>
                    <IconButton className={styles.deleteButton} aria-label="delete"
                                disabled={entityStatus === 'loading'} onClick={removeTodolistHandler}>
                        <DeleteIcon/>
                    </IconButton>
                </h3>
                <AddItemForm addItem={addTaskHandler} disabled={entityStatus === 'loading'}/>
                <ul className={styles.list}>
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
                    {!tasks.length && <div>No tasks</div>}
                </ul>
                <div>
                    {renderFilterButton('all', 'secondary', 'All')}
                    {renderFilterButton('active', 'success', 'Active')}
                    {renderFilterButton('completed', 'error', 'Completed')}
                </div>
            </Paper>
        </Grid>
    );
});

type ColorType = 'error' | 'inherit' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | undefined;

type ButtonWithMemoPropsType = {
    variant: 'text' | 'outlined' | 'contained';
    color: ColorType;
    onClick: () => void;
    title: string;
}

const ButtonWithMemo: FC<ButtonWithMemoPropsType> = memo(({variant, color, onClick, title}) => {
    return <Button variant={variant} color={color} onClick={onClick}>{title}</Button>;
});