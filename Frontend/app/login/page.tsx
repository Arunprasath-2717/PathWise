"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getIdToken } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }
      
      const token = await getIdToken(userCredential.user);
      
      // Always sync the user to Supabase DB via backend (works for both signup and login recovery)
      const syncRes = await fetch(`http://localhost:8000/sync-user`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
      });
      if (!syncRes.ok) {
        throw new Error("Failed to sync user with database");
      }

      if (!isLogin) {
        alert("Signup successful! You are now logged in.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user_id", userCredential.user.uid);
      
      // Fetch student profile ID
      const profRes = await fetch(`http://localhost:8000/student-profile`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (profRes.ok) {
        const profData = await profRes.json();
        localStorage.setItem("student_id", profData.student_id);
      }
      router.push("/dashboard");

    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--primary-lavender)]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border-t-4 border-[var(--accent-sky)]">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {isLogin ? "Welcome Back" : "Join Pathwise"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[var(--accent-sky)] focus:border-[var(--accent-sky)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[var(--accent-sky)] focus:border-[var(--accent-sky)]"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-[var(--accent-sky)] hover:bg-blue-300 text-gray-900 font-bold py-2 px-4 rounded-md transition-colors"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)} 
            className="text-[var(--accent-sky)] hover:underline font-medium"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
