'use client';

import { useAuth } from '@/app/lib/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">
        Witaj, {user?.email || 'użytkowniku'}!
      </h1>
      <div className="flex flex-col gap-4">
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-64">
          UTWÓRZ QUIZ
        </button>
        <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 w-64">
          EDYTUJ QUIZ
        </button>
        <button className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 w-64">
          LISTA QUIZÓW
        </button>
      </div>
    </div>
  );
}
