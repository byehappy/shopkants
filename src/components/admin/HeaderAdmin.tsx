import React from 'react';
import styled from "styled-components";

const ContainerHeader = styled.div`
  display: flex;
  gap: 10vw;
  padding: 1vw 5vw 0 5vw;
  font-size: x-large;
`


export const HeaderAdmin = () => {
    return (
        <ContainerHeader>
            <a href="/admin/products">Товары</a>
            <a href="/admin/orders">Заказы</a>
            <a href="/admin/category">Категории</a>
        </ContainerHeader>
    );
};
