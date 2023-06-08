import React, { useEffect } from 'react';
import styled from 'styled-components';
import { saveJWT } from '../utils/jwt';

const SQUARE_CONNECTION_URL = (realmId) => `http://localhost:3000/api/square/auth?realmId=${realmId}`

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Button = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  background-color: #2ecc71;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

function LoginForm() {
  const queryParams = new URLSearchParams(window.location.search);
  const realmId = queryParams.get('realmId');
  const jwt = queryParams.get('token');

  const handleConnectWithSquare = () => {
    // Open the Square connection link in a new tab
    window.open(SQUARE_CONNECTION_URL(realmId), '_blank');
  };


  console.log('TOKEN', jwt)

  useEffect(() => {
    if (jwt) {
      console.log('SAVING JWT')
      saveJWT(jwt)
    }
  }, [])

  return (
    <Container>
      <Button onClick={handleConnectWithSquare}>Connect with Square</Button>
    </Container>
  );
}

export default LoginForm;

