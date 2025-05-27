"use client";
import Link from 'next/link';
import { FaExclamationTriangle } from 'react-icons/fa';
import 'animate.css';

export default function CustomError({ statusCode }) {
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div className="text-center p-6 md:p-10">
        <h1
          className="text-5xl font-extrabold mb-3 animate__animated animate__bounce animate__delay-1s"
          style={{ color: "var(--bold-text-color)" }}
        >
          Error {statusCode || 404}
        </h1>
        <h2
          className="text-xl font-semibold mb-4 animate__animated animate__fadeIn animate__delay-1s"
          style={{ color: "var(--text-color)" }}
        >
          Oops! Something went wrong.
        </h2>
        <div
          className="flex justify-center items-center mb-6"
          style={{ color: "var(--highlight)" }}
        >
          <FaExclamationTriangle
            size={100}
            className="animate__animated animate__wobble animate__delay-1s"
          />
        </div>
        <p
          className="text-base mb-6 animate__animated animate__fadeIn animate__delay-1.5s"
          style={{ color: "var(--text-color)" }}
        >
          We&#39;re sorry, but an error occurred. Our team is working hard to fix it. Please try again later.
        </p>
        <div className="space-x-3 animate__animated animate__fadeIn animate__delay-2s">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 text-base font-medium border rounded-md shadow-md transition-all duration-300"
            style={{
              backgroundColor: "var(--button-bg)",
              color: "var(--button-text)",
              borderColor: "var(--border-color)",
            }}
          >
            Retry
          </button>
          <Link href="/">
            <button
              className="inline-flex items-center px-4 py-2 text-base font-medium border rounded-md shadow-md transition-all duration-300"
              style={{
                backgroundColor: "var(--button-bg)",
                color: "var(--button-text)",
                borderColor: "var(--border-color)",
              }}
            >
              Go to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

CustomError.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
