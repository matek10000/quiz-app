'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pobieranie danych z Firestore
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

  if (loading) {
    return <div className="text-center mt-10">Ładowanie quizów...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-4">Lista Quizów</h1>
      {quizzes.length === 0 ? (
        <p>Nie znaleziono żadnych quizów.</p>
      ) : (
        <div className="space-y-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="p-4 border border-gray-300 rounded shadow-md bg-white"
            >
              <h2 className="text-2xl font-semibold">{quiz.title}</h2>
              <p className="text-gray-600">{quiz.description}</p>
              <ul className="mt-4 space-y-2">
                {quiz.questions.map((question, index) => (
                  <li key={index} className="border-t pt-2">
                    <p className="font-medium">Pytanie {index + 1}: {question.question}</p>
                    <ol className="list-decimal ml-6 space-y-1">
                      <li>Odpowiedź 1: {question.option1}</li>
                      <li>Odpowiedź 2: {question.option2}</li>
                      <li>Odpowiedź 3: {question.option3}</li>
                      <li>Odpowiedź 4: {question.option4}</li>
                    </ol>
                    <p className="text-green-600">
                      Poprawna odpowiedź: Odpowiedź {question.correct}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
