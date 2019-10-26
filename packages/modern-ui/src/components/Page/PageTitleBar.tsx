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
`;

export interface PageTitleBarProps {
  title: string;
}

const PageTitleBar: React.FC<PageTitleBarProps> = ({ title }) => (
  <TitleBar>
    <h1>{title}</h1>

    <CloseButton />
  </TitleBar>
);

export default PageTitleBar;
