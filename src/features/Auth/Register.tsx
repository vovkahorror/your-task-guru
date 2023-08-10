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
import {useAppSelector} from '../../utils/custom-hooks/useAppSelector';
import {Navigate, NavLink} from 'react-router-dom';
import {authSelectors} from '.';
import {logIn, register} from './auth-actions';
import styles from './Login.module.scss';
import {RegisterParamsType} from '../../api/types';

export const Register = () => {
    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues: {
            login: '',
            email: '',
            password: '',
            confirmPassword: '',
            acceptOffer: false,
        },
        validate: (values) => {
            const errors: FormikErrorType = {};

            if (!values.login) {
                errors.login = 'Login required';
            }

            if (!values.email) {
                errors.email = 'Email required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }

            if (!values.password) {
                errors.password = 'Password required';
            } else if (values.password.length < 4) {
                errors.password = 'The length must be more than four characters';
            }

            if (!values.confirmPassword) {
                errors.confirmPassword = 'Password confirmation required';
            } else if (values.password !== values.confirmPassword) {
                errors.confirmPassword = 'Passwords do not match';
            }

            return errors;
        },
        onSubmit: async (values, formikHelpers: FormikHelpers<FormValuesType>) => {
            const action = await dispatch(register(values));

            if (logIn.rejected.match(action)) {
                if (action.payload?.fieldsErrors?.length) {
                    const error = action.payload?.fieldsErrors[0];
                    formikHelpers.setFieldError(error.field, error.error);
                }
            } else {
                formik.resetForm();
            }
        },
    });

    return <Grid container className={styles.container}>
        <Grid item className={styles.item}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl className={styles.formControl}>
                    <FormLabel className={styles.formLabel}>
                        <p>You can <NavLink to={'/register'}>create your personal account</NavLink>, or if you just want
                            to test the possibilities of our social network, use your demo account details to login:</p>
                        <p>Email: <span className={styles.demoData}>free@samuraijs.com</span></p>
                        <p>Password: <span className={styles.demoData}>free</span></p>
                    </FormLabel>
                    <FormGroup className={styles.formGroup}>
                        <TextField
                            label={`${(formik.touched.email && formik.errors.email) ? formik.errors.email : 'Email'}`}
                            type="email" margin="normal"
                            error={!!(formik.touched.email && formik.errors.email)}
                            {...formik.getFieldProps('email')}/>
                        <TextField
                            label={`${(formik.touched.password && formik.errors.password) ? formik.errors.password : 'Password'}`}
                            type="password" margin="normal"
                            error={!!(formik.touched.password && formik.errors.password)}
                            {...formik.getFieldProps('password')}/>
                        <FormControlLabel label={'Remember me'} control={
                            <Checkbox checked={formik.values.acceptOffer} {...formik.getFieldProps('rememberMe')}/>
                        }/>
                        <Button type={'submit'} variant={'contained'} color={'primary'}>
                            Log in
                        </Button>
                    </FormGroup>
                    <FormLabel className={styles.formLabel}>
                        <p className={styles.signUp}>Don't have an account? <NavLink to={'/register'}>Sign up</NavLink></p>
                    </FormLabel>
                </FormControl>
            </form>
        </Grid>
    </Grid>;
};

type FormValuesType = RegisterParamsType & {
    confirmPassword: string;
}

type FormikErrorType = {
    login?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    acceptOffer?: boolean;
}