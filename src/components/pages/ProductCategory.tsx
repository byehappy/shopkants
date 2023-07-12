import React, {useState, useEffect} from 'react';
import {getProductCategory, Product} from '../../services/ProductService';
import {Container, ProductCont} from '../productList/ProductList.style'
import {ProductCard} from '../productCard/ProductCard';
import CircularProgress from '@mui/material/CircularProgress';
import {useSelector} from "react-redux";
import {IUser} from "../../interfaces/AuthInterface";
import {useParams} from "react-router-dom";

type CurrentUser = {
    curUser: IUser;
}
export const ProductCategory: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const { id } = useSelector((state: CurrentUser) => state.curUser);
    const { category_name } = useParams();

    useEffect(() => {
        const fetchProductList = async () => {
            try {
                const fetchedProducts = await getProductCategory(category_name); // Выполняем запрос на получение списка товаров
                setProducts(fetchedProducts);
            } catch (error) {
                console.error('Error fetching product list:', error);
            }
        };
        fetchProductList();
    }, []);

    if (!products.length) {
        return <CircularProgress/>;
    }

    return (
        <Container>
            <h1>{category_name}</h1>
            <ProductCont>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product}  CurrentUserId={id}/>
                ))}
            </ProductCont>
        </Container>
    );
};