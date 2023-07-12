import styled from "styled-components";
import {CartList} from "../cart/CartList";
import CartOrder from "../cart/CartOrder";

const CartContainer = styled.div`
  border-radius: 1vw;
  border: .1vw solid #E5E8FF;
  margin: 5vw;
  width: 25vw;
  background: #F7F6FF;
  padding: .5vw;
`


const Cart = () => {
    return (
        <div style={{display:'flex'}}>
            <CartOrder/>
            <CartContainer>
                <CartList name={'Ваша корзина'}/>
            </CartContainer>
        </div>
    );
};

export default Cart;