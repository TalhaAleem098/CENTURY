"use client";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import Image from "next/image";

export default function AboutClient() {
  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-6xl mx-auto px-6 py-20 space-y-20">
        {/* Hero Section */}
        <section className="text-center space-y-8">
          <div className="space-y-4" data-aos="fade-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About <span className="text-gray-800">Century</span>
            </h1>
            <div className="w-24 h-1 bg-black mx-auto mb-8"></div>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Redefining fashion through premium quality, modern designs, and exceptional customer experience. Discover the story behind Pakistan&apos;s trusted fashion destination.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6" data-aos="fade-right">
            <h2 className="text-4xl font-bold">Our Journey</h2>
            <div className="w-16 h-1 bg-gray-800"></div>
            <p className="text-lg leading-relaxed text-gray-700">
              Century was founded with a vision to revolutionize Pakistan&apos;s fashion landscape by offering premium quality clothing at accessible prices. What started as a passion project has grown into a trusted brand serving customers across the country.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              Our commitment to excellence, combined with modern designs and customer-centric approach, has made us a preferred choice for fashion-conscious individuals who value both style and quality.
            </p>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="bg-gray-100 rounded-2xl p-8 border-2 border-gray-200">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto flex items-center justify-center border rounded-full">
                  <Image
                    src="/assets/CENTURY.png"
                    alt="Century Logo"
                    width={80}
                    height={80}
                    className="object-contain"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-2xl font-bold">Century Fashion</h3>
                <p className="text-gray-600">
                  Premium Quality • Modern Designs • Exceptional Service
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="bg-gray-50 rounded-3xl p-12 border border-gray-200">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6" data-aos="fade-up" data-aos-delay="100">
              <h2 className="text-3xl font-bold">Our Mission</h2>
              <div className="w-12 h-1 bg-black"></div>
              <p className="text-lg text-gray-700 leading-relaxed">
                To provide premium quality fashion that empowers individuals to express their unique style with confidence, while maintaining the highest standards of customer service and satisfaction.
              </p>
            </div>
            <div className="space-y-6" data-aos="fade-up" data-aos-delay="200">
              <h2 className="text-3xl font-bold">Our Vision</h2>
              <div className="w-12 h-1 bg-black"></div>
              <p className="text-lg text-gray-700 leading-relaxed">
                To become Pakistan&apos;s leading fashion destination, known for exceptional quality, innovative designs, and customer experience that exceeds expectations at every touchpoint.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold" data-aos="fade-up">What We Stand For</h2>
            <div className="w-16 h-1 bg-black mx-auto"></div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Our values guide every decision we make and every interaction we have with our customers.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 border border-gray-200 rounded-2xl hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="0">
              <div className="w-16 h-16 bg-black rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Quality Excellence</h3>
              <p className="text-gray-700 leading-relaxed">
                Every product undergoes rigorous quality checks to ensure it meets our premium standards and exceeds customer expectations.
              </p>
            </div>
            <div className="text-center p-8 border border-gray-200 rounded-2xl hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="100">
              <div className="w-16 h-16 bg-black rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Customer First</h3>
              <p className="text-gray-700 leading-relaxed">
                Our customers are at the heart of everything we do. Their satisfaction and feedback drive our continuous improvement.
              </p>
            </div>
            <div className="text-center p-8 border border-gray-200 rounded-2xl hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="200">
              <div className="w-16 h-16 bg-black rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Innovation</h3>
              <p className="text-gray-700 leading-relaxed">
                We constantly evolve our designs, services, and customer experience to stay ahead of fashion trends and expectations.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold" data-aos="fade-up">Meet Our Founders</h2>
            <div className="w-16 h-1 bg-black mx-auto"></div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Behind Century&apos;s success are two dedicated founders committed to delivering excellence in fashion.
            </p>
          </div>
          <div className="space-y-16 max-w-5xl mx-auto">
            {/* Founder 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6" data-aos="fade-right">
                <h3 className="text-3xl font-bold">Jahanzeb Raja</h3>
                <p className="text-xl text-gray-600 font-medium">Co-Founder & Owner</p>
                <div className="w-12 h-1 bg-black"></div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Jahanzeb leads the creative direction at Century, crafting bold, culture-driven designs that stand out. His unique vision shapes the brand’s identity, turning streetwear into statements.
                </p>
              </div>
              <div className="flex justify-center" data-aos="fade-left">
                <div className="w-64 h-64 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/assets/jahanzeb-raja.jpg"
                    alt="Jahanzeb Raja - Co-Founder & Owner"
                    width={256}
                    height={256}
                    className="object-cover w-full h-full"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                </div>
              </div>
            </div>
            {/* Founder 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="flex justify-center" data-aos="fade-right">
                <div className="w-64 h-64 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/assets/daoud-ramzan.jpg"
                    alt="Daoud Ramzan - Co-Founder & Owner"
                    width={256}
                    height={256}
                    className="object-cover w-full h-full"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                </div>
              </div>
              <div className="space-y-6" data-aos="fade-left">
                <h3 className="text-3xl font-bold">Dawood Ramzan</h3>
                <p className="text-xl text-gray-600 font-medium">Co-Founder & Owner</p>
                <div className="w-12 h-1 bg-black"></div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Dawood ensures every Century piece meets top-tier quality standards. From premium fabrics to perfect finishes, he brings the craftsmanship that defines the brand.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="bg-gray-50 rounded-3xl p-12 border border-gray-200">
          <div className="text-center space-y-12">
            <div>
              <h2 className="text-4xl font-bold mb-4" data-aos="fade-up">Century in Numbers</h2>
              <div className="w-16 h-1 bg-black mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center" data-aos="fade-up" data-aos-delay="0">
                <p className="text-4xl font-bold text-black mb-2">50K+</p>
                <p className="text-gray-700 font-medium">Happy Customers</p>
              </div>
              <div className="text-center" data-aos="fade-up" data-aos-delay="100">
                <p className="text-4xl font-bold text-black mb-2">1000+</p>
                <p className="text-gray-700 font-medium">Products Delivered</p>
              </div>
              <div className="text-center" data-aos="fade-up" data-aos-delay="200">
                <p className="text-4xl font-bold text-black mb-2">95%</p>
                <p className="text-gray-700 font-medium">Customer Satisfaction</p>
              </div>
              <div className="text-center" data-aos="fade-up" data-aos-delay="300">
                <p className="text-4xl font-bold text-black mb-2">3+</p>
                <p className="text-gray-700 font-medium">Years of Excellence</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold" data-aos="fade-up">Get In Touch</h2>
            <div className="w-16 h-1 bg-black mx-auto"></div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Have questions or want to learn more about Century? We&apos;d love to hear from you.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-gray-200 rounded-2xl" data-aos="fade-up" data-aos-delay="0">
              <div className="w-12 h-12 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">Email Us</h3>
              <p className="text-gray-700">centuryapparelpk@gmail.com</p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-2xl" data-aos="fade-up" data-aos-delay="100">
              <div className="w-12 h-12 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">Call Us</h3>
              <p className="text-gray-700">+923227154205</p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-2xl" data-aos="fade-up" data-aos-delay="200">
              <div className="w-12 h-12 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0014.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">Follow Us</h3>
              <div className="flex justify-center space-x-4">
                <a href="https://www.facebook.com/profile.php?id=61576551254002" className="text-gray-700 hover:text-black transition-colors">Facebook</a>
                <a href="https://www.instagram.com/century.pk?igsh=aHJvemhjbHdncXhk&utm_source=qr" className="text-gray-700 hover:text-black transition-colors">Instagram</a>
                <a href="https://www.tiktok.com/@century.pk" className="text-gray-700 hover:text-black transition-colors">TikTok</a>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-black text-white py-16 rounded-3xl" data-aos="fade-up">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold">Ready to Experience Century?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Explore our latest collections and discover fashion that defines your style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Shop Collection
              </Link>
              <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-black transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
