import React, {useEffect} from 'react';
import ReactMap from './ReactMap.js'
import ReactChoropleth from './ReactChoropleth.js'
import PureMap from './PureMap.js'
import indiaData from './indiaData.json';

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div id="mapid" style={{height: '100vh'}}>
      <ReactMap />
      <div style={{position:"absolute", background:"white", top:"85px", left:"15px", padding:"20px", zIndex:"100"}}>
        <h4>
        Consolidated Data Here
        </h4>
      </div>
    </div>
  );
}

export default App;
