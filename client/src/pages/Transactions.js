import React, { useState } from 'react'
import styled from 'styled-components'
import LoginForm from '../components/LoginForm';
import TransactionTable from '../components/TransactionTable';
import Button from '../components/Button';
import { getJWT } from '../utils/jwt';
import TransactionsTableTwo from '../components/TransactionsTableTwo';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 80%;
`;

const AppName = styled.div`
  font-size: 24px;
  margin-bottom: 20px;
`;


const Transactions = () => {

    const jwt = getJWT()

    const [transactions, setTransactions] = useState(null)

      const handleSyncWithQuickbooks = (e) => {
        e.preventDefault();
        console.log('click')
    
        // Make API call to the server for login
        fetch('/api/quickbooks/sync', {
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

      const handleSyncWithSquare = (e) => {
        e.preventDefault();
        console.log('click')
    
        // Make API call to the server for login
        fetch('/api/company/transactions', {
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
            setTransactions(data.transactions)
            // Perform any necessary actions based on the response
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      };

    
    return (
        <Container>
            <AppName>SquareBooks</AppName>
            <ButtonContainer> 
                <Button onClick={handleSyncWithSquare}>Sync with Square</Button>
                <Button onClick={handleSyncWithQuickbooks}>Sync with Quickbooks</Button>
            </ButtonContainer>
            <TransactionsTableTwo transactions={transactions} />
        </Container>
    )
}

export default Transactions