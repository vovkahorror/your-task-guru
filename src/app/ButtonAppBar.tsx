import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LinearProgress from '@mui/material/LinearProgress';
import {useAppSelector} from '../utils/custom-hooks/useAppSelector';
import {RequestStatusType} from './app-reducer';
import {useAppDispatch} from '../utils/custom-hooks/useAppDispatch';
import {logOutTC} from '../features/Auth/auth-reducer';

export default function ButtonAppBar() {
    const status = useAppSelector<RequestStatusType>(state => state.app.status);
    const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn);
    const dispatch = useAppDispatch();

    const logOutHandler = () => dispatch(logOutTC());

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position='static'>
                <Toolbar>
                    <IconButton
                        size='large'
                        edge='start'
                        color='inherit'
                        aria-label='menu'
                        sx={{mr: 2}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant='h6' component='div' sx={{flexGrow: 1}}>
                        TodoList
                    </Typography>
                    {isLoggedIn && <Button color='inherit' onClick={logOutHandler}>Log out</Button>}
                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
            </AppBar>
        </Box>
    );
}
