'use client';

import { useAuth } from '@/app/lib/AuthContext';

export default function UserMenu() {
  const { user } = useAuth(); // Pobieramy użytkownika z contextu

  return (
    <div className="flex items-center space-x-4">
      {/* Warunkowe renderowanie zdjęcia profilowego */}
      {user?.photoURL ? (
        <img
          src={user.photoURL}
          alt="Profilowe"
          className="w-12 h-12 rounded-full border-2 border-gray-300"
        />
      ) : (
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white">
          <span>{user?.displayName?.charAt(0)}</span>
        </div>
      )}

      <div className="text-gray-700">
        <p>{user?.displayName || 'Nieznany użytkownik'}</p>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>
    </div>
  );
}
