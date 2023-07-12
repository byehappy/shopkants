import React, {useEffect} from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Header} from "./components/headerComponent/Header";
import Footer from "./components/footerComponent/Footer";
import MainPage from "./components/pages/MainPage";
import {Form} from "./components/auth/Form";
import {useDispatch} from "react-redux";
import {checkAuth, loginUser, setAuth} from "./actions/action";
import Cookies from 'js-cookie';
import Catalog from "./components/pages/Catalog";
import Cart from "./components/pages/Cart";
import {WishlistPage} from "./components/pages/Wishlist";
import {ProductCategory} from "./components/pages/ProductCategory";
import Profile from "./components/pages/Profile";

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        if (Cookies.get('refresh_token')) {
            checkAuth().then(data => {
                dispatch(setAuth(true))
                dispatch(loginUser(data!.data))
            })
        }
    }, [])

    return (
        <div className="App">
            <Router>
                <Header />
                <Routes>
                    <Route path={'/'} element={<MainPage/>}/>
                    <Route path={'/auth'} element={<Form/>}/>
                    <Route path={'/catalog'} element={<Catalog/>}/>
                    <Route path={'/cart'} element={<Cart/>}/>
                    <Route path={'/wishlist'} element={<WishlistPage/>}/>
                    <Route path={'/catalog/:category_name'} element={<ProductCategory/>}/>
                    <Route path={'/profile/:id'} element={<Profile/>}/>
                </Routes>
                <Footer />
            </Router>
        </div>
    );
}

export default App;
