// src/components/Chatbot.js
import React, { useState } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?' },
  ]);
  const [input, setInput] = useState('');

  // Fonction pour envoyer le message à l'API Flask
  const sendMessageToFlask = async (message) => {
    try {
      const response = await fetch('http://localhost:5550/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      return data.message; // Retourne la réponse du serveur Flask
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message à Flask:', error);
      return 'Désolé, une erreur s\'est produite. Veuillez réessayer plus tard.'; // Message en cas d'erreur
    }
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');

    // Envoyer le message au serveur Flask et obtenir la réponse
    const botResponseText = await sendMessageToFlask(input);

    const botResponse = {
      sender: 'bot',
      text: botResponseText,
    };
    setMessages((prevMessages) => [...prevMessages, botResponse]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chatbot-container">
      <h2>Chatbot</h2>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder="Tapez votre message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSend}>Envoyer</button>
      </div>
    </div>
  );
};

export default Chatbot;
