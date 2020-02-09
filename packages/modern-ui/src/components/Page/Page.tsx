import React, { useEffect } from 'react';
import styled from 'styled-components';
import { PageProps } from '@burner-wallet/types';
import PageTitleBar from './PageTitleBar';
import ErrorBoundary from './ErrorBoundary';

const PageContainer = styled.main<{ fullscreen?: boolean }>`
  margin: 0 var(--page-margin) var(--page-margin);
  padding: var(--page-margin);
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  background: #fafafa;

  ${({ fullscreen }) => fullscreen ? `
    position: absolute;
    top: 60px;
    left: 10px;
    right: 10px;
    bottom: 10px;
  ` : ''}
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Page: React.FC<PageProps & { className?: string }> = ({ children, title, variant, className }) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  return (
    <PageContainer className={className} fullscreen={variant === 'fullscreen'}>
      {title && <PageTitleBar title={title} />}
      <Content>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </Content>
    </PageContainer>
  );
};

export default Page;
