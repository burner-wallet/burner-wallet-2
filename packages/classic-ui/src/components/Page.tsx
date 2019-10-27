import React from 'react';
import { Link } from 'react-router-dom';
import injectSheet from 'react-jss';
import Color from 'color';

const style = (theme: any) => ({
  page: {
    background: theme.paperBackground,
    padding: 15,
    borderRadius: 5,
    color: Color(theme.paperBackground).isLight() ? '#333333' : '#EEEEEE',
  },
  titleBar: {
    display: 'flex',
    borderBottom: '1px solid rgba(0, 0, 0, .1)',
    marginBottom: 5,
    height: 64,
  },
  titleText: {
    fontSize: 22,
    textAlign: 'center',
    flex: '1 0',
    lineHeight: '64px',
  },
  corner: {
    width: 64,
  },
  close: {
    fontSize: 54,
    textDecoration: 'none',
    display: 'block',
    textAlign: 'center',
  },
});

export interface PageProps {
  children: React.ReactNode;
  title?: string;
  classes: any;
}

const Page: React.FC<PageProps> = ({ children, title, classes }) => (
  <div className={classes.page}>
    {title && (
      <div className={classes.titleBar}>
        <div className={classes.corner} />
        <div className={classes.titleText}>{title}</div>
        <div className={classes.corner}>
          <Link to="/" className={classes.close}>&times;</Link>
        </div>
      </div>
    )}
    <div>
      {children}
    </div>
  </div>
);

export default injectSheet(style)(Page);
