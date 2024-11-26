'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/AuthContext'; // Jeśli masz dostęp do contextu auth
import { FaExclamationCircle } from 'react-icons/fa'; // Ikona do błędów
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeoutError, setTimeoutError] = useState('');
  const { user } = useAuth(); // Pobieramy użytkownika z contextu autoryzacji
  const router = useRouter();

  // Sprawdzamy, czy użytkownik jest już zalogowany
  useEffect(() => {
    if (user) {
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get('returnUrl') || '/user/profile'; // Przekierowanie na stronę profilu
      router.push(returnUrl); // Jeśli użytkownik jest zalogowany, przekierowujemy go do returnUrl
    }
  }, [user, router]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Resetujemy błędy
    setTimeoutError(''); // Resetujemy komunikat o opóźnieniu

    try {
      // Wykonanie logowania z Firebase
      const auth = await signInWithEmailAndPassword(getAuth(), email, password);

      // Sprawdzanie, czy użytkownik potwierdził adres e-mail
      if (!auth.user.emailVerified) {
        // Jeśli email nie jest zweryfikowany, odswiezy strone (nie wiem czemu nie ma komunikatu)
        setTimeoutError('Za chwilę nastąpi odświeżenie strony...');
        setError('Proszę potwierdzić swój adres e-mail. Sprawdź skrzynkę pocztową.');
        
        await getAuth().signOut();
        return;
      }

      // Pobiera returnUrl z URL (jeśli istnieje)
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get('returnUrl') || '/'; // Póki co przekierowanie na stronę główną

      router.push(returnUrl); // Przekierowujemy użytkownika na returnUrl lub główną stronę
    } catch (error) {
      // Jeśli logowanie się nie powiedzie, ustawiamy błąd
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSignIn} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Logowanie</h2>
        
        {/* Wyświetlanie błędu, jeśli jest */}
        {error && (
          <div className="mb-4 bg-red-100 text-red-800 p-3 rounded flex items-center">
            <FaExclamationCircle className="mr-2" />
            {error}
          </div>
        )}
        
        {/* Wyświetlanie komunikatu o opóźnieniu */}
        {timeoutError && (
          <div className="mb-4 bg-yellow-100 text-yellow-800 p-3 rounded flex items-center">
            <FaExclamationCircle className="mr-2" />
            {timeoutError}
          </div>
        )}

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
          disabled={loading}
        >
          {loading ? 'Logowanie...' : 'Zaloguj się'}
        </button>
      </form>
    </div>
  );
}
