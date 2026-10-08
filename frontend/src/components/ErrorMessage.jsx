export default function ErrorMessage({ message = 'Something went wrong. Please try again.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center" role="alert">
      <div className="text-4xl mb-3">⚠️</div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
}
