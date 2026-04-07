'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { CircularProgress } from '@mui/material';
import userRegister from '@/libs/userRegister';

export default function RegisterPanel() {
  const router = useRouter()
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    name: '',
    telephone: '',
    email: '',
    password: ''
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      await userRegister(
        formData.name,
        formData.telephone,
        formData.email,
        formData.password
      );

      const loginResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (loginResult?.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 1500);
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      }

    } catch (err: any) {
      console.error("Register Error:", err);
      const is500 = err.message?.includes('500');
      setErrorMsg(is500 
        ? "There was a problem, please try again later." 
        : "Unable to create an account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white w-full max-w-lg p-10 rounded-[2rem] shadow-2xl text-center mx-auto">
      {isLoading ? (
        <div className="py-10 animate-fade-in flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-8 text-black">Creating your account...</h1>
          <CircularProgress color="inherit" className="text-black" />
        </div>
      ) : isSuccess ? (
        <div className="py-10 animate-fade-in">
          <div className="text-green-500 text-6xl mb-4 font-extrabold">✓</div>
          <h1 className="text-3xl font-bold mb-4 text-black">Registration Complete!</h1>
          <p className="text-gray-600 mb-8 font-medium">Your account has been created successfully.</p>
        </div>
      ) : session ? (
        <div>
          <h1 className="text-3xl font-bold mb-8 text-black">You are already logged in.</h1>
          <Link href={callbackUrl}>
            <button className="cursor-pointer bg-black text-white font-bold py-2 px-10 rounded-full hover:bg-gray-800 transition active:scale-95">
              Continue
            </button>
          </Link>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-extrabold mb-8 text-black">Register</h1>
          {errorMsg && <p className="text-red-600 font-medium mb-4">{errorMsg}</p>}

          <form onSubmit={handleRegister} className="space-y-4 text-left">
            <input
              type="text" placeholder="Name" required
              className={`w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 ${errorMsg && !formData.name ? 'border-2 border-red-500' : 'border-2 border-gray-300'}`}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="tel" placeholder="Telephone No." required
              className={`w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 ${errorMsg && !formData.telephone ? 'border-2 border-red-500' : 'border-2 border-gray-300'}`}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
            />
            <input
              type="email" placeholder="Email" required
              className={`w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 ${errorMsg && !formData.email ? 'border-2 border-red-500' : 'border-2 border-gray-300'}`}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              type="password" placeholder="Password" required
              className={`w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 ${errorMsg && !formData.password ? 'border-2 border-red-500' : 'border-2 border-gray-300'}`}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <div className="flex justify-center pt-6">
              <button type='submit' className="cursor-pointer bg-black text-white text-lg font-bold py-2 px-6 rounded-full hover:bg-gray-800 transition active:scale-95 shadow-md">
                Register
              </button>
            </div>
          </form>

          <div className="mt-8 space-y-4">
            <p className="font-bold text-gray-600">Already have an account?</p>
            <Link href='/login'>
              <button className="cursor-pointer bg-blue-600 text-white font-bold py-2 px-8 rounded-full hover:bg-blue-800 transition active:scale-95 shadow-md">
                Log In
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}