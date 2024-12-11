'use client';

import { useState } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function AddQuiz() {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', option1: '', option2: '', option3: '', option4: '', correct: 1 },
    ]);
  };

  const handleUpdateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSaveQuiz = async () => {
    if (!title) {
      alert('Podaj tytuł quizu!');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'quizzes'), { title, questions });
      alert('Quiz został dodany!');
      router.push('/quizzes/panel'); // Przekierowanie do Panelu Quizzów
    } catch (error) {
      console.error('Błąd podczas dodawania quizu:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">Dodaj Quiz</h1>
      <div className="mb-4">
        <label className="block mb-2 text-gray-700">Tytuł Quizu</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="Podaj tytuł quizu"
        />
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Pytania</h2>
        {questions.map((q, index) => (
          <div key={index} className="mb-4 border rounded p-4">
            <input
              type="text"
              placeholder="Treść pytania"
              value={q.question}
              onChange={(e) => handleUpdateQuestion(index, 'question', e.target.value)}
              className="w-full border mb-2 p-2"
            />
            {['option1', 'option2', 'option3', 'option4'].map((option, i) => (
              <input
                key={option}
                type="text"
                placeholder={`Odpowiedź ${i + 1}`}
                value={q[option]}
                onChange={(e) => handleUpdateQuestion(index, option, e.target.value)}
                className="w-full border mb-2 p-2"
              />
            ))}
            <input
              type="number"
              min="1"
              max="4"
              value={q.correct}
              onChange={(e) => handleUpdateQuestion(index, 'correct', Number(e.target.value))}
              className="w-full border mb-2 p-2"
              placeholder="Poprawna odpowiedź (1-4)"
            />
            <button
              onClick={() => handleRemoveQuestion(index)}
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
            >
              Usuń pytanie
            </button>
          </div>
        ))}
        <button
          onClick={handleAddQuestion}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Dodaj pytanie
        </button>
      </div>
      <button
        onClick={handleSaveQuiz}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? 'Zapisywanie...' : 'Zapisz Quiz'}
      </button>
    </div>
  );
}
