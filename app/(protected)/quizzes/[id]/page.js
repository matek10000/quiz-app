'use client';

import { useState, useEffect } from 'react';
import { db } from '@/app/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';

export default function QuizPage() {
  const params = useParams();
  const quizId = params?.id; // Identyfikator quizu z URL-a
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]); // Zaznaczone opcje
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // Pobieranie quizu z Firestore
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const docRef = doc(db, 'quiz', quizId); // Pobieramy dokument quizu z Firestore
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

  // Obsługa zaznaczenia opcji
  const handleOptionSelect = (optionKey) => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    
    if (currentQuestion.type === 'single') {
      // Pojedyncza odpowiedź - zaznaczamy tylko jedną opcję
      setSelectedOptions({ [currentQuestionIndex]: [optionKey] });
    } else if (currentQuestion.type === 'multi') {
      // Wiele odpowiedzi - możemy dodawać i usuwać odpowiedzi
      setSelectedOptions((prev) => {
        const selectedForQuestion = prev[currentQuestionIndex] || [];
        const isAlreadySelected = selectedForQuestion.includes(optionKey);

        // Dodaj lub usuń opcję z listy zaznaczonych
        const updatedSelections = isAlreadySelected 
          ? selectedForQuestion.filter((option) => option !== optionKey)
          : [...selectedForQuestion, optionKey];
        
        return {
          ...prev,
          [currentQuestionIndex]: updatedSelections,
        };
      });
    }
  };

  // Przejście do następnego pytania
  const handleNextQuestion = () => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const selectedForQuestion = selectedOptions[currentQuestionIndex] || [];
    
    // Obliczanie wyniku
    if (currentQuestion.type === 'single') {
      const selectedOption = currentQuestion.options[selectedForQuestion[0]];
      if (selectedOption?.isCorrect) {
        setScore((prevScore) => prevScore + 1);
      }
    } else if (currentQuestion.type === 'multi') {
      const correctOptions = Object.entries(currentQuestion.options)
        .filter(([key, option]) => option.isCorrect)
        .map(([key]) => key);
      
      // Porównanie wybranych opcji z poprawnymi
      if (
        selectedForQuestion.length === correctOptions.length &&
        selectedForQuestion.every((option) => correctOptions.includes(option))
      ) {
        setScore((prevScore) => prevScore + 1);
      }
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
  const selectedForCurrentQuestion = selectedOptions[currentQuestionIndex] || [];

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

          {/* Dodano informację o typie pytania */}
          <p className="text-sm text-gray-500 mb-4">
            {currentQuestion?.type === 'single' 
              ? 'Typ pytania: Wybór jednokrotny (możesz wybrać jedną odpowiedź)'
              : 'Typ pytania: Wybór wielokrotny (możesz wybrać wiele odpowiedzi)'}
          </p>

          <div className="flex flex-col gap-2">
            {currentQuestion?.options && Object.entries(currentQuestion.options).map(([key, option]) => (
              <button
                key={key}
                onClick={() => handleOptionSelect(key)}
                className={`py-2 px-4 rounded ${
                  selectedForCurrentQuestion.includes(key)
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-200'
                }`}
              >
                {option.content}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextQuestion}
            disabled={selectedForCurrentQuestion.length === 0}
            className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            {currentQuestionIndex < quiz.questions.length - 1 ? 'Następne pytanie' : 'Zakończ quiz'}
          </button>
        </div>
      )}
    </div>
  );
}
