import React, {useEffect} from 'react';
import './App.css';
import ButtonAppBar from './ButtonAppBar';
import {TodolistsList} from '../features/TodolistsList/TodolistsList';
import Container from '@mui/material/Container';
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar';
import {Navigate, Route, Routes, useLocation} from 'react-router-dom';
import {Login} from '../features/Login/Login';
import {useAppDispatch} from '../utils/custom-hooks/useAppDispatch';
import CircularProgress from '@mui/material/CircularProgress';
import {useAppSelector} from '../utils/custom-hooks/useAppSelector';
import {initializeAppTC} from './app-reducer';

function App() {
    const isInitialized = useAppSelector<boolean>(state => state.app.isInitialized);
    const dispatch = useAppDispatch();
    const location = useLocation();

    useEffect(() => {
        dispatch(initializeAppTC(location));
    }, []);

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>;
    }

    return (
        <div className="App">
            <ButtonAppBar/>
            <Container fixed>
                <Routes>
                    <Route path={'/'} element={<TodolistsList/>}/>
                    <Route path={'/login'} element={<Login/>}/>
                    <Route path={'/404'} element={<h1>404: PAGE NOT FOUND</h1>}/>
                    <Route path={'*'} element={<Navigate to={'/404'}/>}/>
                </Routes>
            </Container>
            <ErrorSnackbar/>
        </div>
    );
}

export default App;
