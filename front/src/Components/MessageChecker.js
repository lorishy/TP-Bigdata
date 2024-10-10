// src/components/MessageChecker.js
import React, { useState } from 'react';
import './MessageChecker.css';

const MessageChecker = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);

  const sendMessageToFlask = async (message) => {
    console.log('Message envoyé au backend Flask:', message);
    try {
      const response = await fetch('http://localhost:5550/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      console.log('Données JSON reçues de Flask:', data);

      return data.message;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message à Flask:', error);
      return 'Désolé, une erreur s\'est produite. Veuillez réessayer plus tard.';
    }
  };

  const handleCheck = async () => {
    if (input.trim() === '') return;

    console.log('Message à vérifier :', input);

    // Envoyer le message à Flask et obtenir la réponse
    const flaskResponse = await sendMessageToFlask(input);
    console.log('Réponse du serveur Flask :', flaskResponse);

    const analysis = analyzeMessage(input);
    console.log('Résultat de l\'analyse :', analysis);

    setResult({ ...analysis, serverResponse: flaskResponse });
    setInput('');
  };

  const analyzeMessage = (message) => {
    const inappropriateWords = ['insulte', 'racisme', 'violence']; // Liste de mots inappropriés
    let appropriateness = 'Approprié';
    let type = 'Aucun';

    inappropriateWords.forEach((word) => {
      if (message.toLowerCase().includes(word)) {
        console.log(`Mot inapproprié trouvé : ${word}`);
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
          <p>Réponse du serveur Flask : {result.serverResponse}</p> {/* Affiche la réponse du backend */}
        </div>
      )}
    </div>
  );
};

export default MessageChecker;
