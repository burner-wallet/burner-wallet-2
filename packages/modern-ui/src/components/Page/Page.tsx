import React from 'react';
import styled from 'styled-components';
import PageTitleBar from './PageTitleBar';

const PageContainer = styled.main`
  margin: 0 var(--page-margin) var(--page-margin);
  padding: var(--page-margin);
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  background: #fafafa;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export interface PageProps {
  title?: string;
}

const Page: React.FC<PageProps> = ({ children, title }) => {
  return (
    <PageContainer>
      {title && <PageTitleBar title={title} />}
      <Content>{children}</Content>
    </PageContainer>
  );
};

export default Page;
