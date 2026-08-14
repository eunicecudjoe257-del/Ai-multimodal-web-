import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Bot, Paperclip, Send, Settings, X, Image as ImageIcon, FileText, Menu, Sun, Moon } from 'lucide-react';
import { Plan, AIProvider, Message } from './types';
import { motion, AnimatePresence } from 'motion/react';

const providers: AIProvider[] = [
  { id: 'grok', name: 'Grok', plans: ['Free', 'Go', 'Pro'] },
  { id: 'gemini', name: 'Gemini', plans: ['Free', 'Go', 'Pro'] },
  { id: 'openai', name: 'OpenAI', plans: ['Free', 'Go', 'Pro'] },
  { id: 'meta', name: 'Meta', plans: ['Free', 'Go', 'Pro'] },
];

export default function App() {
  const [provider, setProvider] = useState<AIProvider>(providers[0]);
  const [plan, setPlan] = useState<Plan>('Free');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const sendMessage = async () => {
    if (!input.trim() && attachments.length === 0) return;

    const newMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');

    const formData = new FormData();
    formData.append('provider', provider.id);
    formData.append('plan', plan);
    formData.append('message', input);
    attachments.forEach(file => formData.append('attachments', file));

    setAttachments([]);

    try {
      const response = await fetch('/api/chat', { method: 'POST', body: formData });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: data.response }]);
    } catch (e: any) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'system', content: `Error: ${e.message}` }]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  return (
    <div className={`flex h-screen bg-[var(--background)] text-[var(--foreground)]`}>
      <AnimatePresence mode='wait'>
        {isSidebarOpen && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-r border-[var(--border)] bg-[var(--sidebar)] flex flex-col"
          >
            <div className="p-4 border-b border-[var(--border)] font-semibold flex items-center justify-between">
              <span className="flex items-center gap-2"><Bot size={20}/> Providers</span>
              <button onClick={() => setIsSidebarOpen(false)}><X size={18}/></button>
            </div>
            {providers.map(p => (
              <button key={p.id} onClick={() => { setProvider(p); setPlan(p.plans[0] as Plan); }} className={`p-4 w-full text-left font-medium ${provider.id === p.id ? 'bg-[var(--border)]' : 'hover:bg-[var(--border)]'}`}>
                {p.name}
              </button>
            ))}
          </motion.aside>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-[var(--border)] flex items-center justify-between px-4 bg-[var(--background)]">
          <div className='flex items-center gap-4'>
            {!isSidebarOpen && <button onClick={() => setIsSidebarOpen(true)}><Menu size={20}/></button>}
            <h1 className='font-bold text-lg'>{provider.name}</h1>
          </div>
          <div className="flex bg-[var(--sidebar)] p-1 rounded-full border border-[var(--border)]">
            {provider.plans.map(p => (
              <button key={p} onClick={() => setPlan(p as Plan)} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${plan === p ? 'bg-[var(--foreground)] text-[var(--background)]' : 'text-gray-500 hover:text-[var(--foreground)]'}`}>
                {p.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)}>{isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}</button>
        </header>

        {isSettingsOpen && (
          <div className="bg-white border-b p-4 text-sm text-gray-600">
            <h3 className="font-semibold mb-2">Settings</h3>
            <p>API keys and advanced configuration will appear here.</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map(m => (
            <div key={m.id} className={`p-4 rounded-2xl max-w-3xl ${m.role === 'user' ? 'bg-[var(--color-primary)] text-white ml-auto' : 'bg-[var(--sidebar)] border border-[var(--border)]'}`}>
              {m.content}
            </div>
          ))}
        </div>

        <footer className="p-4 bg-[var(--background)]">
          <div className="max-w-4xl mx-auto border border-[var(--border)] rounded-2xl p-2 bg-[var(--sidebar)] focus-within:ring-2 ring-[var(--color-primary)]/20">
            <textarea
              className="w-full bg-transparent outline-none p-2 resize-none"
              placeholder="Message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            />
            <div className="flex justify-between items-center p-2">
              <button className="text-gray-500 hover:text-[var(--foreground)]"><Paperclip size={20} /></button>
              <button onClick={sendMessage} className="bg-[var(--color-primary)] text-white p-2 rounded-xl hover:bg-blue-700"><Send size={18} /></button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
