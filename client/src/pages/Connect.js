import React from 'react';
import Button from '../components/Button';
import { Container } from './Auth';
import { getJWT } from '../utils/jwt';

const Connect = () => {

    const jwt = getJWT()

    const handleImport = (e) => {
        e.preventDefault();
        console.log('click')
    
        // Make API call to the server for login
        fetch('/api/square/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jwtToken: jwt }),
        })
          .then((response) => response.json())
          .then((data) => {
            // Handle the response from the server
            console.log(data);
            // Perform any necessary actions based on the response
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      };
  return (
    <Container>
        <h1>Connect Page</h1>
        <Button onClick={handleImport}>Import Data</Button>
    </Container>
  )
};

export default Connect;