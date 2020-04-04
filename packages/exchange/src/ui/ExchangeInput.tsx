import React from 'react';
import styled from 'styled-components';
import InputBox from './InputBox';

const Container = styled.div`
  display: flex;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  align-items: center;
`;

const Col = styled.div`
  width: 50%;
  align-self: stretch;
  
  &:first-child {
    margin-right: -1px;
  }
`;

const ArrowContainer = styled.div`
  width: 0;
`;

const Arrow = styled.div`
  position: absolute;
  background: #444444;
  transform: translate(-50%, -50%);
  border-radius: 100px;
  color: white;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

interface ExchangeInputProps {
  input: string;
  output: string;
  inputUnit: string;
  outputUnit: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

const ExchangeInput: React.FC<ExchangeInputProps> = ({ input, output, inputUnit, outputUnit, onChange, disabled }) => {
  return (
    <Container>
      <Col>
        <InputBox
          value={input}
          unit={inputUnit}
          input
          onChange={(value: string) => disabled || onChange(value)}
        />
      </Col>
      
      <ArrowContainer>
        <Arrow>&gt;</Arrow>
      </ArrowContainer>

      <Col>
        <InputBox value={output} unit={outputUnit} />
      </Col>
    </Container>
  );
};

export default ExchangeInput;
