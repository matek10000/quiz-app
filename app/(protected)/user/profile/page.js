'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/lib/AuthContext';
import { updateProfile, reload } from 'firebase/auth';
import { db } from '@/app/lib/firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Pobranie danych adresowych użytkownika
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        if (user) {
          const snapshot = await getDoc(doc(db, 'users', user.uid));
          if (snapshot.exists()) {
            const address = snapshot.data().address || {};
            setStreet(address.street || '');
            setCity(address.city || '');
            setZipCode(address.zipCode || '');
          }
        }
      } catch (err) {
        console.error('Błąd podczas pobierania adresu:', err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchAddress();
  }, [user]);

  // Aktualizacja profilu użytkownika
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Aktualizacja danych w Firebase Authentication
      await updateProfile(user, {
        displayName,
        photoURL,
      });

      // Aktualizacja adresu użytkownika w Firestore (merge: true)
      await setDoc(
        doc(db, 'users', user.uid),
        {
          displayName,
          photoURL,
          address: {
            street,
            city,
            zipCode,
          },
        },
        { merge: true }
      );

      // Odświeżenie danych użytkownika
      await reload(user);

      // Aktualizacja kontekstu
      setUser({ ...user, displayName, photoURL });
      console.log('Profil zaktualizowany pomyślnie!');
    } catch (err) {
      setError(err.message);
      console.error('Błąd podczas aktualizacji profilu:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Mój profil</h1>

      {/* Podgląd zdjęcia profilowego */}
      {photoURL ? (
        <img
          src={photoURL}
          alt="Zdjęcie profilowe"
          className="w-24 h-24 rounded-full border-2 border-gray-300 mb-4"
        />
      ) : (
        <div className="w-24 h-24 bg-gray-300 rounded-full mb-4 flex items-center justify-center text-white text-2xl">
          <span>{displayName?.charAt(0) || '?'}</span>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-100 text-red-800 p-3 rounded">
          ⚠️ {error}
        </div>
      )}

      {/* Formularz edycji profilu */}
      <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <div className="mb-4">
          <label htmlFor="displayName" className="block text-gray-700 mb-2">
            Nazwa wyświetlana
          </label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
            disabled={isFetching}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="photoURL" className="block text-gray-700 mb-2">
            Adres zdjęcia profilowego
          </label>
          <input
            type="text"
            id="photoURL"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            disabled={isFetching}
          />
        </div>

        {/* Adres użytkownika */}
        <div className="mb-4">
          <label htmlFor="street" className="block text-gray-700 mb-2">Ulica</label>
          <input
            type="text"
            id="street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="w-full border rounded p-2"
            disabled={isFetching}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="city" className="block text-gray-700 mb-2">Miasto</label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border rounded p-2"
            disabled={isFetching}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="zipCode" className="block text-gray-700 mb-2">Kod pocztowy</label>
          <input
            type="text"
            id="zipCode"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="w-full border rounded p-2"
            disabled={isFetching}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading || isFetching}
        >
          {loading ? 'Aktualizowanie...' : 'Zaktualizuj profil'}
        </button>
      </form>
    </div>
  );
}
