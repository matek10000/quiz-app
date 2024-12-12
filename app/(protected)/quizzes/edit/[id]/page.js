'use client';

import { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter, useParams } from 'next/navigation';

export default function EditQuiz() {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const router = useRouter();
  const params = useParams();
  const quizId = params?.id;

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const docRef = doc(db, 'quiz', quizId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setQuiz(data);
          setTitle(data.title);
          setQuestions(data.questions || []);
        }
      } catch (error) {
        console.error('Błąd podczas pobierania quizu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'quiz', quizId);
      await setDoc(docRef, { title, questions });
      alert('Quiz zapisany!');
      router.push('/quizzes/panel');
    } catch (error) {
      console.error('Błąd podczas zapisywania quizu:', error);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', options: {}, type: 'single' }]);
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

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  if (loading) {
    return <p>Ładowanie quizu...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">Edytuj Quiz</h1>

      <div className="mb-4">
        <label className="block mb-2 text-gray-700">Tytuł Quizu</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded p-2"
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
            </select>

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

            <button
              onClick={() => handleRemoveQuestion(questionIndex)}
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
        onClick={handleSave}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Zapisz Quiz
      </button>
    </div>
  );
}