import React, { useState } from "react";

export default function SmartPayAssistant(){
  const [messages, setMessages] = useState([{role:'bot', text:'Hi — ask me about Cardano SmartPay, wallets, payments, or invoices! 👋'}]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  async function handleSend(){
    if(!input.trim()) return;
    const user = {role:'user', text: input};
    setMessages(m=>[...m, user]);
    const answer = "I'm here to help! For now, I can assist with general questions about the H.A.C.K Cardano payment system.";
    setMessages(m=>[...m, {role:'bot', text: answer}]);
    setInput('');
  }

  function toggleChat() {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  }

  function toggleMinimize() {
    setIsMinimized(!isMinimized);
  }

  if (!isOpen) {
    return (
      <div 
        className="chat-toggle-button"
        onClick={toggleChat}
      >
        💬
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className="chat-minimized" onClick={toggleMinimize}>
        <span>💬 SmartPay</span>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-title">SmartPay Assistant</div>
        <div className="chat-controls">
          <button className="chat-minimize-btn" onClick={toggleMinimize}>−</button>
          <button className="chat-close-btn" onClick={toggleChat}>×</button>
        </div>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div className="message-text">{msg.text}</div>
          </div>
        ))}
      </div>
      
      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button onClick={handleSend} className="chat-send-btn">Send</button>
      </div>
    </div>
  );
}
