import styled from 'styled-components'

export const IconsContainer = styled.div`
  display: flex;
  align-items: center;
  opacity: 0; /* Скрыть иконки по умолчанию */
  transition: opacity 0.3s ease; /* Плавный переход */
  justify-content: space-between;
  padding-left: 1vw;
  margin-bottom: 1vw;
`;

export const ProductContainer = styled.div`
  border-radius: 1.2vw;
  max-width: 15vw;
  margin-top: 1vw;
  transition: box-shadow 0.3s ease; /* Плавный переход для тени */
  display: grid;
  grid-template-rows: 15vw 10vw;
  align-items: center;
  justify-items: center;

  &:hover {
    box-shadow: 0 0.2vw 0.4vw rgba(0, 0, 0, 0.2); /* Добавление тени при наведении */
  }

  &:hover ${IconsContainer} {
    opacity: 1;
  }
`;


export const ProductTitle = styled.h2`
  font-size: 1vw;
  margin-bottom: 0.5vw;
  text-align: left;
  padding-left: 1vw;
`;

export const ProductImage = styled.img`
  max-width: 10vw;
  height: auto;
  margin-top: 0.5vw;
  max-height: 15vw;
`;

export const ProductPrice = styled.p`
  font-weight: bold;
  text-align: left;
  padding-left: 1vw;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1vw;
  cursor: pointer;
`;
export const StyledButtonCart = styled.button`
  border: none;
  background: none ;
  cursor: pointer;
  display: flex;
  align-items: center;
`
export const StyledButtonFavorite= styled.button`
  border: none;
  background: none ;
  cursor: pointer;
  display: flex;
  align-items: center;
`

export const InfoCont = styled.div`
  display: flex;
  height: auto;
  align-items: flex-start;
  justify-content: flex-end;
  flex-direction: column;
`