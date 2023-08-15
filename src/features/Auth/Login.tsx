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
import {logIn} from './auth-actions';
import styles from './Auth.module.scss';
import {TextWithCopyToClipboard} from '../../components/CopyToClipboardButton/TextWithCopyToClipboard';
import {Box} from '@mui/material';

export const Login = () => {
    const dispatch = useAppDispatch();
    const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn);
    const captchaUrl = useAppSelector(authSelectors.selectCaptchaUrl);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
            captcha: '',
        },
        validate: (values) => {
            const errors: FormikErrorType = {};

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

            return errors;
        },
        onSubmit: async (values, formikHelpers: FormikHelpers<FormValuesType>) => {
            const action = await dispatch(logIn(values));

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

    if (isLoggedIn) {
        return <Navigate to={'/'}/>;
    }

    return <Grid container className={styles.container}>
        <Grid item className={styles.item}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl className={styles.formControl}>
                    <FormLabel className={`${styles.formLabel} ${styles.infoCard}`}>
                        <p>You can <NavLink to={'/register'}>create your personal account</NavLink>, or if you just want
                            to test the possibilities of our application, use your demo account details to log in:</p>
                        <p>Email: <span className={styles.demoData}>
                            <TextWithCopyToClipboard text={'free@samuraijs.com'}/>
                        </span></p>
                        <p>Password: <span className={styles.demoData}>
                            <TextWithCopyToClipboard text={'free'}/>
                            </span></p>
                    </FormLabel>

                    <h2 className={styles.title}>Sign In</h2>
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
                            <Checkbox checked={formik.values.rememberMe} {...formik.getFieldProps('rememberMe')}/>
                        }/>
                        <Box display={captchaUrl ? 'flex' : 'none'} flexDirection={'column'} alignItems={'center'}>
                            <img src={captchaUrl as string} alt="captcha"/>
                            <TextField
                                label={`${(formik.touched.captcha && formik.errors.captcha) ? formik.errors.captcha : 'Captcha'}`}
                                type="text" margin="normal"
                                error={!!(formik.touched.captcha && formik.errors.captcha)} autoFocus
                                {...formik.getFieldProps('captcha')}/>
                        </Box>
                        <Button type={'submit'} variant={'contained'} color={'primary'}>
                            Log in
                        </Button>
                    </FormGroup>
                    <FormLabel className={styles.formLabel}>
                        <p className={styles.signUp}>Don't have an account? <NavLink to={'/register'}>Sign up</NavLink>
                        </p>
                    </FormLabel>
                </FormControl>
            </form>
        </Grid>
    </Grid>;
};

type FormValuesType = {
    email: string;
    password: string;
    rememberMe: boolean;
    captcha: string;
}

type FormikErrorType = {
    email?: string;
    password?: string;
    rememberMe?: boolean;
    captcha?: string;
}