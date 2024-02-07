import React, { useEffect, useState } from 'react';
import './App.css';
import Login from './screens/login';
import { getToken } from 'api';
import Dashboard from 'screens/dashboard';
import { Route, Routes } from 'react-router-dom';

function App() {
  const [isLoggedIn, setLoggedIn] = useState<boolean | null>(null);
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await getToken();
        if (token) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    
    <div className="app">
    <header className="app-header">
      <h1>TradingSystem</h1>
    </header>
    <main className="app-main">
    <Routes>
          <Route
            path="*"
            element={isLoggedIn ? <Dashboard /> : <Login />}
          />
        </Routes>
    </main>
  </div>
  )
}

export default App;
