import React, {useEffect} from 'react';
import Navbar from './components/Navbar.js'
import ReactMap from './components/ReactMap.js'
import ReactChoropleth from './components/ReactChoropleth.js'
import PureMap from './components/PureMap.js'

import logo from './logo.svg';

function App() {
  return (
    <div style={{height: '100vh'}}>
      <Navbar />
      <ReactMap />
    </div>
  );
}

export default App;
