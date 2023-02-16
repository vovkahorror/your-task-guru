import React from 'react';
import './App.css';
import ButtonAppBar from './ButtonAppBar';
import {TodolistsList} from '../features/TodolistsList/TodolistsList';
import Container from '@mui/material/Container';
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar';

function App() {
    return (
        <div className='App'>
            <ButtonAppBar/>
            <Container fixed>
                <TodolistsList/>
            </Container>
            <ErrorSnackbar/>
        </div>
    );
}

export default App;
