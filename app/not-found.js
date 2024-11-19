'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">Strona nie znaleziona</h1>
        <p className="mt-4 text-lg text-gray-600">Nie mogliśmy znaleźć żądanej strony.</p>
        <Link href="/" className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Wróć do strony głównej
        </Link>
      </div>
    </div>
  );
}
