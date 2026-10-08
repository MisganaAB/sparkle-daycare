export default function LoadingSpinner({ className = '' }) {
  return (
    <div className={`flex items-center justify-center py-16 ${className}`} role="status" aria-label="Loading">
      <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
    </div>
  );
}
