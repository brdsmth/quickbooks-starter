import React from 'react'
import styled from 'styled-components'

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
            <AppName>Quickbooks Starter</AppName>
        </Container>
    )
}

export default Auth