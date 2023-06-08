import React from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 10px;
  background-color: #f0f0f0;
  text-align: left;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 10px;
`;

const TransactionTable = ({ transactions }) => {

    const formatAmount = (amount) => {
        console.log('AMOUNT', amount.path)

        return (amount.path / 100).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        });
        // console.log('AMOUNT', amount.value)
        // return new Intl.NumberFormat('en-US', {
        //     style: 'currency',
        //     currency: 'USD'
        //   }).format(amount / 100);
      };

    //   const formattedAmount = new Intl.NumberFormat('en-US', {
    //     style: 'currency',
    //     currency: 'USD'
    //   }).format(amount / 100);

    if (!transactions) {
        return (
            <TableContainer>
      <Table>
        <thead>
          <tr>
            <TableHeader>ID</TableHeader>
            <TableHeader>Created At</TableHeader>
            <TableHeader>Amount</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Payment Method</TableHeader>
          </tr>
        </thead>
      </Table>
    </TableContainer>
        )
    }
  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <TableHeader>ID</TableHeader>
            <TableHeader>Created At</TableHeader>
            <TableHeader>Amount</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Payment Method</TableHeader>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.id}</TableCell>
              <TableCell>{transaction.createdAt}</TableCell>
              <TableCell>{formatAmount(transaction.amountMoney.amount)}</TableCell>
              <TableCell>{transaction.status}</TableCell>
              <TableCell>{transaction.sourceType}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default TransactionTable;
