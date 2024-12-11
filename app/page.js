'use client';

import { useAuth } from '@/app/lib/AuthContext';
import Link from 'next/link';

export default function HomePage() {
  const { user } = useAuth(); // Pobieranie informacji o zalogowanym użytkowniku

  if (user) {
    // Treść dla zalogowanych użytkowników
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl font-bold mb-6">Witaj z powrotem, {user.email}!</h1>
        <div className="flex gap-4">
        <Link
            href="/quizzes/panel"
            className="bg-red-600 text-white py-3 px-6 rounded hover:bg-red-700"
          >
            Edycja Quizów
          </Link>
          <Link
            href="/quizzes"
            className="bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700"
          >
            Rozwiąż Quiz!
          </Link>
          <Link
            href="/user/profile"
            className="bg-green-600 text-white py-3 px-6 rounded hover:bg-green-700"
          >
            Edycja profilu
          </Link>
        </div>
      </div>
    );
  }

  // Treść dla niezalogowanych użytkowników
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold mb-4">Witaj w QuizApp!</h1>
      <p className="text-lg text-gray-700 mb-6">
        Zaloguj się lub załóż konto, aby rozpocząć naukę!
      </p>
      <Link
        href="/user/register"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Zacznij już dziś!
      </Link>
    </div>
  );
}
