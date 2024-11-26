"use client";

import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function VerifyEmail() {
  const [email, setEmail] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setEmail(currentUser.email); // Zapamiętanie adresu e-mail
    }

    // Automatyczne wylogowanie
    signOut(auth).then(() => {
      console.log("User signed out after registration.");
    }).catch((error) => {
      console.error("Error signing out:", error);
    });
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow text-center">
      <h1 className="text-2xl font-bold mb-4">Weryfikacja adresu e-mail</h1>
      <p className="text-gray-700">
        E-mail nie został jeszcze zweryfikowany. Prosimy sprawdzić swoją skrzynkę pocztową, gdzie został wysłany link weryfikacyjny. 
      </p>
      {email && (
        <p className="text-gray-800 font-semibold mt-4">
          Adres e-mail: {email}
        </p>
      )}
      <p className="text-gray-600 mt-4">
        Po weryfikacji zaloguj się ponownie, aby uzyskać dostęp do aplikacji.
      </p>
    </div>
  );
}
