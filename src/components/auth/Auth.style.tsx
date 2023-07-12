import styled from "styled-components";

export const Container = styled.div`
  display: flex;
`

export const LoginCont = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  border: 1px solid gray;
  border-radius: 2vw;
  padding: 3vw 2vw 3vw 2vw;
  box-shadow: 1vw .8vw .7vw gray;
`
export const RegCont = styled.div`
  display: flex;
  margin-left: 5vw;
  flex-direction: column;
  text-align: left;
  border: 1px solid gray;
  border-radius: 2vw;
  padding: 3vw 2vw 3vw 2vw;
  box-shadow: 1vw .8vw .7vw gray;
`
export const ErrorMessages =styled.div`
  margin-top: 1.5vw;
  margin-left: 0.5vw;
    color: red;
    font-size: 1.2vw;
  text-wrap: normal;
  font-weight: 500;
`