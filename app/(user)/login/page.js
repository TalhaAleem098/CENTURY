'use client';

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // ("Status is : ", status)
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
            onClick={() => signIn("google")}
            className="flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg shadow-sm transition duration-200"
          >
            <FcGoogle size={22} />
            <span className="text-sm font-medium text-gray-700">Continue with Google</span>
          </button>
          <button
            onClick={() => signIn("github")}
            className="flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow-sm transition duration-200"
          >
            <FaGithub size={22} />
            <span className="text-sm font-medium">Continue with GitHub</span>
          </button>
        </div>
      </div>
    </main>
  );
}
