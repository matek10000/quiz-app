'use client';

import { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'quiz'));
        const quizzesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuizzes(quizzesData);
      } catch (error) {
        console.error('Błąd podczas pobierania quizów:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleQuizStart = (quizId) => {
    router.push(`/quizzes/${quizId}`);
  };

  const handleTop10 = (quizId) => {
    router.push(`/quizzes/top10/${quizId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Wybierz Quiz</h1>

      {loading ? (
        <p>Ładowanie quizów...</p>
      ) : quizzes.length > 0 ? (
        <div className="flex flex-col gap-4">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="flex items-center justify-between bg-gray-100 p-4 rounded">
              <span className="text-lg font-semibold">{quiz.title}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleQuizStart(quiz.id)}
                  className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
                >
                  Rozpocznij
                </button>
                <button
                  onClick={() => handleTop10(quiz.id)}
                  className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                >
                  Top 10
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Brak dostępnych quizów.</p>
      )}
    </div>
  );
}
