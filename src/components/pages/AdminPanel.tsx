import {HeaderAdmin} from "../admin/HeaderAdmin";
import ProductsList from "../admin/ProductList";
import CategoryList from "../admin/CategoryList";
import OrderList from "../admin/OrderList";

export const AdminPanel = () => {
    const pathName = window.location.pathname;
    return (
        <div>
            <HeaderAdmin/>
            {pathName === '/admin/products' && <ProductsList />}
            {pathName === '/admin/orders' && <OrderList />}
            {pathName === '/admin/category' && <CategoryList />}
        </div>
    );
};