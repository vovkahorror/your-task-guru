import React from 'react';
import './App.css';
import ButtonAppBar from './ButtonAppBar';
import {Container} from '@mui/material';
import {TodolistsList} from '../features/TodolistsList/TodolistsList';

function App() {
    return (
        <div className='App'>
            <ButtonAppBar/>
            <Container fixed>
                <TodolistsList/>
            </Container>
        </div>
    );
}

export default App;
