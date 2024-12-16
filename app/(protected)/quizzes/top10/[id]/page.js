'use client';

import { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, query, where, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';

export default function Top10() {
  const params = useParams();
  const quizId = params?.id; // ID quizu przekazane w ścieżce URL
  const [topScores, setTopScores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pobierz top 10 wyników z Firestore i połącz je z danymi z Firestore (users)
  useEffect(() => {
    const fetchTopScores = async () => {
      try {
        const scoresRef = collection(db, 'scores');
        const q = query(scoresRef, where('quizId', '==', quizId), orderBy('score', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);

        const scoresData = await Promise.all(
          querySnapshot.docs.map(async (scoreDoc, index) => {
            const scoreData = scoreDoc.data();
            
            // Pobieranie danych o użytkowniku z kolekcji 'users' na podstawie userId (UID)
            let userData = { displayName: 'Nieznany użytkownik', photoURL: null };
            try {
              const userDocRef = doc(db, 'users', scoreData.userId);
              const userDocSnap = await getDoc(userDocRef);
              if (userDocSnap.exists()) {
                userData = userDocSnap.data();
              }
            } catch (error) {
              console.error(`Błąd podczas pobierania danych użytkownika UID: ${scoreData.userId}`, error);
            }

            return {
              id: scoreDoc.id,
              rank: index + 1, // Numer pozycji w Top10
              nickname: userData.displayName,
              photoURL: userData.photoURL,
              ...scoreData,
            };
          })
        );

        setTopScores(scoresData);
      } catch (error) {
        console.error('Błąd podczas pobierania wyników:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopScores();
  }, [quizId]);

  if (loading) {
    return <p>Ładowanie wyników...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-6 text-center">Top 10 Wyników</h1>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b py-2">#</th>
            <th className="border-b py-2">Gracz</th>
            <th className="border-b py-2">Wynik</th>
          </tr>
        </thead>
        <tbody>
          {topScores.map((score, index) => (
            <tr
              key={score.id}
              className={`py-4 ${
                index === 0
                  ? 'font-bold text-yellow-500'
                  : index === 1
                  ? 'font-bold text-gray-600'
                  : index === 2
                  ? 'font-bold text-orange-400'
                  : ''
              }`}
            >
              <td className="py-4 text-center">{score.rank}</td>
              <td className="py-4 flex items-center space-x-3">
                {score.photoURL ? (
                  <img
                    src={score.photoURL}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full border-2 border-gray-300"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span>{score.nickname?.charAt(0).toUpperCase() || 'U'}</span>
                  </div>
                )}
                <span>{score.nickname || 'Nieznany użytkownik'}</span>
              </td>
              <td className="py-4 text-center">{score.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
