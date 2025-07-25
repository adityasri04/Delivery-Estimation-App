import React from 'react';
import { RecoilRoot } from 'recoil';
import DeliveryEstimate from './DeliveryEstimate';
import './App.css';

function App() {
  return (
    <RecoilRoot>
      <div className="App">
        <header className="App-header">
          <h1>Medicine Delivery Estimation</h1>
        </header>
        <main>
          <DeliveryEstimate />
        </main>
      </div>
    </RecoilRoot>
  );
}

export default App;
