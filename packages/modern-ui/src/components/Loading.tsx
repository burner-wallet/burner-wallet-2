import React from 'react';
import { useBurner } from '@burner-wallet/ui-core';
import styled, { keyframes } from 'styled-components';

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 40;
  display: flex;
  justify-content: center;
`;

const LoadingPanel = styled.div`
  max-width: 700px;
  padding: 10px;
  flex: 1;
  background: rgba(245, 245, 245, 0.9);
  text-align: center;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  display: flex;
  align-items: center;
  font-size: 24px;
`;

const rippleAnimation = keyframes`
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
`;

const Ripple = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  margin-right: 10px;

  &:before, &:after {
    content: '';
    display: block;
    position: absolute;
    border: 4px solid #aaaaaa;
    opacity: 1;
    border-radius: 50%;
    animation: ${rippleAnimation} 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }

  &:after {
    animation-delay: -0.5s;
  }
`;

const Loading: React.FC = () => {
  const { loading } = useBurner();
  if (!loading) {
    return null;
  }

  return (
    <Container>
      <LoadingPanel>
        <Ripple /> {loading}
      </LoadingPanel>
    </Container>
  )
}

export default Loading;