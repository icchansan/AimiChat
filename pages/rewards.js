import { useEffect, useState } from 'react';

const allBadges = [
  { id: 'talkative', name: 'Talkative 💬', condition: (profile) => profile.xp >= 100 },
  { id: 'socialite', name: 'Socialite 🌟', condition: (profile) => profile.level >= 5 },
  { id: 'stylist', name: 'Stylist 👗', condition: (profile) => profile.outfit !== 'default' },
  { id: 'nightowl', name: 'Night Owl 🌙', condition: (profile) => profile.background === 'bar' },
];

export default function Rewards() {
  const [profile, setProfile] = useState({});
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('aimiProfile_guest')) || {};
    setProfile(stored);
    const earned = allBadges.filter(b => b.condition(stored));
    setBadges(earned.map(b => b.name));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>🏅 Your Badges</h1>
      {badges.length === 0 ? (
        <p>No badges yet. Keep chatting!</p>
      ) : (
        <ul>
          {badges.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      )}
    </div>
  );
}