'use client';

import { useAuth } from "@/app/lib/AuthContext"; // Poprawiona ścieżka do AuthContext
import { useLayoutEffect } from "react";
import { redirect, usePathname } from 'next/navigation';

function ProtectedLayout({ children }) {
    const { user } = useAuth(); // Pobieramy obiekt użytkownika z kontekstu autoryzacji
    const returnUrl = usePathname(); // Aktualna ścieżka

    useLayoutEffect(() => {
        if (!user) {
            redirect(`/user/signin?returnUrl=${encodeURIComponent(returnUrl)}`);
        }
    }, [user, returnUrl]); // Dodajemy zależności do hooka

    return <>{children}</>;
}

export default ProtectedLayout;
