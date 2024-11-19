export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold mb-4">Witaj w QuizApp!</h1>
      <p className="text-lg text-gray-700 mb-6">
        Zaloguj się lub załóż konto, aby rozpocząć naukę!
      </p>
      <a
        href="/user/register"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Get Started
      </a>
    </div>
  );
}
