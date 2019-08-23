import React from 'react';
import injectSheet from 'react-jss';

const styles = {
  line: {
    padding: '4px 0',
    margin: '4px 0',
    borderBottom: 'solid 1px #CCCCCC',
  },
  lineName: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  lineValue: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};

interface LineItemProps {
  name: string,
  value: string,
  classes: any,
}

const LineItem: React.FC<LineItemProps> = ({ name, value, classes }) => (
  <div className={classes.line}>
    <div className={classes.lineName}>{name}</div>
    <div className={classes.lineValue}>{value}</div>
  </div>
);

export default injectSheet(styles)(LineItem);
