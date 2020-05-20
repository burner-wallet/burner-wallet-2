import React, { Fragment } from 'react';
import Color from 'color';
import styled, { ThemeProvider } from 'styled-components';
import GlobalStyles from './GlobalStyles';

export interface BurnerTheme {
  background: string;
  font: string;
  titleFont: string | null;
  accentColor: string;
  accentLight: string;
  accentDark: string;
  accentText: string;
  paperBackground: string;
  logo: string | null;
  pageMargin: string;
}

const defaultTheme = {
  background: '#ededed',
  font:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  titleFont: null,
  accentColor: '#4E3FCE',
  paperBackground: '#fafafa',
  logo: null,
  pageMargin: '16px',
};

const Container = styled.div`
  min-height: 100%;
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const makeTheme = (theme: any) => {
  const accent = Color(theme.accentColor)
  theme.accentLight = theme.accentLight || accent.lighten(0.5).hsl().string();
  theme.accentDark = theme.accentDark || accent.darken(0.5).hsl().string();
  theme.accentText = theme.accentText || accent.isDark() ? '#eeeeee' : '#111111';
  return theme;
}

const Template: React.FC<{ theme: any }> = ({ children, theme }) => {
  const mergedTheme = makeTheme({...defaultTheme, ...theme });
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
