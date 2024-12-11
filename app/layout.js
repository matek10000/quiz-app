'use client';

import { AuthProvider } from './lib/AuthContext';
import SidebarMenu from '@/app/components/user/SidebarMenu'; // Import nowego komponentu
import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className="h-screen">
          <div className="flex h-full">
            {/* Sidebar */}
            <SidebarMenu /> {/* Dynamiczne menu w zależności od zalogowania */}

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              {/* Top Bar */}
              <header className="bg-gray-100 border-b p-4 flex justify-between items-center">
              <div className="space-x-4">
                <span className="text-lg font-semibold text-black">QuizApp</span>
                </div>
              </header>

              {/* Main Content Area */}
              <main className="flex-1 overflow-y-auto p-6 bg-gray-50 text-black">{children}</main>

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
