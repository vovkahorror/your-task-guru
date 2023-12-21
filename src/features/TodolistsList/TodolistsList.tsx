import React, {useCallback, useEffect} from 'react';
import {useAppSelector} from '../../utils/custom-hooks/useAppSelector';
import {Grid} from '@mui/material';
import {AddItemForm, AddItemFormSubmitHelpersType} from '../../components/AddItemForm/AddItemForm';
import {Todolist} from './Todolist/Todolist';
import {Navigate} from 'react-router-dom';
import {authSelectors} from '../Auth';
import {useActions} from '../../utils/custom-hooks/useActions';
import {selectTodolists, todolistsActions} from '.';
import {useAppDispatch} from '../../utils/custom-hooks/useAppDispatch';
import styles from './TodolistsList.module.scss';
import {v1} from 'uuid';
import {DragDropContext, Droppable} from '@hello-pangea/dnd';

export const TodolistsList = () => {
    const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn);
    const todolists = useAppSelector(selectTodolists);
    const {fetchTodolists} = useActions(todolistsActions);
    const dispatch = useAppDispatch();

    const addTodolistHandler = useCallback(async (title: string, helpers: AddItemFormSubmitHelpersType) => {
        const resultAction = await dispatch(todolistsActions.addTodolist(title));

        if (todolistsActions.addTodolist.rejected.match(resultAction)) {
            const errorMessage = resultAction.payload?.errors[0] || 'Some error occurred';
            helpers.setError(errorMessage);
        } else {
            helpers.setTitle('');
        }
    }, []);

    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }

        fetchTodolists();
    }, []);

    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>;
    }

    return (
        <>
            <Grid className={styles.addTodolist} container justifyContent={'center'} padding={'40px'}
                  marginBottom={'20px'}>
                <AddItemForm addItem={addTodolistHandler}/>
            </Grid>

            <DragDropContext onDragEnd={() => {
            }}>
                <Droppable droppableId={v1()}>
                    {(provided) =>
                        <Grid ref={provided.innerRef}
                              container
                              className={styles.gridContainer}
                              spacing={10}
                              {...provided.droppableProps}>
                            {todolists.map(tl => {
                                return (
                                    <Todolist key={tl.id}
                                              todolist={tl}
                                    />
                                );
                            })}
                            {provided.placeholder}
                        </Grid>
                    }
                </Droppable>
            </DragDropContext>
        </>
    );
};