'use client';

import { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Link from 'next/link';

export default function QuizPanel() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'quizzes'));
        const fetchedQuizzes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuizzes(fetchedQuizzes);
      } catch (error) {
        console.error('Błąd podczas pobierania quizów:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleDeleteQuiz = async (quizId) => {
    if (
      confirm('Czy na pewno chcesz usunąć ten quiz?') &&
      confirm('Jesteś pewien? To usunie wszystkie pytania i odpowiedzi.')
    ) {
      try {
        await deleteDoc(doc(db, 'quizzes', quizId));
        setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId));
      } catch (error) {
        console.error('Błąd podczas usuwania quizu:', error);
      }
    }
  };

  if (loading) {
    return <p>Ładowanie quizów...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">Panel Quizzów</h1>
      <Link
        href="/quizzes/add"
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mb-4 inline-block"
      >
        Dodaj Quiz
      </Link>
      {quizzes.length === 0 ? (
        <p>Brak quizów. Dodaj pierwszy quiz!</p>
      ) : (
        <ul className="space-y-4">
          {quizzes.map((quiz) => (
            <li
              key={quiz.id}
              className="border p-4 rounded flex items-center justify-between"
            >
              <h2 className="text-lg font-bold">{quiz.title}</h2>
              <div className="space-x-4">
                <Link
                  href={`/quizzes/edit/${quiz.id}`}
                  className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                >
                  Edytuj
                </Link>
                <button
                  onClick={() => handleDeleteQuiz(quiz.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                >
                  Usuń
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
