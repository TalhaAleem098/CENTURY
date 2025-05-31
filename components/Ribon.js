"use client"
import React, { useState, useEffect, useRef } from 'react'
import { FaFacebookF, FaInstagram } from 'react-icons/fa'
import gsap from 'gsap'
import Image from 'next/image'

const carouselTexts = [
  'FREE SHIPPING ON ORDERS ABOVE 3999',
  'CULT OF CYPHER VOLUME 1 IS LIVE NOW',
  'LIMITED TIME DEALS JUST FOR YOU',
  'SIGN UP & GET 10% OFF INSTANTLY',
  'NEW DROPS EVERY FRIDAY — DON’T MISS OUT',
  'EASY RETURNS WITHIN 7 WORKING DAYS',
  'COD AVAILABLE ACROSS PAKISTAN',
  'FOLLOW US FOR STYLE UPDATES',
  'EXCLUSIVE ACCESS FOR EARLY BIRDS',
  'QUALITY GUARANTEED OR MONEY BACK'
]

const Ribon = () => {
  const [current, setCurrent] = useState(0)
  const textRef = useRef(null)
  const timerRef = useRef(null)

  const animateText = () => {
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    )
  }

  const nextText = () => {
    setCurrent((prev) => (prev + 1) % carouselTexts.length)
  }

  const prevText = () => {
    setCurrent((prev) => (prev - 1 + carouselTexts.length) % carouselTexts.length)
  }

  useEffect(() => {
    animateText()
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselTexts.length)
    }, 5000)
    return () => clearInterval(timerRef.current)
  }, [current])

  return (
    <div className="w-full bg-gradient-to-r from-black via-gray-900 to-black text-white flex items-center justify-between px-3 sm:px-4 py-4 sm:py-3 border-b border-gray-800">
      <div className="hidden md:flex gap-3 items-center">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative w-9 h-9 flex items-center justify-center bg-white text-blue-600 rounded-full shadow-md hover:bg-blue-600 hover:text-white transition-all duration-300"
        >
          <FaFacebookF size={22} />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative w-9 h-9 flex items-center justify-center bg-white text-pink-600 rounded-full shadow-md hover:bg-gradient-to-tr hover:from-pink-500 hover:via-red-500 hover:to-yellow-500 hover:text-white transition-all duration-300"
        >
          <FaInstagram size={22} />
        </a>
      </div>

      {/* Main Text with Arrows */}
      <div className="flex items-center gap-1 sm:gap-2 mx-auto">
        <button
          onClick={prevText}
          className="hidden sm:block px-2 py-1 rounded hover:bg-gray-700 transition-colors min-w-[32px]"
        >
          &#8592;
        </button>
        <span
          ref={textRef}
          className="block text-center px-2 sm:px-3 font-semibold text-[10px] sm:text-sm md:text-base tracking-wide w-full max-w-[90vw] sm:max-w-[340px] md:max-w-[420px] lg:max-w-[500px]"
        >
          {carouselTexts[current]}
        </span>
        <button
          onClick={nextText}
          className="hidden sm:block px-2 py-1 rounded hover:bg-gray-700 transition-colors min-w-[32px]"
        >
          &#8594;
        </button>
      </div>

      {/* Optimized Logo */}
      <div className="hidden md:block w-[100px] h-[40px] relative">
        <Image
          src="/CENTURY.png"
          alt="Logo"
          fill
          sizes="100px"
          className="object-contain"
          priority
        />
      </div>
    </div>
  )
}

export default Ribon
