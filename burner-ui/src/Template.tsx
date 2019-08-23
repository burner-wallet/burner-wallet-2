import React from 'react';
import jss from 'jss';
import injectSheet, { ThemeProvider } from 'react-jss';

const defaultTheme = {
  background: '#975422',
  font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const styles = (theme: any) => ({
  '@global': {
    body: {
      backgroundImage: theme.background === defaultTheme.background ? 'linear-gradient(#553319, #ca6e28)' : '',
      backgroundColor: theme.background,
      backgroundAttachment: 'fixed',
      fontFamily: theme.font,
      height: '100%',
      width: '100%',
      margin: 0,
      fontSmoothing: 'antialiased',
    },
    html: {
      height: '100%',
      width: '100%',
    },
    '#root': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  container: {
    maxWidth: 740,
    width: '100%',
    padding: '0 8px',
    boxSizing: 'border-box',
  },
});

const Container: React.FC<{ classes: any }> = ({ children, classes }) => (
  <div className={classes.container}>
    {children}
  </div>
);

const WrappedContainer = injectSheet(styles)(Container);

const Template: React.FC<{ theme: any }> = ({ children, theme }) => {
  return (
    <ThemeProvider theme={{ ...defaultTheme, ...theme }}>
      <WrappedContainer>
        {children}
      </WrappedContainer>
    </ThemeProvider>
  );
};

export default Template;
