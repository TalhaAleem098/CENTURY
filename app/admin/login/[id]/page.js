"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import Loading from "./loading";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminLoginPage() {
  const params = useParams();
  const { id } = params;
  const [valid, setValid] = useState(null);
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const adminId = process.env.NEXT_PUBLIC_ADMIN_ID || process.env.ADMIN_ID;
    if (!id || id !== adminId) {
      // console.log("Admin ID : ", adminId , " : ", id);
      setValid(false);
    } else {
      setValid(true);
    }
  }, [id]);

  if (valid === false) {
    notFound();
    return null;
  }

  if (valid === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loading />
      </div>
    );
  }

  const Navbar = (
    <nav className="w-full bg-white shadow-md py-4 px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        CENTURY
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-200 transition"
          aria-label="Go Back"
        >
          Back
        </button>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-900 transition"
          aria-label="Go Home"
        >
          Home
        </button>
      </div>
    </nav>
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "https://centurypk.com";
      const res = await fetch(`${baseUrl}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast(data.error || "Login failed", { position: "top-center" });
        setLoading(false);
        return;
      }

      const token =
        res.headers.get("authorization") || res.headers.get("x-auth-token");

      if (token) {
        localStorage.setItem("admin_token", token);
      } else {
        console.warn("No auth token found in response headers");
      }

      toast("Login successful! Redirecting...", {
        position: "top-center",
      });
      setLoading(false);

      setTimeout(() => router.push("/admin/dashboard"), 1200);
    } catch (err) {
      toast(err.message, { position: "top-center" });
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {Navbar}
      <main className="flex items-center justify-center min-h-[80vh] p-6 bg-gradient-to-tr from-gray-200 via-gray-100 to-gray-200">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-300 p-12 space-y-8">
          <div className="flex flex-col items-center p-0 m-0 w-full">
           centurypk.com
            <p className="mt-3 text-center text-gray-500 text-sm font-light max-w-xs">
              Securely manage your admin dashboard and access exclusive
              features.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="email"
                className="peer w-full px-5 pt-6 pb-2 rounded-xl border border-gray-400 bg-gray-100 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition cursor-text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder=" "
              />
              <label
                className="
            absolute left-5 top-3 text-gray-500 text-sm
            peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
            peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-700
            pointer-events-none
            transition-all duration-300 ease-in-out
          "
              >
                Email
              </label>
            </div>

            <div className="relative">
              <input
                type="password"
                className="peer w-full px-5 pt-6 pb-2 rounded-xl border border-gray-400 bg-gray-100 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition cursor-text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder=" "
              />
              <label
                className="
            absolute left-5 top-3 text-gray-500 text-sm
            peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
            peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-700
            pointer-events-none
            transition-all duration-300 ease-in-out
          "
              >
                Password
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-black focus:outline-none focus:ring-4 focus:ring-gray-600 disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer"
              disabled={loading || !email || !password}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="flex items-center gap-3 text-sm text-gray-400">
            <div className="flex-1 h-px bg-gray-300" />
            <span>or continue with</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => signIn("google")}
              className="flex items-center justify-center gap-3 w-full py-3 rounded-xl border border-gray-400 hover:bg-gray-100 transition text-gray-800 text-base font-medium shadow-sm cursor-pointer"
            >
              <FcGoogle size={22} />
              Continue with Google
            </button>
            <button
              onClick={() => signIn("github")}
              className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-gray-900 text-white hover:bg-black transition text-base font-medium shadow-md cursor-pointer"
            >
              <FaGithub size={22} />
              Continue with GitHub
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
