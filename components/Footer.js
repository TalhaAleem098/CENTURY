"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin, FiArrowUp } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast("Please enter a valid email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast("Please enter a valid email address");
      return;
    }

    setSubscriptionStatus("loading");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast(data.message || "Thanks for subscribing!");
        setEmail("");
        setSubscriptionStatus("success");
      } else {
        toast(data.error || "Subscription failed. Please try again.");
        setSubscriptionStatus("error");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast("Network error. Please check your connection and try again.");
      setSubscriptionStatus("error");
    } finally {
      // Reset status after a short delay
      setTimeout(() => setSubscriptionStatus(""), 2000);
    }
  };
  return (
    <footer className="bg-gradient-to-br from-white to-gray-100 text-black border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-black mb-4">Century</h2>
              <p className="text-gray-700 leading-relaxed text-sm lg:text-base">
                Your trusted premium fashion marketplace. Delivering quality,
                comfort, and style since our founding. Experience fashion that
                defines excellence.
              </p>
            </div>{/* Newsletter Subscription Box */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4">
                Subscribe to Newsletter
              </h4>
              <form
                onSubmit={handleNewsletterSubmit}
                className="space-y-3"
              >
                <div className="w-full">
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={subscriptionStatus === "loading"}
                  />
                </div>                <div className="w-full sm:w-auto">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-black text-white rounded-md font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                    disabled={subscriptionStatus === "loading"}
                  >
                    {subscriptionStatus === "loading"
                      ? "Subscribing..."
                      : "Subscribe"}
                  </button>
                </div>
              </form>
              <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                Stay updated with our latest news, exclusive offers, and new arrivals. Unsubscribe anytime.
              </p>
            </div>            {/* End Newsletter Subscription Box */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-3">
                <a
                  href="https://www.facebook.com/profile.php?id=61576551254002"
                  className="w-10 h-10 bg-gray-200 hover:bg-black hover:text-white text-black rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  aria-label="Follow us on Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebookF className="text-sm" />
                </a>
                <a
                  href="https://www.instagram.com/century.pk?igsh=aHJvemhjbHdncXhk&utm_source=qr"
                  className="w-10 h-10 bg-gray-200 hover:bg-black hover:text-white text-black rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  aria-label="Follow us on Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram className="text-sm" />
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-700 hover:text-black transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-700 hover:text-black transition-colors duration-200"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/category"
                  className="text-gray-700 hover:text-black transition-colors duration-200"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-black transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>{" "}
              <li>
                <Link
                  href="/contact"
                  className="text-gray-700 hover:text-black transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-700 hover:text-black transition-colors duration-200"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-700 hover:text-black transition-colors duration-200"
                >
                  Privacy & Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Categories</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/category?type=hoodies"
                  className="text-gray-700 hover:text-black transition-colors duration-200"
                >
                  Hoodies
                </Link>
              </li>
              <li>
                <Link
                  href="/category?type=t-shirts"
                  className="text-gray-700 hover:text-black transition-colors duration-200"
                >
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link
                  href="/category?type=sweatshirts"
                  className="text-gray-700 hover:text-black transition-colors duration-200"
                >
                  Sweatshirts
                </Link>
              </li>
              <li>
                <Link
                  href="/category?type=oversized"
                  className="text-gray-700 hover:text-black transition-colors duration-200"
                >
                  Oversized Tees
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?sale=true"
                  className="text-gray-700 hover:text-black transition-colors duration-200"
                >
                  Sale Items
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?new=true"
                  className="text-gray-700 hover:text-black transition-colors duration-200"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FiMapPin className="text-black mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-700">
                   Lahore, Punjab | Pakistan
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FiPhone className="text-black flex-shrink-0" />
                <div>
                  <p className="text-gray-700">+92 322 7154205</p>
                  <p className="text-sm text-gray-500">Mon-Sat 9AM-10PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FiMail className="text-black flex-shrink-0" />
                <div>
                  <p className="text-gray-700">centuryapparelpk@gmail.com</p>
                  <p className="text-sm text-gray-500">24/7 Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Service Section */}
      <div className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7"
                  />
                </svg>
              </div>
              <h5 className="font-semibold mb-1">Free Shipping</h5>
              <p className="text-sm text-gray-500">On orders over 4999</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h5 className="font-semibold mb-1">Quality Guarantee</h5>
              <p className="text-sm text-gray-500">100% authentic products</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h5 className="font-semibold mb-1">Easy Returns</h5>
              <p className="text-sm text-gray-500">7-day return policy</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.18l6.364 6.364a9 9 0 010 12.728L12 21.82l-6.364-6.364a9 9 0 010-12.728L12 2.18z"
                  />
                </svg>
              </div>
              <h5 className="font-semibold mb-1">24/7 Support</h5>
              <p className="text-sm text-gray-500">Always here to help</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-500">
                © {currentYear} Century Fashion Store. All rights reserved.
              </p>
            </div>{" "}
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-black transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-500 hover:text-black transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                href="/faq"
                className="text-gray-500 hover:text-black transition-colors duration-200"
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                className="text-gray-500 hover:text-black transition-colors duration-200"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <FiArrowUp className="text-lg" />
        </button>
      )}
    </footer>
  );
};

export default Footer;
