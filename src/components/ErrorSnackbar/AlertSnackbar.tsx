import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import {useAppSelector} from '../../utils/custom-hooks/useAppSelector';
import {useAppDispatch} from '../../utils/custom-hooks/useAppDispatch';
import {appActions} from '../../app';
import {setAppMessage} from '../../app/app-reducer';

const {setAppError} = appActions;

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const AlertSnackbar = () => {
    const message = useAppSelector<string | null>(state => state.app.message);
    const error = useAppSelector<string | null>(state => state.app.error);
    const dispatch = useAppDispatch();

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(setAppMessage({message: null}));
        dispatch(setAppError({error: null}));
    };

    return (
        <Snackbar open={!!(message || error)} autoHideDuration={3000} onClose={handleClose}
                  anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
            <Alert onClose={handleClose} severity={error ? 'error' : 'success'}
                   sx={{width: '100%'}}>
                {message || error}
            </Alert>
        </Snackbar>
    );
};
