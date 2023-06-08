import React from 'react'
import styled from 'styled-components'
import LoginForm from '../components/LoginForm';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const AppName = styled.div`
  font-size: 24px;
  margin-bottom: 20px;
`;


const Auth = () => {
    return (
        <Container>
            <AppName>SquareBooks</AppName>
            <LoginForm />
        </Container>
    )
}

export default Auth