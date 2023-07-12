import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 4vw;
`
export const ContText = styled.div`
  display: flex;
  flex-wrap: wrap;
  text-align: left;
  width: 45vw;
  justify-content: center;
`
export const Image = styled.img`
    max-height: 20vw;
`

export const H1 = styled.span`
  font-family: Arimo;
  font-size: 3vw;
`
export const Subtitle = styled.span`
  font-family: Rubik;
  font-size: 1.8vw;
`
export const ContButtons = styled.div`
  padding-top: 2vw;
  display: flex;
`
export const ButtonOne = styled.button`
  background: #000000;
  border-radius: 2vw;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 1vw 2vw;
  gap: 10px;
  font-family: Rubik;
  color: white;
  width: 10vw;
  font-size: 1.5vw;
  height: 4vw;
  text-align: center;
  justify-content: center;
  align-items: center;
`
export const ButtonTwo =styled.button`
  margin-left: 2vw;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 1vw 2.5vw;
  height: 4vw;
  font-family: Rubik;
  font-size: 1.5vw;
  border: .1vw solid #000000;
  border-radius: 2vw;
  background-color: white;
  text-align: center;
  justify-content: center;
  align-items: center;
  width: 20vw;
`