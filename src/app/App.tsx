import React, {useEffect} from 'react';
import ButtonAppBar from '../features/ButtonAppBar/ButtonAppBar';
import {TodolistsList} from '../features/TodolistsList/TodolistsList';
import Container from '@mui/material/Container';
import {AlertSnackbar} from '../components/ErrorSnackbar/AlertSnackbar';
import {Navigate, Route, Routes} from 'react-router-dom';
import {Login} from '../features/Auth/Login';
import CircularProgress from '@mui/material/CircularProgress';
import {useAppSelector} from '../utils/custom-hooks/useAppSelector';
import {appActions, appSelectors} from '.';
import {useActions} from '../utils/custom-hooks/useActions';
import {WithDarkTheme} from '../common/hoc/WithDarkTheme';
import {Register} from '../features/Auth/Register';

function App() {
    const isInitialized = useAppSelector(appSelectors.selectIsInitialized);
    const {initializeApp} = useActions(appActions);

    useEffect(() => {
        if (!isInitialized) {
            initializeApp();
        }
    }, []);

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>;
    }

    return (
        <div>
            <ButtonAppBar/>
            <Container maxWidth={false}>
                <Routes>
                    <Route path={'/'} element={<TodolistsList/>}/>
                    <Route path={'/login'} element={WithDarkTheme(<Login/>)}/>
                    <Route path={'/register'} element={WithDarkTheme(<Register/>)}/>
                    <Route path={'/404'} element={<h1>404: PAGE NOT FOUND</h1>}/>
                    <Route path={'*'} element={<Navigate to={'/404'}/>}/>
                </Routes>
            </Container>
            <AlertSnackbar/>
        </div>
    );
}

export default App;
