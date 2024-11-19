'use client';

import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Importujemy funkcje Firebase do logowania
import { useRouter } from 'next/navigation'; // Importujemy useRouter do przekierowań

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // Dodajemy stan na błędy
  const router = useRouter(); // Hook do nawigacji po zalogowaniu

  const handleSignIn = async (e) => {
    e.preventDefault();
    const auth = getAuth(); // Pobieramy instancję Firebase Authentication

    try {
      await signInWithEmailAndPassword(auth, email, password); // Próbujemy zalogować się za pomocą emaila i hasła
      router.push('/protected/user/profile'); // Po zalogowaniu przekierowujemy na stronę profilu
    } catch (error) {
      setError(error.message); // Ustawiamy błąd, jeśli coś poszło nie tak
      console.error('Logowanie nie powiodło się:', error.message); // Konsola do debugowania
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSignIn} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Logowanie</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>} {/* Wyświetlanie błędów */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">E-mail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            placeholder="Wprowadź swój adres e-mail"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-2">Hasło</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            placeholder="Wprowadź swoje hasło"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Zaloguj się
        </button>
      </form>
    </div>
  );
}
