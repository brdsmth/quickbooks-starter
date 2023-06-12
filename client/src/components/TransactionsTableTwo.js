import React, { useState } from 'react';
import styled from 'styled-components';

const TableWrapper = styled.div`
  max-width: 100%;
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f5f5f5;
  }
`;

const TableCell = styled.td`
  padding: 8px;
  border: 1px solid #ddd;
`;

const CheckboxCell = styled(TableCell)`
  width: 40px;
  text-align: center;
`;

const Checkbox = styled.input`
  cursor: pointer;
`;

const TransactionsTableTwo = ({ transactions }) => {
  const [selectedTransactions, setSelectedTransactions] = useState([]);

  const formatAmount = (amount) => {
    return (amount.path / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  const handleCheckboxChange = (transactionId) => {
    setSelectedTransactions((prevSelected) => {
      if (prevSelected.includes(transactionId)) {
        return prevSelected.filter((id) => id !== transactionId);
      } else {
        return [...prevSelected, transactionId];
      }
    });
  };

  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      const allTransactionIds = transactions.map((transaction) => transaction.id);
      setSelectedTransactions(allTransactionIds);
    } else {
      setSelectedTransactions([]);
    }
  };

  console.log('TRANSACTIONS', transactions)

  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          <tr>
            <CheckboxCell>
              <Checkbox
                type="checkbox"
                checked={(selectedTransactions && transactions) ? selectedTransactions.length === transactions.length : false}
                onChange={handleSelectAllChange}
              />
            </CheckboxCell>
            <TableCell>Transaction ID</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Source</TableCell>
            {/* Add more table headers as needed */}
          </tr>
        </thead>
        <tbody>
          {transactions && transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <CheckboxCell>
                <Checkbox
                  type="checkbox"
                  checked={selectedTransactions.includes(transaction.id)}
                  onChange={() => handleCheckboxChange(transaction.id)}
                />
              </CheckboxCell>
              <TableCell>{transaction.id}</TableCell>
              <TableCell>{formatAmount(transaction.amountMoney.amount)}</TableCell>
              <TableCell>{transaction.createdAt}</TableCell>
              <TableCell>{transaction.status}</TableCell>
              <TableCell>{transaction.sourceType}</TableCell>
              {/* Render other transaction data in respective cells */}
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
    </TableWrapper>
  );
};

export default TransactionsTableTwo;
