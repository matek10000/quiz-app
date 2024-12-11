'use client';

import { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function EditQuiz({ params }) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const docRef = doc(db, 'quizzes', params.id);
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
  }, [params.id]);

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'quizzes', params.id);
      await setDoc(docRef, { title, questions });
      alert('Quiz zapisany!');
      router.push('/quizzes/panel');
    } catch (error) {
      console.error('Błąd podczas zapisywania quizu:', error);
    }
  };

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
        onClick={handleSave}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Zapisz Quiz
      </button>
    </div>
  );
}
