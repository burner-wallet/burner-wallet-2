import React from 'react';
import styled from 'styled-components';

const Box = styled.div`
  border: solid 1px #DDDDDD;
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
`;

const amountStyles = `
  font-size: 36px;
  border: none;
  width: 100%;
  text-align: center;
  outline: none;
  margin: 8px 0;
  display: block;
  padding: 4px;
  flex: 1;
`;

const AmountInput = styled.input`${amountStyles}`;
const AmountDiv = styled.div`${amountStyles}`;

const Unit = styled.div`
  font-size: 18px;
  margin: 8px 0;
`;

interface InputBoxProps {
  value: string;
  unit: string;
  input?: boolean;
  onChange?: (val: string) => void;
}

const InputBox: React.FC<InputBoxProps> = ({ value, unit, input, onChange }) => (
  <Box>
    {input ? (
      <AmountInput
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange && onChange(e.target.value)}
        type="number"
        min="0"
        placeholder="0"
      />
    ) : (
      <AmountDiv>{value}</AmountDiv>
    )}
    <Unit>{unit}</Unit>
  </Box>
);

export default InputBox;
