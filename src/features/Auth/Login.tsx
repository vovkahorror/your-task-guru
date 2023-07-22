import React from 'react';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {FormikHelpers, useFormik} from 'formik';
import {useAppDispatch} from '../../utils/custom-hooks/useAppDispatch';
import {logInTC} from './auth-reducer';
import {useAppSelector} from '../../utils/custom-hooks/useAppSelector';
import {Navigate} from 'react-router-dom';
import {selectIsLoggedIn} from './selectors';

type FormikErrorType = {
    email?: string;
    password?: string;
    rememberMe?: boolean;
}

export const Login = () => {
    const dispatch = useAppDispatch();
    const isLoggedIn = useAppSelector(selectIsLoggedIn);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        validate: (values) => {
            const errors: FormikErrorType = {};

            if (!values.email) {
                errors.email = 'Email is required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }

            if (!values.password) {
                errors.password = 'Password is required';
            } else if (values.password.length < 6) {
                errors.password = 'The length must be more than six characters';
            }

            return errors;
        },
        onSubmit: async (values, formikHelpers: FormikHelpers<FormValuesType>) => {
            const action = await dispatch(logInTC(values));

            if (logInTC.rejected.match(action)) {
                if (action.payload?.fieldsErrors?.length) {
                    const error = action.payload?.fieldsErrors[0];
                    formikHelpers.setFieldError(error.field, error.error);
                }
            } else {
                formik.resetForm();
            }
        },
    });

    if (isLoggedIn) {
        return <Navigate to={'/'}/>;
    }

    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>To log in get registered <a href={'https://social-network.samuraijs.com/'}
                                                       target={'_blank'}>here</a></p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField
                            label={`${(formik.touched.email && formik.errors.email) ? formik.errors.email : 'Email'}`}
                            type='email' margin='normal'
                            error={!!(formik.touched.email && formik.errors.email)}
                            {...formik.getFieldProps('email')}/>
                        <TextField
                            label={`${(formik.touched.password && formik.errors.password) ? formik.errors.password : 'Password'}`}
                            type='password' margin='normal'
                            error={!!(formik.touched.password && formik.errors.password)}
                            {...formik.getFieldProps('password')}/>
                        <FormControlLabel label={'Remember me'}
                                          control={<Checkbox checked={formik.values.rememberMe}
                                                             {...formik.getFieldProps('rememberMe')}/>}/>
                        <Button type={'submit'} variant={'contained'} color={'primary'}>
                            Log in
                        </Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>;
};

type FormValuesType = {
    email: string;
    password: string;
    rememberMe: boolean;
}