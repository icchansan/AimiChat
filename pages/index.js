import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push('/setup');
  }, []);
  return <div>Redirecting to setup...</div>;
}