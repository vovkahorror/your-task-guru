import React from 'react';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useFormik} from 'formik';

type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}

export const Login = () => {
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
        onSubmit: (values) => {
            alert(JSON.stringify(values));
            formik.resetForm();
        },
    });

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
                        <Button type={'submit'} variant={'contained'} color={'primary'}
                                disabled={!Object.keys(formik.touched).length || !!Object.keys(formik.errors).length}>
                            Login
                        </Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>;
};