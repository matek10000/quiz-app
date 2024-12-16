
# QuizApp

QuizApp to interaktywna aplikacja webowa zbudowana w frameworku **Next.js**, wykorzystująca **Firebase** do autoryzacji użytkowników oraz **Tailwind CSS** do stylizacji. Aplikacja oferuje rozbudowany system zarządzania quizami, w tym ich dodawanie, edytowanie, usuwanie oraz rozwiązywanie. Posiada system użytkowników z rejestracją, logowaniem oraz indywidualnymi profilami.

---

## 🚀 **Funkcjonalności**

### 🔹 **Użytkownik**
- **Rejestracja** użytkownika na podstawie e-maila i hasła.
- **Logowanie** użytkownika z weryfikacją adresu e-mail.
- **Profil użytkownika**: edycja danych użytkownika, w tym nazwa wyświetlana i zdjęcie profilowe.
- **Zarządzanie danymi użytkownika**: dane użytkownika są przechowywane w bazie Firestore w kolekcji `users`.

### 🔹 **Quizy**
- **Dodawanie quizów**: administrator może dodawać nowe quizy.
- **Edycja quizów**: możliwość edycji pytań i odpowiedzi.
- **Rodzaje pytań**:
  - **Pojedynczy wybór (Single Choice)**
  - **Wielokrotny wybór (Multiple Choice)**
- **Rozwiązywanie quizów**: użytkownik może rozwiązywać quizy z natychmiastową informacją zwrotną o wyniku.
- **Panel quizów**: dostęp do listy wszystkich quizów, ich edycji i usuwania.

### 🔹 **Bezpieczeństwo**
- Ochrona dostępu do niektórych stron i funkcji tylko dla zalogowanych użytkowników.
- Reguły Firestore ograniczające dostęp do bazy danych.

### 🔹 **Inne**
- **System nawigacji** z menu bocznym oraz linkami do sekcji dla zalogowanych i niezalogowanych użytkowników.
- **Responsywność**: dostosowanie układu do różnych rozdzielczości.
- **Obsługa błędów** (np. brak strony - 404).

---

## 📦 **Wymagania**
- **Node.js** (wersja >= 16)
- **npm** (lub yarn)

---

## ⚙️ **Instalacja**

```bash
git clone https://github.com/matek10000/quiz-app.git
cd quiz-app

npm install

npm install next react react-dom tailwindcss
npm install react-icons
npm install firebase
npm install @next/env
npm install @playwright/test
npm install eslint prettier husky lint-staged
```

---

## 🤝 **Wsparcie**
Masz pytania dotyczące QuizApp? Skontaktuj się ze mną!

---

## ⚠️ **Licencja**
Projekt dostępny na licencji **MIT**. Możesz go używać, kopiować i modyfikować w celach osobistych i komercyjnych.
