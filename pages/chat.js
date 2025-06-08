import dynamic from 'next/dynamic';
export default dynamic(() => import('../components/ChatPage'), { ssr: false });
