// src/components/MessageChecker.js
import React, { useState } from 'react';
import './MessageChecker.css';

const MessageChecker = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);

  const handleCheck = () => {
    if (input.trim() === '') return;

    const analysis = analyzeMessage(input);
    setResult(analysis);
    setInput('');
  };

  const analyzeMessage = (message) => {
    const inappropriateWords = ['insulte', 'racisme', 'violence']; // Liste de mots inappropriés
    let appropriateness = 'Approprié';
    let type = 'Aucun';

    inappropriateWords.forEach((word) => {
      if (message.toLowerCase().includes(word)) {
        appropriateness = 'Inapproprié';
        type = `Contient : ${word}`;
      }
    });

    return { appropriateness, type };
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCheck();
    }
  };

  return (
    <div className="checker-container">
      <h2>Vérificateur de message</h2>
      <div className="input-area">
        <input
          type="text"
          placeholder="Entrez votre message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleCheck}>Vérifier</button>
      </div>
      {result && (
        <div className={`result ${result.appropriateness === 'Inapproprié' ? 'inappropriate' : 'appropriate'}`}>
          <p>Résultat : {result.appropriateness}</p>
          {result.type !== 'Aucun' && <p>Type d'inapproprié : {result.type}</p>}
        </div>
      )}
    </div>
  );
};

export default MessageChecker;
