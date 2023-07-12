import * as React from 'react';
import {Container, Logo, ContainerMenu, ButtonsContainer, NavButton, UserButton, ContainerTwo} from "./Header.style";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AppsIcon from '@mui/icons-material/Apps';
import {InputAdornment, TextField} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {useDispatch, useSelector} from "react-redux";
import {IUser} from "../../interfaces/AuthInterface";
import {loginUser, setAuth} from "../../actions/action";
import AuthService from "../../services/AuthService";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {Link, useNavigate} from "react-router-dom";
import { createSelector } from 'reselect';

type CurrentUser = {
    curUser: IUser;
    isAuth: boolean;
}
const getCurrentUser = (state: CurrentUser) => state.curUser;
const getIsAuth = (state: CurrentUser) => state.isAuth;
const selectUserInfo: (state: CurrentUser) => { curUser: IUser; isAuth: boolean } = createSelector(
    getCurrentUser,
    getIsAuth,
    (curUser: IUser, isAuth: boolean) => ({
        curUser,
        isAuth,
    })
);
export const Header = () => {
    const {logout} = AuthService()
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const { curUser, isAuth } = useSelector(selectUserInfo);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <Container>
                <Logo to={'/'}>
                    Shopkants<br/>
                    <span>Интернет-магазин канцтоваров</span>
                </Logo>
                <ContainerMenu>
                    <Button
                        variant='outlined'
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    > <AppsIcon/>
                        Товары
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>My account</MenuItem>
                        <MenuItem onClick={handleClose}>Logout</MenuItem>
                    </Menu>
                    <TextField
                        id="search"
                        type="search"
                        label="Search"
                        style={{"marginLeft": "10vw"}}
                        sx={{width: '25vw'}}
                        size="small"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon/>
                                </InputAdornment>
                            ),
                        }}
                    />
                </ContainerMenu>
                <ButtonsContainer>
                    {isAuth && curUser ?
                        <div>
                            <NavButton to={`/profile/${curUser.id}`}>
                                <PersonIcon sx={{fontSize: 35}}/>
                                <br/>
                                {curUser.username}
                            </NavButton>
                            <UserButton onClick={() => logout().then(() => {
                                navigate('/')
                                dispatch(setAuth(false))
                                dispatch(loginUser({} as IUser))
                            })}><ExitToAppIcon fontSize='small'/></UserButton>
                        </div>
                        :
                        <NavButton to={'/auth'}>
                            <PersonIcon sx={{fontSize: 35}}/>
                            <br/>
                            Войти
                        </NavButton>}
                    <NavButton to={'/wishlist'}>
                        <FavoriteIcon sx={{fontSize: 35}}/>
                        <br/>
                        Избраное
                    </NavButton>
                    <NavButton to={'/cart'}>
                        <LocalGroceryStoreIcon sx={{fontSize: 35}}/>
                        <br/>
                        Корзина
                    </NavButton>
                </ButtonsContainer>
            </Container>
            <ContainerTwo>
                <Link to={'/catalog'}>
                    <Button variant='outlined'>Каталог</Button>
                </Link>
                <div>
                    Скидки
                </div>
                <div>
                    Акции
                </div>
                <div>
                    Что-то ещё...
                </div>
            </ContainerTwo>
        </>
    );
};