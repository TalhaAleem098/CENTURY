"use client";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import "animate.css";

export default function NotFoundPage() {
  return (
    <div
      className="flex items-center justify-center min-h-screen px-4"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div className="text-center max-w-md w-full animate__animated animate__fadeIn">
        <h1
          className="text-6xl font-extrabold mb-2 animate__animated animate__bounceInDown"
          style={{ color: "var(--bold-text-color)" }}
        >
          404
        </h1>
        <h2
          className="text-xl md:text-2xl font-semibold mb-4 animate__animated animate__fadeInUp"
          style={{ color: "var(--text-color)" }}
        >
          Page Not Found
        </h2>

        <div
          className="flex justify-center mb-6 animate__animated animate__pulse animate__delay-1s"
          style={{ color: "var(--highlight)" }}
        >
          <FaSearch size={60} />
        </div>

        <p
          className="text-sm md:text-base mb-8 animate__animated animate__fadeIn animate__delay-1s"
          style={{ color: "var(--text-color)" }}
        >
          Sorry, the page you&#39;re looking for doesn&#39;t exist or may have
          been moved. Let us guide you home.
        </p>

        <button
          onClick={() => {
            window.history.back();
          }}
          className="px-5 py-2.5 text-sm md:text-base font-medium border rounded-md transition-all duration-200 shadow-md animate__animated animate__fadeInUp animate__delay-2s"
          style={{
            backgroundColor: "var(--button-bg)",
            color: "var(--button-text)",
            borderColor: "var(--border-color)",
          }}
        >
          ⬅ Go Back
        </button>
      </div>
    </div>
  );
}
