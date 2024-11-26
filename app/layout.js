'use client';

import { AuthProvider } from './lib/AuthContext'; // Dodanie AuthProvider dla zarządzania autoryzacją
import { FaUser, FaSignInAlt, FaSignOutAlt, FaHome, FaUserEdit } from 'react-icons/fa';
import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className="h-screen">
          <div className="flex h-full">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
              <h2 className="text-lg font-bold mb-4">Menu Główne</h2>
              <nav className="flex flex-col gap-4">
                <Link href="/" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
                  <FaHome />
                  <span>Strona Główna</span>
                </Link>
                <Link href="/user/signin" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
                  <FaSignInAlt />
                  <span>Zaloguj się</span>
                </Link>
                <Link href="/user/register" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
                  <FaUser />
                  <span>Załóż konto</span>
                </Link>
                <Link href="/user/profile" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
                  <FaUserEdit />
                  <span>Profil</span>
                </Link>
                <Link href="/user/signout" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
                  <FaSignOutAlt />
                  <span>Wyloguj się</span>
                </Link>
              </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              {/* Top Bar */}
              <header className="bg-gray-100 border-b p-4 flex justify-between items-center">
                <h1 className="text-lg font-semibold">QuizApp</h1>
                <div className="space-x-4">
                  <Link href="/user/signin" className="text-blue-600 hover:underline">
                    Logowanie
                  </Link>
                  <Link href="/user/register" className="text-blue-600 hover:underline">
                    Rejestracja
                  </Link>
                </div>
              </header>

              {/* Main Content Area */}
              <main className="flex-1 overflow-y-auto p-6 bg-gray-50">{children}</main>

              {/* Footer */}
              <footer className="bg-gray-800 text-white text-center p-4">
                <p>&copy; 2024 QuizApp. All rights reserved.</p>
              </footer>
            </div>
          </div>
        </body>
      </html>
    </AuthProvider>
  );
}
