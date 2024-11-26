'use client';

import { useState } from 'react';
import { useAuth } from '@/app/lib/AuthContext';
import { updateProfile } from 'firebase/auth'; // Importujemy metodę do aktualizacji profilu

export default function ProfilePage() {
  const { user, setUser } = useAuth(); // Pobieramy użytkownika z contextu i metodę do ustawiania nowego użytkownika
  const [displayName, setDisplayName] = useState(user?.displayName || ''); // Stan dla displayName
  const [photoURL, setPhotoURL] = useState(user?.photoURL || ''); // Stan dla photoURL
  const [error, setError] = useState(''); // Stan błędów
  const [loading, setLoading] = useState(false); // Stan ładowania formularza

  // Obsługuje zdarzenie submit formularza
  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Ustawiamy stan ładowania

    // Wykonanie aktualizacji profilu
    updateProfile(user, {
      displayName: displayName,
      photoURL: photoURL,
    })
      .then(() => {
        // Po pomyślnej aktualizacji profilu, aktualizujemy użytkownika w kontekście
        setUser({ ...user, displayName, photoURL });
        console.log('Profile updated');
      })
      .catch((error) => {
        setError(error.message); // Ustawiamy błąd, jeśli wystąpił
      })
      .finally(() => {
        setLoading(false); // Resetujemy stan ładowania
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Mój profil</h1>
      
      {/* Warunkowe renderowanie zdjęcia profilowego */}
      {photoURL && (
        <div className="mb-6">
          <img
            src={photoURL}
            alt="Zdjęcie profilowe"
            className="w-24 h-24 rounded-full border-2 border-gray-300"
          />
        </div>
      )}
      
      {/* Wyświetlanie błędów, jeśli wystąpiły */}
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
            placeholder="Wprowadź nazwę wyświetlaną"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">Adres e-mail</label>
          <input
            type="email"
            id="email"
            value={user?.email || ''}
            disabled
            className="w-full border border-gray-300 rounded p-2 bg-gray-200 cursor-not-allowed"
            readOnly
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
            placeholder="Wprowadź URL zdjęcia profilowego"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Aktualizowanie...' : 'Zaktualizuj profil'}
        </button>
      </form>
    </div>
  );
}
