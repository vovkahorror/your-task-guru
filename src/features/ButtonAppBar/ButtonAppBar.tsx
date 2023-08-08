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
import woodTextureImage from '../../assets/images/wood-texture.jpg';

export default function ButtonAppBar() {
    const {logOut} = useActions(authActions);
    const status = useAppSelector<RequestStatusType>(state => state.app.status);
    const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn);

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static" sx={{backgroundImage: `url(${woodTextureImage})`}}>
                <Toolbar>
                    <Typography className={styles.logoWrapper} marginRight={'10px'}
                                variant="h6" component="div">
                        <img className={styles.logo} src={logo} alt='logo'/>
                    </Typography>
                    <Typography fontFamily={'Monster Reading'} fontSize={'36px'} flexGrow={1} marginBottom={'-14px'} variant="h6" component="div">
                        Your Task Guru
                    </Typography>
                    {isLoggedIn && <Button color="inherit" onClick={logOut}>Log out</Button>}
                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
            </AppBar>
        </Box>
    );
}
