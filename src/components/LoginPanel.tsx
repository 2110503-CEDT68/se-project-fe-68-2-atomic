'use client';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

export default function LoginPanel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const { data: session } = useSession();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please provide your email and password.");
      return;
    }
    setError('')
    setIsLoading(true);
    console.log("Login with:", { email, password });

    // Use Sign in of Next Auth
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Email or Password is incorrect')
      setIsLoading(false);
    } else {
      // router.push(callbackUrl)
      // router.refresh() // Force Refresh to update TopMenu
      window.location.href = callbackUrl;
    }
  };

  return (
    <div className="bg-white w-[calc(100vh-64px)] max-w-lg p-10 rounded-[2rem] shadow-2xl text-center">
      {
        isLoading ? (
          <div className="py-10 animate-fade-in">
            <h1 className="text-3xl font-bold mb-4 text-black">Logging in...</h1>
            <CircularProgress />
          </div>
        ) : session ? <div>
          <h1 className="text-3xl font-bold mb-8 text-black">You are already logged in.</h1>
          <Link href={callbackUrl}>
            <button className="cursor-pointer bg-black text-white font-bold py-2 px-10 rounded-full hover:bg-gray-800 transition active:scale-95">
              Continue
            </button>
          </Link>
        </div>
          :
          <div>
            <h1 className="text-3xl font-bold mb-8 text-black">Enter your info to sign in</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email" placeholder="Email" required
                className={`w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${error === "Please provide your email and password." && !email ? "border-2 border-red-500" : "border border-gray-400"}`}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password" placeholder="Password" required
                className={`w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${error === "Please provide your email and password." && !password ? "border-2 border-red-500" : "border border-gray-400"}`}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="pt-4">
                <button type='submit' className="cursor-pointer bg-black text-white font-bold py-2 px-8 rounded-full hover:bg-gray-800 transition active:scale-95">
                  Log In
                </button>
              </div>
            </form>

            <div className="mt-8 space-y-4">
              <p className="font-bold text-black">Or get started with a new account.</p>
              <Link href='/register'>
                <button className="cursor-pointer bg-red-600 text-white font-bold py-2 px-6 rounded-full hover:bg-red-800 transition active:scale-95">
                  Register
                </button>
              </Link>
            </div>
          </div>
      }
    </div>
  );
}