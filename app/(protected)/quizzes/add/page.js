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
    setQuestions([...questions, { question: '', options: {}, fields: [], type: 'single' }]);
  };

  const handleUpdateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleUpdateOption = (questionIndex, optionKey, field, value) => {
    const updatedQuestions = [...questions];
    if (!updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options = {};
    }
    if (!updatedQuestions[questionIndex].options[optionKey]) {
      updatedQuestions[questionIndex].options[optionKey] = { content: '', isCorrect: false };
    }
    updatedQuestions[questionIndex].options[optionKey][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleAddField = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].fields.push({ key: `field${Date.now()}`, label: '', correct: '' });
    setQuestions(updatedQuestions);
  };

  const handleUpdateField = (questionIndex, fieldIndex, fieldKey, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].fields[fieldIndex][fieldKey] = value;
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
      await addDoc(collection(db, 'quiz'), { title, questions });
      alert('Quiz został dodany!');
      router.push('/quizzes/panel');
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

        {questions.map((q, questionIndex) => (
          <div key={questionIndex} className="border p-4 rounded mb-4">
            <input
              type="text"
              placeholder="Treść pytania"
              value={q.question}
              onChange={(e) => handleUpdateQuestion(questionIndex, 'question', e.target.value)}
              className="w-full border mb-2 p-2"
            />

            <label className="block mb-2 text-gray-700">Typ pytania</label>
            <select
              value={q.type}
              onChange={(e) => handleUpdateQuestion(questionIndex, 'type', e.target.value)}
              className="w-full border mb-2 p-2"
            >
              <option value="single">Pojedynczy wybór</option>
              <option value="multi">Wielokrotny wybór</option>
              <option value="fill">Uzupełnianie pól</option>
            </select>

            {/* Opcje dla Single i Multi */}
            {q.type !== 'fill' && (
              <div>
                <h3 className="text-md font-bold mb-2">Odpowiedzi</h3>
                {['option1', 'option2', 'option3', 'option4'].map((optionKey, optionIndex) => (
                  <div key={optionKey} className="flex items-center mb-2">
                    <input
                      type="text"
                      placeholder={`Odpowiedź ${optionIndex + 1}`}
                      value={q.options?.[optionKey]?.content || ''}
                      onChange={(e) => handleUpdateOption(questionIndex, optionKey, 'content', e.target.value)}
                      className="w-full border p-2 mr-2"
                    />
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={q.options?.[optionKey]?.isCorrect || false}
                        onChange={(e) => handleUpdateOption(questionIndex, optionKey, 'isCorrect', e.target.checked)}
                        className="mr-2"
                      />
                      Poprawna
                    </label>
                  </div>
                ))}
              </div>
            )}

            {/* Pola dla typu Fill */}
            {q.type === 'fill' && (
              <div>
                <h3 className="text-md font-bold mb-2">Pola do uzupełnienia</h3>
                {q.fields.map((field, fieldIndex) => (
                  <div key={field.key} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Etykieta pola"
                      value={field.label}
                      onChange={(e) =>
                        handleUpdateField(questionIndex, fieldIndex, 'label', e.target.value)
                      }
                      className="w-full border p-2 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Poprawna odpowiedź"
                      value={field.correct}
                      onChange={(e) =>
                        handleUpdateField(questionIndex, fieldIndex, 'correct', e.target.value)
                      }
                      className="w-full border p-2 rounded"
                    />
                  </div>
                ))}
                <button
                  onClick={() => handleAddField(questionIndex)}
                  className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                >
                  Dodaj pole
                </button>
              </div>
            )}

            <button
              onClick={() => handleRemoveQuestion(questionIndex)}
              className="mt-4 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
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
