export function Card({ children, className = '', ...props }) {
  return <div className={`rounded-2xl shadow p-4 bg-white dark:bg-zinc-800 ${className}`} {...props}>{children}</div>;
}