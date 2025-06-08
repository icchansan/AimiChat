import { useEffect, useState } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [profile, setProfile] = useState(null);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('aimiProfile_guest')) || {};
    setProfile(stored);
    setLevel(stored.level || 1);
    setXp(stored.xp || 0);
  }, []);

  const send = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages, encrypted: false })
    });
    const data = await res.json();
    const updated = [...newMessages, { from: 'aimi', text: data.reply }];
    setMessages(updated);

    const earnedXp = input.length > 20 ? 15 : 5;
    const totalXp = xp + earnedXp;
    const newLevel = Math.floor(totalXp / 100) + 1;
    const updatedProfile = { ...profile, xp: totalXp, level: newLevel };
    setXp(totalXp);
    setLevel(newLevel);
    setProfile(updatedProfile);
    localStorage.setItem('aimiProfile_guest', JSON.stringify(updatedProfile));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Level {level} | XP: {xp} / {level * 100}</h2>
      <div style={{ maxHeight: 300, overflowY: 'auto', margin: '1em 0' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.from === 'aimi' ? 'left' : 'right' }}>
            <div style={{
              display: 'inline-block',
              background: m.from === 'aimi' ? '#eee' : '#c5f',
              color: m.from === 'aimi' ? '#000' : '#fff',
              padding: 10,
              borderRadius: 10,
              margin: 5
            }}>{m.text}</div>
          </div>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} style={{ width: '80%' }} />
      <button onClick={send}>Send</button>
    </div>
  );
}