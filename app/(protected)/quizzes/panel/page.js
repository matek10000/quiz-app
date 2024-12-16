'use client';

import { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function QuizPanel() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true); // Sprawdzanie uprawnień użytkownika
  const [isAdmin, setIsAdmin] = useState(false); // Flaga dla uprawnień admina
  const router = useRouter();

  // Sprawdzenie, czy użytkownik jest adminem
  useEffect(() => {
    const checkAdminPermissions = async () => {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              if (userData.isAdmin) {
                setIsAdmin(true);
              } else {
                alert('Nie masz uprawnień administratora!');
                router.push('/');
              }
            } else {
              alert('Nie znaleziono danych użytkownika!');
              router.push('/');
            }
          } catch (error) {
            console.error('Błąd podczas sprawdzania uprawnień użytkownika:', error);
            alert('Wystąpił problem z dostępem.');
            router.push('/');
          } finally {
            setAuthLoading(false);
          }
        } else {
          alert('Musisz być zalogowany, aby uzyskać dostęp do tej strony.');
          router.push('/user/signin');
        }
      });
    };

    checkAdminPermissions();
  }, [router]);

  // Pobieranie danych quizów
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'quiz'));
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
    if (confirm('Czy na pewno chcesz usunąć ten quiz?')) {
      try {
        await deleteDoc(doc(db, 'quiz', quizId));
        setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId));
      } catch (error) {
        console.error('Błąd podczas usuwania quizu:', error);
      }
    }
  };

  // Ekran ładowania uprawnień
  if (authLoading) {
    return <p>Sprawdzanie uprawnień...</p>;
  }

  // Ekran braku uprawnień
  if (!isAdmin) {
    return <p>Brak uprawnień do dostępu do tej strony.</p>;
  }

  // Ekran ładowania quizów
  if (loading) return <p>Ładowanie quizów...</p>;

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
