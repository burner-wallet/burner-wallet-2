import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'

const App: React.FC = ({ children }) => (
  <Router>
    {children}
  </Router>
);

export default App;
