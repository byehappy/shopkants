import styled from 'styled-components'
import { NavLink } from "react-router-dom";

export const Container = styled.footer`
  margin-top: 2vw;
  padding: 1vw 5vw 0 5vw;
  height: 12vw;
  background: gainsboro;
  display: flex;
  justify-content: space-between;
  bottom: 0;
  width: 89vw;
  
`

export const Logo = styled(NavLink)`
  margin-top: 2vw;
  display: flex;
  font-size: 2.5vw;
  flex-direction: column;
  float: left;
  text-align: left;
  text-decoration: none;
  color: black;
  margin-bottom: auto;
  span{
    font-size: .9vw;
    color: gray;
  }
`
export const Contact = styled.div`
  display: flex;
  font-size: 2vw;
  text-align: left;
  margin-top: 2vw;
  span{
    font-size: 1vw;
  }
`

export const ContainerButton = styled.div`
  display: flex;
  margin-top: 2vw;
  font-size: 1.5vw;
  width: 12vw;
  flex-wrap: wrap;
  gap: 1vw;
  max-height: 8vw;
`
export const Button = styled(NavLink)`
  display: flex;
  font-size: 1.5vw;
  flex-direction: column;
  color: gray;
  max-height: 1vw;
  text-decoration: none;
  &:hover{
    color: black;
  }
`
export const ContainerInfo= styled.div`
  display: flex;
  margin-top: 2vw;
  font-size: 1.5vw;
  width: 15vw;
  gap: 2vw;
  line-height: 2vw;
  max-height: 8vw;
  flex-direction: column;
`