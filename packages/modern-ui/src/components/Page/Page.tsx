import React from 'react';
import styled from 'styled-components';
import PageTitleBar from './PageTitleBar';

const PageContainer = styled.main`
  margin: 0 var(--page-margin);
`;

export interface PageProps {
  title?: string;
}

const Page: React.FC<PageProps> = ({ children, title }) => {
  return (
    <PageContainer>
      {title && <PageTitleBar title={title} />}
      <div>{children}</div>
    </PageContainer>
  );
};

export default Page;
