// src/App.js
import React from 'react';
import './App.css';
import Home from './Components/Home';
import MessageChecker from './Components/MessageChecker';

function App() {
  return (
    <div className="App">
      <header className="header">
        <h1>Bienvenue sur Notre Application de Chat</h1>
      </header>
      <main className="main-content">
        <Home />
        <MessageChecker />
      </main>
      <footer className="footer">
        <p>&copy; 2024 IPSSI. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

export default App;
