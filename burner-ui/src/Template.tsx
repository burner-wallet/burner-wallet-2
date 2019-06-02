import React from 'react';
import './Template.css';

const Template: React.FC = ({ children }) => (
  <div className="container">
    {children}
  </div>
);

export default Template;
