'use client';

import { useState, useEffect } from 'react';
import { db } from '@/app/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';

export default function QuizPage() {
  const params = useParams();
  const quizId = params?.id;
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const docRef = doc(db, 'quiz', quizId);
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

  const handleOptionSelect = (optionKey) => {
    const currentQuestion = quiz.questions[currentQuestionIndex];

    if (currentQuestion.type === 'single') {
      setSelectedOptions({ ...selectedOptions, [currentQuestionIndex]: [optionKey] });
    } else if (currentQuestion.type === 'multi') {
      setSelectedOptions((prev) => {
        const selectedForQuestion = prev[currentQuestionIndex] || [];
        const isAlreadySelected = selectedForQuestion.includes(optionKey);

        const updatedSelections = isAlreadySelected
          ? selectedForQuestion.filter((option) => option !== optionKey)
          : [...selectedForQuestion, optionKey];

        return { ...prev, [currentQuestionIndex]: updatedSelections };
      });
    }
  };

  const handleFieldInput = (fieldKey, value) => {
    setSelectedOptions({
      ...selectedOptions,
      [currentQuestionIndex]: { ...selectedOptions[currentQuestionIndex], [fieldKey]: value },
    });
  };

  const handleNextQuestion = () => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const userAnswers = selectedOptions[currentQuestionIndex] || {};

    let isCorrect = false;

    if (currentQuestion.type === 'single') {
      const selectedOption = currentQuestion.options[userAnswers[0]];
      isCorrect = selectedOption?.isCorrect;
    } else if (currentQuestion.type === 'multi') {
      const correctOptions = Object.entries(currentQuestion.options)
        .filter(([_, option]) => option.isCorrect)
        .map(([key]) => key);

      isCorrect =
        userAnswers.length === correctOptions.length &&
        userAnswers.every((option) => correctOptions.includes(option));
    } else if (currentQuestion.type === 'fill') {
      const correctFields = currentQuestion.fields.reduce(
        (acc, field) => ({ ...acc, [field.label]: field.correct }),
        {}
      );

      isCorrect = Object.entries(correctFields).every(
        ([label, correctAnswer]) => userAnswers[label] === correctAnswer
      );
    }

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setFinished(true);
    }
  };

  if (!quiz) {
    return <p>Ładowanie quizu...</p>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const userAnswersForCurrentQuestion = selectedOptions[currentQuestionIndex] || {};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>

      {finished ? (
        <div>
          <p className="text-lg font-semibold">
            Twój wynik: {score} / {quiz.questions.length}
          </p>
          <button
            onClick={() => window.location.href = '/quizzes'}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Powrót do listy quizów
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold mb-2">
            {currentQuestion?.question || 'Pytanie niedostępne'}
          </h2>

          <p className="text-sm text-gray-500 mb-4">
            {currentQuestion?.type === 'single' && 'Typ pytania: Wybór jednokrotny'}
            {currentQuestion?.type === 'multi' && 'Typ pytania: Wybór wielokrotny'}
            {currentQuestion?.type === 'fill' && 'Typ pytania: Uzupełnianie pól'}
          </p>

          {/* Single i Multi */}
          {['single', 'multi'].includes(currentQuestion?.type) && (
            <div className="flex flex-col gap-2">
              {Object.entries(currentQuestion.options).map(([key, option]) => (
                <button
                  key={key}
                  onClick={() => handleOptionSelect(key)}
                  className={`py-2 px-4 rounded ${
                    userAnswersForCurrentQuestion.includes?.(key)
                      ? 'bg-blue-700 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {option.content}
                </button>
              ))}
            </div>
          )}

          {/* Fill */}
          {currentQuestion?.type === 'fill' && (
            <div className="flex flex-col gap-2">
              {currentQuestion.fields.map((field) => (
                <div key={field.label} className="flex items-center gap-2">
                  <label className="w-1/3">{field.label}:</label>
                  <input
                    type="text"
                    placeholder="Wpisz odpowiedź"
                    onChange={(e) => handleFieldInput(field.label, e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleNextQuestion}
            disabled={!userAnswersForCurrentQuestion || Object.keys(userAnswersForCurrentQuestion).length === 0}
            className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            {currentQuestionIndex < quiz.questions.length - 1 ? 'Następne pytanie' : 'Zakończ quiz'}
          </button>
        </div>
      )}
    </div>
  );
}
