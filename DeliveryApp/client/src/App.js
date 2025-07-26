import React from 'react';
import { RecoilRoot } from 'recoil';
import DeliveryEstimate from './DeliveryEstimate';
import './App.css';

function App() {
  return (
    <RecoilRoot>
      <div className="App">
        {/* Header */}
        <header className="app-header">
          <div className="header-left">
            <button className="icon-button">
              <i className="fas fa-bars"></i>
            </button>
            <button className="icon-button">
              <i className="fas fa-search"></i>
            </button>
          </div>
          <div className="header-center">
            <h1 className="brand-logo">Clinikally</h1>
          </div>
          <div className="header-right">
            <button className="icon-button">
              <i className="fas fa-user"></i>
            </button>
            <button className="icon-button cart-button">
              <i className="fas fa-shopping-cart"></i>
              <span className="cart-count">0</span>
            </button>
          </div>
        </header>

        {/* Navigation Breadcrumbs */}
        <nav className="breadcrumb-nav">
          <span className="breadcrumb">Home</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb">Skin Serum</span>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          <DeliveryEstimate />
        </main>
      </div>
    </RecoilRoot>
  );
}

export default App;
