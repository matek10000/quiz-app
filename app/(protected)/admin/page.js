'use client';

import { useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '@/app/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const adminDoc = await getDoc(doc(db, 'admin', 'admin'));
      if (!adminDoc.exists()) {
        setError('Nie znaleziono konta administratora.');
        return;
      }

      const adminData = adminDoc.data();
      if (adminData.password !== password) {
        setError('Niepoprawne hasło administratora.');
        return;
      }

      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { isAdmin: true });
            alert('Uzyskano dostęp administratora!');
            router.push('/');
          } catch (error) {
            console.error('Błąd podczas aktualizacji użytkownika:', error);
            setError('Nie udało się zaktualizować uprawnień użytkownika.');
          }
        } else {
          setError('Nie jesteś zalogowany.');
        }
      });
    } catch (error) {
      console.error('Błąd podczas sprawdzania administratora:', error);
      setError('Błąd podczas uzyskiwania dostępu administratora.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Dostęp administratora</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
            Wpisz hasło administratora:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Sprawdzanie...' : 'Zaloguj jako admin'}
        </button>
      </form>
    </div>
  );
}
