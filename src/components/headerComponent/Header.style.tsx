import styled from "styled-components";
import {NavLink} from "react-router-dom";

export const Container = styled.header`
  padding: 0 5vw 0 5vw;
  height: 5vw;
  background: #e5fffb;
`

export const Logo = styled(NavLink)`
  font-size: 2.5vw;
  float: left;
  color: #333333; 
  max-height: 5vw;
  text-align: left;
  line-height: 2.2vw;
  text-decoration: none;
  span{
    color: gray;
    font-size: 1vw;
  }
`
export const ContainerMenu = styled.div`
  display: flex;
  float: left;
  margin-left: 2vw;
  align-items: center;
  height: 5vw;
  TextField{
    padding-left: 4vw;
  }
`
export const ButtonsContainer = styled.div`
  display: flex;
  height: 3vw;
  padding:1vw 0 1vw 10vw;
  align-items: center;
  justify-content: space-around;
`
export const NavButton = styled(NavLink)`
  text-decoration: none;
  color: black;
`
export const UserButton= styled.button`
  outline: none;
  cursor: pointer;
  border: none;
  background: none;
  font-size: 1vw;
  color: gray;
  text-decoration-line: underline;
  padding: 0 0 0 0;
  width: 3vw;
  display: block;
`
export const ContainerTwo=styled.div`
  background: #282c34;
  height: 3.5vw;
  color: white;
  padding: 0 5vw 0 5vw;
  display: flex;
  align-items: center;
  font-size: 1.5vw;
  gap: 2vw;
  button{
    color: white;
    border: 1px solid white;
  }
`