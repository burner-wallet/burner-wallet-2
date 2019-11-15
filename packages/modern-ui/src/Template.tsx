import React, { Fragment } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import GlobalStyles from './GlobalStyles';

const defaultTheme = {
  background: '#975422',
  font:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  titleFont: null,
  accentColor: '#4E3FCE',
  paperBackground: '#f2f2f2',
  homeButtonColor: null
};

const Container = styled.div`
  min-height: 100%;
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const Template: React.FC<{ theme: any }> = ({ children, theme }) => {
  const mergedTheme = {...defaultTheme, ...theme };
  return (
    <Container>
      <GlobalStyles theme={mergedTheme} />
      <ThemeProvider theme={mergedTheme}>
        <Fragment>{children}</Fragment>
      </ThemeProvider>
    </Container>
  );
};

export default Template;
