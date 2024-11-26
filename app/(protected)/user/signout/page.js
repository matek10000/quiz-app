'use client';

import { signOut } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import { useRouter } from 'next/navigation';
import { FaSignOutAlt } from 'react-icons/fa';

export default function SignOutPage() {
  const router = useRouter();

  const onSubmit = async (event) => {
    event.preventDefault(); // Zapobiega odświeżeniu strony
    try {
      await signOut(auth); // Wylogowanie użytkownika
      router.push('/'); // Przekierowanie na stronę główną
    } catch (error) {
      console.error('Błąd podczas wylogowania:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center gap-4 p-6 bg-white shadow-md rounded-md"
      >
        <p className="text-lg font-semibold text-gray-800">
          Czy na pewno chcesz się wylogować?
        </p>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          <FaSignOutAlt />
          Wyloguj
        </button>
      </form>
    </div>
  );
}
