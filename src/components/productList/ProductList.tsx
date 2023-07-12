import React, {useState, useEffect} from 'react';
import {getAllProducts, Product} from '../../services/ProductService';
import {Container, Name, ProductCont} from './ProductList.style';
import {ProductCard} from '../productCard/ProductCard';
import CircularProgress from '@mui/material/CircularProgress';
import {useSelector} from "react-redux";
import {IUser} from "../../interfaces/AuthInterface";

interface ProductListProps {
    name: string;
}
type CurrentUser = {
    curUser: IUser;
}
export const ProductList: React.FC<ProductListProps> = ({name}) => {
    const [products, setProducts] = useState<Product[]>([]);
    const { id } = useSelector((state: CurrentUser) => state.curUser);

    useEffect(() => {
        const fetchProductList = async () => {
            try {
                const fetchedProducts = await getAllProducts(); // Выполняем запрос на получение списка товаров
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
            <Name>{name}</Name>
            <ProductCont>
                {products.slice(0, 5).map((product) => (
                    <ProductCard key={product.id} product={product} CurrentUserId={id} />
                ))}
            </ProductCont>
        </Container>
    );
};