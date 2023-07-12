import * as React from 'react';
import MyPage from "../carousel/PageCarousel";
import {ProductList} from "../productList/ProductList";

const MainPage = () => {
    return (
        <div>
            <MyPage/>
            <ProductList name={'Часто продаваемые'}/>
            <ProductList name={'Часто продаваемые'}/>
            <ProductList name={'Часто продаваемые'}/>
        </div>
    );
};
export default MainPage;