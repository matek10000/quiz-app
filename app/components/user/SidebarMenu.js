'use client';

import { useAuth } from '@/app/lib/AuthContext'; // Hook do zarządzania stanem użytkownika
import { FaUser, FaSignInAlt, FaSignOutAlt, FaHome, FaUserEdit, FaList } from 'react-icons/fa';
import Link from 'next/link';

export default function SidebarMenu() {
  const { user } = useAuth(); // pobranie info o userze

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
      <h2 className="text-lg font-bold mb-4">Menu Główne</h2>
      <nav className="flex flex-col gap-4">
        <Link href="/" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
          <FaHome />
          <span>Strona Główna</span>
        </Link>
        {user ? (
          <>
            {/* Menu dla zalogowanych użytkowników */}
            <Link href="/user/profile" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
              <FaUserEdit />
              <span>Profil</span>
            </Link>
            <Link href="/quizzes" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
              <FaList />
              <span>Lista quizów</span>
            </Link>
            <Link href="/user/signout" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
              <FaSignOutAlt />
              <span>Wyloguj się</span>
            </Link>
          </>
        ) : (
          <>
            {/* Menu dla niezalogowanych użytkowników */}
            <Link href="/user/signin" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
              <FaSignInAlt />
              <span>Zaloguj się</span>
            </Link>
            <Link href="/user/register" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
              <FaUser />
              <span>Załóż konto</span>
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
