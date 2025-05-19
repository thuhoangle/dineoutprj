'use client';

export default function Error() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4 text-red-600">Error</h1>
        <p className="text-lg mb-6 text-gray-600">Something went wrong</p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
}
