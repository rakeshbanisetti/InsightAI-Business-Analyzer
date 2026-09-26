import React, { useState } from 'react';
import { Sparkles, Send, Bot, User } from 'lucide-react';

export default function DataChat({ rawData = [], columns = [], analytics = {} }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I'm your data analyst copilot. Ask me anything about trends, summaries, or specific records in this dataset."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    setTimeout(() => {
      let responseText = "Based on the dataset overview, everything looks consistent.";
      const lower = userMsg.toLowerCase();

      if (lower.includes('sales') || lower.includes('revenue')) {
        responseText = `The dataset contains ${rawData.length} sample rows loaded in preview. Total recorded numeric depth spans across columns like ${columns.slice(0, 3).join(', ')}.`;
      } else if (lower.includes('row') || lower.includes('count') || lower.includes('total')) {
        responseText = `There are approximately ${rawData.length} records currently previewed in this session with ${columns.length} active columns.`;
      } else {
        responseText = `Analyzing "${userMsg}": Across the parsed metrics, the primary categories found include ${columns.slice(0, 4).join(', ')}.`;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: responseText }]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="bg-white/95 border border-white/40 rounded-3xl p-6 shadow-2xl shadow-black/20 backdrop-blur-xl space-y-4">
      <div className="flex items-center space-x-2 text-indigo-600 font-bold text-base border-b border-slate-200 pb-3">
        <Sparkles className="h-5 w-5" />
        <span>Ask InsightAI About This Dataset</span>
      </div>

      <div className="h-64 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-xl bg-indigo-100 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs md:text-sm font-medium shadow-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center space-x-2 text-slate-500 text-xs italic">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
            <span>InsightAI is analyzing records...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex items-center space-x-2 pt-2 border-t border-slate-200">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your data trends or summaries..."
          className="flex-1 bg-slate-50 border border-slate-300 text-slate-800 text-xs md:text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium shadow-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl transition shadow-md flex items-center justify-center disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}