'use client'

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

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        if (user) {
          const snapshot = await getDoc(doc(db, 'users', user?.uid));
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

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Aktualizacja profilu użytkownika
      await updateProfile(user, {
        displayName,
        photoURL,
      });

      // Zapis danych adresowych do Firestore
      await setDoc(doc(db, 'users', user.uid), {
        address: {
          street,
          city,
          zipCode,
        },
      });

      // Odświeżenie danych użytkownika
      await reload(user);

      // Zaktualizowanie użytkownika w kontekście
      setUser({ ...user, displayName, photoURL });
      console.log('Profil zaktualizowany pomyślnie');
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
      {photoURL && (
        <div className="mb-6">
          <img
            src={photoURL}
            alt="Zdjęcie profilowe"
            className="w-24 h-24 rounded-full border-2 border-gray-300"
          />
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-100 text-red-800 p-3 rounded flex items-center">
          <span className="mr-2">⚠️</span>
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <div className="mb-4">
          <label htmlFor="displayName" className="block text-gray-700 mb-2">Nazwa wyświetlana</label>
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
          <label htmlFor="photoURL" className="block text-gray-700 mb-2">Adres zdjęcia profilowego</label>
          <input
            type="text"
            id="photoURL"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            disabled={isFetching}
          />
        </div>

        {/* Pola adresowe */}
        <div className="mb-4">
          <label htmlFor="street" className="block text-gray-700 mb-2">Ulica</label>
          <input
            type="text"
            id="street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
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
            className="w-full border border-gray-300 rounded p-2"
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
            className="w-full border border-gray-300 rounded p-2"
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
