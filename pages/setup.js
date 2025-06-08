import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const outfits = ['default', 'school', 'cafe', 'night', 'special_rare'];
const personalities = ['sweet', 'genki', 'oneesan', 'shy'];
const backgrounds = ['cafe', 'bar', 'school'];

export default function Setup() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [personality, setPersonality] = useState('sweet');
  const [outfit, setOutfit] = useState('default');
  const [background, setBackground] = useState('cafe');
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('aimiProfile_guest')) || {};
    setNickname(profile.nickname || '');
    setPersonality(profile.personality || 'sweet');
    setOutfit(profile.outfit || 'default');
    setBackground(profile.background || 'cafe');
    setLevel(profile.level || 1);
  }, []);

  const saveSettings = () => {
    const profile = {
      nickname,
      personality,
      outfit,
      background,
      level,
    };
    localStorage.setItem('aimiProfile_guest', JSON.stringify(profile));
    router.push('/chat');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>👩‍🎤 Customize Your Chat</h1>

      <label>Nickname: {level >= 6 ? '' : '(unlocks at level 6)'}</label>
      {level >= 6 && (
        <input value={nickname} onChange={(e) => setNickname(e.target.value)} />
      )}

      <h2>Personality</h2>
      <select value={personality} onChange={(e) => setPersonality(e.target.value)}>
        {personalities.map(p => (
          <option key={p} value={p} disabled={level < unlockLevelForPersonality(p)}>
            {p} {level < unlockLevelForPersonality(p) ? `(level ${unlockLevelForPersonality(p)})` : ''}
          </option>
        ))}
      </select>

      <h2>Outfit</h2>
      <select value={outfit} onChange={(e) => setOutfit(e.target.value)}>
        {outfits.map(o => (
          <option key={o} value={o} disabled={level < unlockLevelForOutfit(o)}>
            {o} {level < unlockLevelForOutfit(o) ? `(level ${unlockLevelForOutfit(o)})` : ''}
          </option>
        ))}
      </select>

      <h2>Background</h2>
      <select value={background} onChange={(e) => setBackground(e.target.value)}>
        {backgrounds.map(bg => <option key={bg} value={bg}>{bg}</option>)}
      </select>

      <button onClick={saveSettings} style={{ marginTop: 20 }}>Start Chat</button>
    </div>
  );
}

function unlockLevelForPersonality(p) {
  return { sweet: 1, genki: 3, oneesan: 4, shy: 6 }[p] || 1;
}

function unlockLevelForOutfit(o) {
  return { default: 1, school: 2, cafe: 5, night: 7, special_rare: 15 }[o] || 1;
}