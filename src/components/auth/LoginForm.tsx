import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { LoginCont } from './Auth.style';
import AuthService from '../../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, TextField } from '@mui/material';
import {useDispatch} from "react-redux";
import {loginUser, setAuth} from "../../actions/action";

const validationSchema = Yup.object().shape({
    username: Yup.string()
        .required('Это поле обязательно для заполнения')
        .min(4, 'Имя слишком короткое')
        .matches(/[a-zA-Z]/, 'Используйте только латинские буквы a-z'),
    password: Yup.string().required('Пароль обязателен'),
});

const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = AuthService(); // Create an instance of the AuthService
    const dispatch = useDispatch()

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await login(values.username, values.password);
                dispatch(loginUser(response.data.user))
                dispatch(setAuth(true))
                navigate('/');
            } catch (error) {
                console.log(error); // Handle the error as needed
            }

            setSubmitting(false);
        },
    });

    return (
        <LoginCont>
            <form onSubmit={formik.handleSubmit}>
                <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
                    <h2>Вход</h2>
                    <div>
                        <TextField
                            fullWidth
                            error={formik.touched.username && Boolean(formik.errors.username)}
                            helperText={formik.touched.username && formik.errors.username}
                            sx={{ width: '15vw' }}
                            size="small"
                            label="Имя пользователя"
                            type="text"
                            id="loginusername"
                            name="username"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                        />
                    </div>
                    <div>
                        <TextField
                            fullWidth
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            sx={{ width: '15vw' }}
                            size="small"
                            label="Пароль"
                            type="password"
                            id="loginpassword"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                        />
                    </div>
                    <Button
                        style={{ alignItems: 'center' }}
                        variant="contained"
                        key="1"
                        type="submit"
                        disabled={formik.isSubmitting}
                    >
                        Войти
                    </Button>
                </Stack>
            </form>
        </LoginCont>
    );
};

export default LoginForm;
