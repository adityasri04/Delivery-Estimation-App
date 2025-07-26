import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import HomeScreen from './HomeScreen';
import ProductDetail from './ProductDetail';
import './App.css';

function App() {
  return (
    <RecoilRoot>
      <Router>
        <div className="App">
          {/* Header */}
          <header className="app-header">
            <div className="header-content">
              <div className="header-left">
                <button className="menu-button">
                  <i className="fas fa-bars"></i>
                </button>
                <button className="search-button">
                  <i className="fas fa-search"></i>
                </button>
              </div>
              
              <div className="header-center">
                <h1 className="brand-name">Clinikally</h1>
              </div>
              
              <div className="header-right">
                <button className="user-button">
                  <i className="fas fa-user"></i>
                </button>
                <button className="cart-button">
                  <i className="fas fa-shopping-cart"></i>
                  <span className="cart-count">0</span>
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
            </Routes>
          </main>
        </div>
      </Router>
    </RecoilRoot>
  );
}

export default App;
