import React from 'react';
import logo from './logo.svg';
import './App.css';
import './asset/d3-style.css';
import Congressional from './components/Congressional';


function App() {
  return (
    <div className="App">
      <h2>Congressional React D3 Example</h2>
      <svg width='960' height='600'>
            <Congressional width={960} height={600}/>
        </svg>
    </div>
  );
}

export default App;
