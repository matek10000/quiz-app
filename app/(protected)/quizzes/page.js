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
        const querySnapshot = await getDocs(collection(db, 'quizzes'));
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Wybierz Quiz</h1>

      {loading ? (
        <p>Ładowanie quizów...</p>
      ) : (
        <div className="flex flex-col gap-4">
          {quizzes.map((quiz) => (
            <button
              key={quiz.id}
              onClick={() => handleQuizStart(quiz.id)}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              {quiz.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
