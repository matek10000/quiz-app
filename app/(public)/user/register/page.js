'use client';

import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { useAuth } from '@/app/lib/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/app/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterForm() {
  const { user } = useAuth();
  const router = useRouter();
  const auth = getAuth();

  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [registerError, setRegisterError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return null; // Użytkownik zalogowany, ukryj formularz

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setRegisterError('Hasła nie są takie same!');
      return;
    }

    setLoading(true);
    setRegisterError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const newUser = userCredential.user;

      // Dodanie domyślnych danych użytkownika do Firestore
      await setDoc(doc(db, 'users', newUser.uid), {
        email: formData.email,
        isAdmin: false, // Domyślnie nowy użytkownik nie jest adminem
      });

      await sendEmailVerification(newUser);
      await signOut(auth); // Automatyczne wylogowanie
      router.push('/user/verify');
    } catch (error) {
      setRegisterError(error.message);
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Rejestracja</h1>
      {registerError && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{registerError}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Adres email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border p-2 mb-4 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Hasło"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full border p-2 mb-4 rounded"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Potwierdź hasło"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="w-full border p-2 mb-4 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
        >
          {loading ? 'Rejestrowanie...' : 'Zarejestruj'}
        </button>
      </form>
    </div>
  );
}
