import React from 'react';
import './App.css';
import MapComponent from './components/Map';
//import Cartography from './components/Cartography';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <h1>Google Maps en React</h1> */}
        <h1>Open Street Map en React</h1> 
        <MapComponent />
      </header>
    </div>
  );
}

export default App;
