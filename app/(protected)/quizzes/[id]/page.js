'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/app/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation'; // Użycie useParams dla poprawnej obsługi params

export default function QuizPage() {
  const params = useParams(); // Pobierz params
  const quizId = params?.id; // Wyciągnij ID quizu
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const docRef = doc(db, 'quizzes', quizId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setQuiz(docSnap.data());
        } else {
          console.error('Quiz nie znaleziony');
        }
      } catch (error) {
        console.error('Błąd podczas pobierania quizu:', error);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  const handleNextQuestion = () => {
    if (selectedOption === quiz.questions[currentQuestionIndex].correct) {
      setScore(score + 1);
    }

    setSelectedOption(null);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setFinished(true);
    }
  };

  if (!quiz) {
    return <p>Ładowanie quizu...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>

      {finished ? (
        <div>
          <p className="text-lg font-semibold">Twój wynik: {score} / {quiz.questions.length}</p>
          <button
            onClick={() => window.location.href = '/quizzes'}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Powrót do listy quizów
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            {quiz.questions[currentQuestionIndex].question}
          </h2>
          <div className="flex flex-col gap-2">
            {['option1', 'option2', 'option3', 'option4'].map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(index + 1)}
                className={`py-2 px-4 rounded ${
                  selectedOption === index + 1 ? 'bg-blue-700 text-white' : 'bg-gray-200'
                }`}
              >
                {quiz.questions[currentQuestionIndex][option]}
              </button>
            ))}
          </div>
          <button
            onClick={handleNextQuestion}
            disabled={selectedOption === null}
            className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            {currentQuestionIndex < quiz.questions.length - 1 ? 'Następne pytanie' : 'Zakończ quiz'}
          </button>
        </div>
      )}
    </div>
  );
}
