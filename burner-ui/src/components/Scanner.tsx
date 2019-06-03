import React, { ComponentType } from 'react';
import QrReader from 'react-qr-reader';
import { withBurner, BurnerContext } from '../BurnerProvider';
import classes from './Scanner.module.css';

const Scanner: React.FC<BurnerContext> = ({ children, completeScan }) =>
  completeScan && (
    <div className={classes.overlay}>
      <button type="button" onClick={() => completeScan(null)}>Close</button>
      <QrReader
        delay={300}
        onError={err => {
          console.error(err);
          completeScan(null);
        }}
        onScan={address => {
          if (address) {
            completeScan(address);
          }
        }}
      />
    </div>
  )

export default withBurner(Scanner);
