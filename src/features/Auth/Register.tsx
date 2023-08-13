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
import {NavLink, useNavigate} from 'react-router-dom';
import {register} from './auth-actions';
import styles from './Login.module.scss';
import {RegisterParamsType} from '../../api/types';

export const Register = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

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
            try {
                await dispatch(register(values));
                formik.resetForm();
                navigate('/login')
            } catch (e) {

            }

        },
    });

    return <Grid container className={styles.container}>
        <Grid item className={styles.item}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl className={styles.formControl}>
                    <h2 className={styles.title}>Sign Up</h2>
                    <FormGroup className={styles.formGroup}>
                        <TextField
                            label={`${(formik.touched.login && formik.errors.login) ? formik.errors.login : 'Login'}`}
                            type="text" margin="normal"
                            error={!!(formik.touched.login && formik.errors.login)}
                            autoComplete={'new-password'}
                            {...formik.getFieldProps('login')}/>
                        <TextField
                            label={`${(formik.touched.email && formik.errors.email) ? formik.errors.email : 'Email'}`}
                            type="email" margin="normal"
                            error={!!(formik.touched.email && formik.errors.email)}
                            autoComplete={'new-password'}
                            {...formik.getFieldProps('email')}/>
                        <TextField
                            label={`${(formik.touched.password && formik.errors.password) ? formik.errors.password : 'Password'}`}
                            type="password" margin="normal"
                            error={!!(formik.touched.password && formik.errors.password)}
                            autoComplete={'new-password'}
                            {...formik.getFieldProps('password')}/>
                        <TextField
                            label={`${(formik.touched.confirmPassword && formik.errors.confirmPassword) ? formik.errors.confirmPassword : 'Confirm password'}`}
                            type="password" margin="normal"
                            error={!!(formik.touched.confirmPassword && formik.errors.confirmPassword)}
                            autoComplete={'new-password'}
                            {...formik.getFieldProps('confirmPassword')}/>
                        <FormControlLabel label={'I consent to the processing of my personal data'} control={
                            <Checkbox checked={formik.values.acceptOffer} {...formik.getFieldProps('acceptOffer')}/>
                        }/>
                        <Button type={'submit'} variant={'contained'} color={'primary'}
                                disabled={!formik.isValid || !formik.dirty || !formik.values.acceptOffer}>
                            Register
                        </Button>
                    </FormGroup>
                    <FormLabel className={styles.formLabel}>
                        <p className={styles.signUp}>Already have an account? <NavLink to={'/login'}>Sign in</NavLink>
                        </p>
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