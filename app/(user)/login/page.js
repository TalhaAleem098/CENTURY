'use client';

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";


export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingGithub, setIsLoadingGithub] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace('/');
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white text-xl font-semibold">
        Checking session...
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-2">Sign in with your favorite provider</p>
        </div>
        <div className="flex flex-col gap-4">
          <button
            onClick={async () => {
              setIsLoadingGoogle(true);
              await signIn("google");
              // Do not setIsLoadingGoogle(false) to keep it blocked until navigation
            }}
            className={`flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg shadow-sm transition duration-200 ${isLoadingGoogle ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isLoadingGoogle || isLoadingGithub}
          >
            {isLoadingGoogle ? (
              <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            ) : (
              <FcGoogle size={22} />
            )}
            <span className="text-sm font-medium text-gray-700">{isLoadingGoogle ? 'Signing in...' : 'Continue with Google'}</span>
          </button>
          <button
            onClick={async () => {
              setIsLoadingGithub(true);
              await signIn("github");
              // Do not setIsLoadingGithub(false) to keep it blocked until navigation
            }}
            className={`flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow-sm transition duration-200 ${isLoadingGithub ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isLoadingGoogle || isLoadingGithub}
          >
            {isLoadingGithub ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            ) : (
              <FaGithub size={22} />
            )}
            <span className="text-sm font-medium">{isLoadingGithub ? 'Signing in...' : 'Continue with GitHub'}</span>
          </button>
        </div>
      </div>
    </main>
  );
}
