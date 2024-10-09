// src/components/Chatbot.js
import React, { useState } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');

    // Simuler une réponse du bot après 1 seconde
    setTimeout(() => {
      const botResponse = {
        sender: 'bot',
        text: getBotResponse(input),
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }, 1000);
  };

  const getBotResponse = (inputText) => {
    // Logique simple pour simuler des réponses
    const responses = [
      'Je suis là pour vous aider !',
      'Pouvez-vous préciser votre demande ?',
      'Merci de votre message. Nous reviendrons vers vous sous peu.',
      'C\'est intéressant ! Dites-m\'en plus.',
      'Je ne suis pas sûr de comprendre. Pouvez-vous reformuler ?',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
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
