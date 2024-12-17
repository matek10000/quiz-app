
# QuizApp
## https://matek10000-quizapp.netlify.app/ ##
QuizApp to interaktywna aplikacja webowa zbudowana w frameworku **Next.js**, wykorzystująca **Firebase** do autoryzacji użytkowników oraz **Tailwind CSS** do stylizacji. Aplikacja oferuje rozbudowany system zarządzania quizami, w tym ich dodawanie, edytowanie, usuwanie oraz rozwiązywanie. Posiada system użytkowników z rejestracją, logowaniem oraz indywidualnymi profilami.

---

## 🚀 Funkcjonalności

### 🔹 Użytkownik
- **Rejestracja użytkownika** na podstawie e-maila i hasła.
- **Logowanie użytkownika** z weryfikacją adresu e-mail.
- **Profil użytkownika**:
  - Edycja danych użytkownika, w tym nazwa wyświetlana i zdjęcie profilowe.

---

### 🔹 Quizy
- **Dodawanie quizów**:
  - Administrator może tworzyć nowe quizy z różnymi typami pytań.
- **Edycja quizów**:
  - Możliwość edycji tytułu quizu, pytań oraz odpowiedzi.
- **Rodzaje pytań**:
  - **Pojedynczy wybór** *(Single Choice)*
  - **Wielokrotny wybór** *(Multiple Choice)*
  - **Uzupełnianie pól** *(Fill in the Fields)*
    - Możliwość dodawania dynamicznych pól oraz przypisywania poprawnych odpowiedzi.
- **Rozwiązywanie quizów**:
  - Użytkownik może rozwiązywać quizy z natychmiastowym obliczeniem wyniku.
- **Panel quizów**:
  - Dostęp do listy wszystkich quizów.
  - Edycja i usuwanie istniejących quizów (tylko dla administratorów).

---

### 🔹 Bezpieczeństwo
- **Ochrona dostępu**:
  - Strony i funkcje, takie jak panel quizów, edycja czy dodawanie quizów, dostępne tylko dla użytkowników z uprawnieniami administratora.
- **Reguły Firestore**:
  - Ograniczenie dostępu do bazy danych na podstawie uprawnień.
  - Tylko autoryzowani użytkownicy mogą wykonywać zapytania na Firestore.

---

### 🔹 Inne
- **System nawigacji**:
  - Menu boczne z dynamicznymi linkami dla zalogowanych i niezalogowanych użytkowników.
- **Top10 wyników quizów**:
  - Wyświetlanie najlepszych wyników graczy dla każdego quizu wraz z ich nazwą użytkownika i zdjęciem profilowym.
  - Wyświetlanie pozycji użytkownika spoza Top10.
- **Responsywność**:
  - Dostosowanie układu aplikacji do różnych rozdzielczości urządzeń.
- **Obsługa błędów**:
  - Informowanie użytkownika o błędach, np. brak uprawnień lub brak strony *(404)*.

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
