"use client"
import React, { useState } from "react";

function Toast({ message, onClose, success }) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 ${
        success ? "bg-black" : "bg-black"
      }`}
      role="alert"
    >
      <div className="flex items-center gap-4">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white text-xl leading-none font-bold"
        >
          &times;
        </button>
      </div>
    </div>
  );
}

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    success: false,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast({ show: false, message: "", success: false });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setToast({ show: true, message: data.message, success: true });
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setToast({
          show: true,
          message: data.error || "Something went wrong.",
          success: false,
        });
      }
    } catch {
      setToast({
        show: true,
        message: "Something went wrong. Please try again later.",
        success: false,
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 py-12 px-4 md:px-12">
      {toast.show && (
        <Toast
          message={toast.message}
          onClose={() => setToast({ ...toast, show: false })}
          success={toast.success}
        />
      )}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <section className="bg-white border border-gray-300 rounded-2xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-black mb-4 text-center">
            Contact Us
          </h1>
          <p className="text-gray-600 text-center mb-6">
            We&apos;d love to hear from you. Fill out the form and our team will
            get back to you shortly.
          </p>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-gray-800 font-medium mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Your Name"
                required
                value={form.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-800 font-medium mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="you@example.com"
                required
                value={form.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block text-gray-800 font-medium mb-1"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Subject"
                required
                value={form.subject}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-gray-800 font-medium mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black resize-none"
                placeholder="Type your message here..."
                required
                value={form.message}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-900 font-semibold py-3 rounded-lg transition duration-200 shadow disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </section>

        <section className="bg-gray-100 border border-gray-300 rounded-2xl shadow-lg p-8 text-gray-800">
          <h2 className="text-3xl font-bold mb-4 text-black">
            Why Contact Us?
          </h2>
          <p className="mb-3 text-gray-700">
            At Century Market, your satisfaction is our top priority. Our
            support team is dedicated to providing timely assistance for all
            your needs. Whether you&apos;re a long-time customer or visiting us
            for the first time, we’re here to make your experience seamless and
            enjoyable.
          </p>
          <p className="mb-3 text-gray-700">
            You might want to get in touch with us for many reasons — from
            product questions to delivery issues, we7apos;re just one message
            away.
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>
              <strong>Product Inquiries:</strong> Get detailed information or
              recommendations on our offerings.
            </li>
            <li>
              <strong>Order Tracking:</strong> Need help finding your package?
              We&apos;ll assist with real-time updates.
            </li>
            <li>
              <strong>Returns & Refunds:</strong> Not satisfied? Our return
              policy is simple and customer-friendly.
            </li>
            <li>
              <strong>Shipping Questions:</strong> Learn about delivery
              timelines, international shipping, and fees.
            </li>
            <li>
              <strong>Payment Issues:</strong> Trouble during checkout? We’ll
              help resolve billing and payment errors.
            </li>
            <li>
              <strong>Bulk & Wholesale Orders:</strong> Business inquiries and
              special requests are welcome.
            </li>
            <li>
              <strong>Website Issues:</strong> Report technical problems or
              suggest improvements.
            </li>
            <li>
              <strong>Promotions & Discounts:</strong> Need help applying a
              coupon or checking validity?
            </li>
            <li>
              <strong>Feedback & Suggestions:</strong> Tell us what you love,
              what you don’t, or what you’d like to see improved.
            </li>
            <li>
              <strong>Account Support:</strong> Assistance with login, password
              reset, or profile updates.
            </li>
          </ul>
          <p className="mt-4 text-gray-700">
            Our team is available 7 days a week to ensure you get the help you
            need — quickly, clearly, and kindly.
          </p>
        </section>
      </div>

      {/* Full Width Info Section */}
      <div className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 space-y-12 text-gray-800">
          {/* Contact Info */}
          <section>
            <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p>
                <strong>Email:</strong> support@centurymarket.com
              </p>
              <p>
                <strong>Phone:</strong> +1 (800) 123-4567
              </p>
              <p className="sm:col-span-2">
                <strong>Address:</strong> 123 Market Street, Suite 100,
                Cityville
              </p>
              <p className="sm:col-span-2">
                <strong>Hours:</strong> Mon–Sat 8:00am–8:00pm, Sun
                10:00am–6:00pm
              </p>
            </div>
          </section>

          {/* Payment Methods */}
          <section>
            <h3 className="text-2xl font-bold mb-4">Payment Methods</h3>
            <p className="text-gray-700 mb-2">
              We accept a variety of secure payment options:
            </p>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Credit/Debit Cards (Visa, MasterCard, AmEx)</li>
              <li>PayPal</li>
              <li>Apple Pay & Google Pay</li>
              <li>Bank Transfers (for bulk orders)</li>
              <li>Gift Cards & Promo Codes</li>
            </ul>
          </section>

          {/* Order Tracking */}
          <section>
            <h3 className="text-2xl font-bold mb-4">Track Your Order</h3>
            <p className="text-gray-700">
              After placing an order, you’ll receive a confirmation email with a
              tracking link. If you didn’t get one,{" "}
              <a href="#" className="text-black font-medium underline">
                click here
              </a>{" "}
              to track using your order number and email.
            </p>
          </section>

          {/* FAQs */}
          <section>
            <h3 className="text-2xl font-bold mb-4">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {[
                [
                  "How long does it take to receive a response?",
                  "We typically reply within 24 hours (business days). Urgent issues can be resolved faster by phone.",
                ],
                [
                  "Can I change my order or address after purchase?",
                  "Yes — contact us before shipping for changes.",
                ],
                [
                  "Do you ship internationally?",
                  "Yes, international shipping is available. Rates vary by region.",
                ],
                [
                  "How do I cancel an order?",
                  "Email us with your order number. Orders can only be canceled before dispatch.",
                ],
                [
                  "What is your return policy?",
                  "Returns are accepted within 30 days. Product must be unused and in original condition.",
                ],
                [
                  "Are my payments secure?",
                  "Yes — we use industry-standard SSL encryption and secure processors.",
                ],
                [
                  "Can I use a promo code?",
                  "Yes, apply it at checkout. Make sure it's valid and not expired.",
                ],
                [
                  "Do you offer gift wrapping?",
                  "Yes! Select gift wrap at checkout for a small fee.",
                ],
              ].map(([q, a], i) => (
                <div key={i}>
                  <p className="font-semibold">Q: {q}</p>
                  <p className="text-gray-600">A: {a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* About */}
          <section>
            <h3 className="text-2xl font-bold mb-4">About Century Market</h3>
            <p className="text-gray-700">
              Century Market is an online destination for modern consumers. Our
              mission is to combine quality, affordability, and service to
              create a smooth shopping experience for everyone. From daily
              essentials to specialty items, we aim to exceed your expectations.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
