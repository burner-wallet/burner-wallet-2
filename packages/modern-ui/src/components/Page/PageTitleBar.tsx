import React from "react";
import styled from 'styled-components';
import CloseButton from './CloseButton';

const TitleBar = styled.div`
  display: flex;
  height: 64px;
  padding: 0 4px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #F2F2F2;
  margin-bottom: 8px;

  @media (max-height:600px) {
    height: 42px;
  }
`;

const Title = styled.h1`
  margin: 0;
  
  @media (max-height:600px) {
    font-size: 22px;
  }
`;

export interface PageTitleBarProps {
  title: string;
}

const PageTitleBar: React.FC<PageTitleBarProps> = ({ title }) => (
  <TitleBar>
    <Title>{title}</Title>

    <CloseButton />
  </TitleBar>
);

export default PageTitleBar;
