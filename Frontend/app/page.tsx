import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-[var(--primary-lavender)]">
      <h1 className="text-5xl font-bold text-gray-800 mb-6">Pathwise</h1>
      <p className="text-xl text-gray-600 mb-12">Your AI-powered study companion.</p>
      
      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="px-8 py-3 bg-[var(--accent-sky)] rounded-xl hover:bg-blue-300 transition-colors text-gray-900 font-bold text-lg shadow-sm"
        >
          Enter App
        </Link>
      </div>
    </main>
  );
}
