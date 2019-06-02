import React from 'react';
import { Link } from 'react-router-dom';
import classes from './Page.module.css';

const Page: React.FC = ({ children, title }) => (
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

export default Page;
