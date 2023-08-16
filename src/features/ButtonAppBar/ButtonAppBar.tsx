import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import {useAppSelector} from '../../utils/custom-hooks/useAppSelector';
import {RequestStatusType} from '../../app/app-reducer';
import {useActions} from '../../utils/custom-hooks/useActions';
import {authActions} from '../Auth';
import logo from '../../assets/images/logo-light.png';
import styles from './ButtonAppBar.module.scss';

export default function ButtonAppBar() {
    const {logOut} = useActions(authActions);
    const status = useAppSelector<RequestStatusType>(state => state.app.status);
    const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn);

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="relative" className={styles.appBar}>
                <Toolbar>
                    <Typography className={styles.logoWrapper} marginRight={'10px'}
                                variant="h6" component="div">
                        <img className={styles.logo} src={logo} alt='logo'/>
                    </Typography>
                    <Typography className={styles.title} flexGrow={1} variant="h6" component="div">
                        Your Task Guru
                    </Typography>
                    {isLoggedIn && <Button className={styles.logOutButton} color="inherit" onClick={logOut}>Log out</Button>}
                </Toolbar>
                {status === 'loading' && <LinearProgress color={'success'} className={styles.linearProgress}/>}
            </AppBar>
        </Box>
    );
}
