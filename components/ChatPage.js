import { useEffect, useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [profile, setProfile] = useState(null);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [theme, setTheme] = useState('cafe');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('aimiProfile_guest')) || {};
    setProfile(stored);
    setLevel(stored.level || 1);
    setXp(stored.xp || 0);
    setTheme(stored.theme || 'cafe');
  }, []);

  const send = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-personality': JSON.stringify(profile?.personality || 'sweet')
        },
        body: JSON.stringify({ messages: newMessages, encrypted: false })
      });
      const data = await res.json();
      const updated = [...newMessages, { from: 'aimi', text: data.reply }];
      setMessages(updated);

      // Voice reply
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(data.reply);
        utterance.voice = speechSynthesis.getVoices().find(v => v.name.includes('Female') || v.lang.includes('en'));
        utterance.pitch = 1.2;
        utterance.rate = 1;
        speechSynthesis.speak(utterance);
      }

      const earnedXp = input.length > 20 ? 15 : 5;
      const totalXp = xp + earnedXp;
      const newLevel = Math.floor(totalXp / 100) + 1;
      const updatedProfile = { ...profile, xp: totalXp, level: newLevel };
      setXp(totalXp);
      setLevel(newLevel);
      setProfile(updatedProfile);
      localStorage.setItem('aimiProfile_guest', JSON.stringify(updatedProfile));
    } catch (error) {
      const fallback = [...newMessages, { from: 'aimi', text: "Oops! Aimi is having trouble thinking..." }];
      setMessages(fallback);
    }
  };

  const themeStyles = {
    cafe: {
      backgroundImage: "url('https://i.imgur.com/yY6XDd9.jpg')",
      backgroundSize: 'cover',
    },
    nightbar: {
      backgroundImage: "url('https://i.imgur.com/B7Yz1Bv.jpg')",
      backgroundSize: 'cover',
    },
    highschool: {
      backgroundImage: "url('https://i.imgur.com/NCKm8Zo.jpg')",
      backgroundSize: 'cover',
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: 20,
      ...themeStyles[theme],
      color: '#fff',
      backdropFilter: 'brightness(0.8)',
    }}>
      <h2 style={{ textShadow: '1px 1px 3px black' }}>Level {level} | XP: {xp} / {level * 100}</h2>
      <div style={{
        maxHeight: 300,
        overflowY: 'auto',
        background: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.from === 'aimi' ? 'left' : 'right' }}>
            <div style={{
              display: 'inline-block',
              background: m.from === 'aimi' ? 'rgba(255,255,255,0.8)' : 'rgba(200,100,255,0.8)',
              color: '#000',
              padding: 10,
              borderRadius: 10,
              margin: 5,
              maxWidth: '80%',
              backdropFilter: 'blur(4px)',
            }}>{m.text}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 10,
            border: '1px solid #ccc',
            fontSize: 16
          }}
        />
        <button onClick={send} style={{
          padding: '10px 20px',
          borderRadius: 10,
          background: '#ff69b4',
          color: '#fff',
          fontWeight: 'bold',
          border: 'none'
        }}>Send</button>
      </div>
    </div>
  );
}