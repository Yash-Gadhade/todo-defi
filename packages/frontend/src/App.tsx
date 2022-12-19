import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Header from './components/Header';

const App: React.FC<{}> = () => {
  return (
    <main>
      <Router>
        <Header />
      </Router>
    </main>
  );
}

export default App;
