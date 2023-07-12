import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { RegCont } from './Auth.style';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import { Button, Stack, TextField } from '@mui/material';

// Валидационная схема для полей формы
const validationSchema = Yup.object().shape({
    username: Yup.string().required('Имя обязательно'),
    email: Yup.string().email('Неверный формат email').required('Email обязателен'),
    password: Yup.string().required('Пароль обязателен'),
    confirmPassword: Yup.string()
        .required('Это поле обязательно для заполнения')
        .oneOf([Yup.ref('password')], 'Пароли не совпадают'),
});

const RegForm = () => {
    const navigate = useNavigate();
    const { registration } = AuthService();

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await registration(values.username, values.password, values.email);
                console.log(response.data); // Handle the response as needed
                navigate('/');
            } catch (error) {
                console.log(error); // Handle the error as needed
            }

            setSubmitting(false);
        },
    });

    return (
        <RegCont>

            <form onSubmit={formik.handleSubmit}>
                <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
                        <h2>Регистрация</h2>
                    <div>
                        <TextField
                            fullWidth
                            error={formik.touched.username && Boolean(formik.errors.username)}
                            helperText={formik.touched.username && formik.errors.username}
                            sx={{ width: '15vw' }}
                            size="small"
                            label="Имя пользователя"
                            type="text"
                            id="username"
                            name="username"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                        />
                    </div>
                    <div>
                        <TextField
                            fullWidth
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            sx={{ width: '15vw' }}
                            size="small"
                            label="Почта"
                            type="email"
                            id="email"
                            name="email"
                            value={formik.values.email}
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
                            id="password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                        />
                    </div>
                    <div>
                        <TextField
                            fullWidth
                            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            sx={{ width: '15vw' }}
                            size="small"
                            label="Подтверждение пароля"
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                        />
                    </div>
                    <Button
                        style={{ alignItems: 'center' }}
                        variant="contained"
                        key="2"
                        type="submit"
                        disabled={formik.isSubmitting}
                    >
                        Зарегистрироваться
                    </Button>
                </Stack>
            </form>
        </RegCont>
    );
};

export default RegForm;
