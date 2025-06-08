export function Button({ children, variant = 'default', ...props }) {
  const base = 'px-4 py-2 rounded font-medium';
  const style = variant === 'outline' ? 'border border-gray-500' : 'bg-pink-500 text-white';
  return <button {...props} className={`${base} ${style}`} >{children}</button>;
}