import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  background-color: #2ecc71;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const Button = ({ children, onClick }) => {
    return (
        <StyledButton onClick={onClick}>
            {children}
        </StyledButton>
    )
}

export default Button