import React from 'react';
import styled from 'styled-components';
import { PageProps } from '@burner-wallet/types';
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

const Page: React.FC<PageProps & { className?: string }> = ({ children, title, className }) => {
  return (
    <PageContainer className={className}>
      {title && <PageTitleBar title={title} />}
      <Content>{children}</Content>
    </PageContainer>
  );
};

export default Page;
